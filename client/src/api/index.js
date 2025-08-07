import axios from 'axios';
import { persistor, store } from '../store/store';
import { clearAllState } from '../store/actions';

const isDev = process.env.NODE_ENV === 'development';
const apiUrl = isDev ? process.env.BACKEND_DEV_HOST : process.env.BACKEND_PROD_HOST;

const clearState = async () => {
  store.dispatch(clearAllState());
  await persistor.purge();
  localStorage.clear();
};

const instance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

instance.interceptors.response.use(
  response => response,
  async err => {
    if (err?.response?.status === 401) {
      await clearState();
    }
    throw err;
  }
);

export const api = Object.freeze({
  jwt: {
    // Login by JSON Web Token
    login: async () => {
      const response = await instance.get('/auth/jwt/login');
      // If user has never logged in before, redirect to consent screen
      if (response.status === 210) {
        window.location = response.data;
        return;
      }

      return response;
    },
    logout: async () => {
      await instance.get('/auth/jwt/logout');
      await clearState();
    },
    loginStatus: async () => {
      const response = await instance.get('/auth/jwt/login-status');
      return JSON.parse(response.data); // response boolean
    },
  },
  acg: {
    // Login by Authorization Code Grant
    login: () => {
      // Avoid here XHR requests because we encounter problems with CORS for ACG Authorization
      window.location.href = `${apiUrl}/auth/passport/login`;
    },
    logout: async () => {
      await instance.get('/auth/passport/logout');
      await clearState();
    },
    callbackExecute: async code => {
      const response = await instance.get(`/auth/passport/callback?code=${code}`);
      return response;
    },
    loginStatus: async () => {
      const response = await instance.get('/auth/passport/login-status');
      return JSON.parse(response.data); // response boolean
    },
  },
  workflows: {
    triggerWorkflow: async (workflowId, templateType, body) => {
      try {
        const response = await instance.put(`/workflows/${workflowId}/trigger?type=${templateType}`, body);
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    getWorkflowDefinitions: async () => {
      const response = await instance.get(`/workflows/definitions`);
      return response;
    },
    getWorkflowTriggerRequirements: async workflowId => {
      try {
        const response = await instance.get(`/workflows/${workflowId}/requirements`);
        return response;
      } catch (error) {
        return error.response;
      }
    },
    pauseWorkflow: async workflow => {
      try {
        const response = await instance.post(`/workflows/${workflow.id}/pause`);
        return response;
      } catch (error) {
        return error.response;
      }
    },
    resumeWorkflow: async workflow => {
      try {
        const response = await instance.post(`/workflows/${workflow.id}/resume`);
        return response;
      } catch (error) {
        return error.response;
      }
    },
    getWorkflowInstances: async workflowId => {
      const response = await instance.get(`/workflows/${workflowId}/instances`);
      return response;
    },
    cancelWorkflowInstance: async (workflowId, instanceId) => {
      const response = await instance.post(`/workflows/${workflowId}/instances/${instanceId}/cancel`);
      return response;
    }
  },
});
