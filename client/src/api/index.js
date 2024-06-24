import axios from 'axios';
import { persistor, store } from '../store/store';

const apiUrl = process.env.BACKEND_API;

const instance = axios.create({
  baseURL: `${apiUrl}/api`,
  withCredentials: true,
});

instance.interceptors.response.use(
  response => response,
  err => {
    if (err?.response?.status === 401) {
      store.dispatch({ type: 'CLEAR_STATE' });
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
      await persistor.purge();
      localStorage.clear();
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
      window.location.href = `${apiUrl}/api/auth/passport/login`;
    },
    logout: async () => {
      await instance.get('/auth/passport/logout');
      await persistor.purge();
      localStorage.clear();
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
    createWorkflowDefinition: async templateType => {
      try {
        const response = await instance.post('/workflows/create', { templateType: templateType });
        return response;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          return error.response;
        }
        throw error;
      }
    },
    cancelWorkflowInstance: async workflow => {
      try {
        const response = await instance.put(`/workflows/${workflow.id}/instances/${workflow.instanceId}/cancel`);
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    publishWorkflow: async workflowId => {
      const response = await instance.post('/workflows/publish', { workflowId });

      if (response.status === 210) {
        try {
          window.open(response.data, 'newTab', 'width=800,height=600');
          await new Promise(r => setTimeout(r, 3000));

          const published = await instance.post('/workflows/publish', { workflowId });
          return published;
        } catch (error) {
          console.log(error);
        }
      }

      return response;
    },
    triggerWorkflow: async (workflowId, body) => {
      try {
        const response = await instance.put(`/workflows/${workflowId}/trigger`, body);
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    getWorkflowDefinitions: async () => {
      const response = await instance.get(`/workflows/definitions`);
      return response;
    },
    getWorkflowInstance: async workflow => {
      const response = await instance.get(`/workflows/${workflow.id}/instances/${workflow.instanceId}`);
      return response;
    },
    getWorkflowInstances: async workflowId => {
      const response = await instance.get(`/workflows/${workflowId}/instances`);
      return response;
    },
    downloadWorkflowTemplate: async templateName => {
      try {
        const response = await fetch(`/workflows/download/${templateName}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = templateName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
