import axios from 'axios';
import { store } from '../store/store';

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
      const res = await instance.get('/auth/jwt/login');
      // If user has never logged in before, redirect to consent screen
      if (res.status === 210) {
        window.location = res.data;
        return;
      }

      return res;
    },
    logout: async () => {
      await instance.get('/auth/jwt/logout');
    },
    loginStatus: async () => {
      const res = await instance.get('/auth/jwt/login-status');
      return JSON.parse(res.data); // response boolean
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
    },
    callbackExecute: async code => {
      const res = await instance.get(`/auth/passport/callback?code=${code}`);
      return res;
    },
    loginStatus: async () => {
      const res = await instance.get('/auth/passport/login-status');
      return JSON.parse(res.data); // response boolean
    },
  },
  workflows: {
    createWorkflowDefinition: async templateType => {
      try {
        const res = await instance.post('/workflows/create', { templateType: templateType });
        return res;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          return error.response;
        }
        throw error;
      }
    },
    cancelWorkflowInstance: async workflow => {
      try {
        const res = await instance.put(`/workflows/${workflow.definitionId}/instances/${workflow.instanceId}/cancel`);
        return res;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          return error.response;
        }
        throw error;
      }
    },
    publishWorkflow: async workflowId => {
      const res = await instance.post('/workflows/publish', { workflowId });

      if (res.status === 210) {
        try {
          window.open(res.data, 'newTab', 'width=800,height=600');
          await new Promise(r => setTimeout(r, 3000));

          const published = await instance.post('/workflows/publish', { workflowId });
          return published;
        } catch (error) {
          console.log(error);
        }
      }

      return res;
    },
    getWorkflowDefinitions: async () => {
      const res = await instance.get(`/workflows/definitions`);
      return res;
    },
    getWorkflowInstance: async workflow => {
      const res = await instance.get(`/workflows/${workflow.definitionId}/instances/${workflow.instanceId}`);
      return res;
    },
    getWorkflowInstances: async definitionId => {
      const res = await instance.get(`/workflows/${definitionId}/instances`);
      return res;
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
