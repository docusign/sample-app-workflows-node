import axios from 'axios';

const apiUrl = process.env.BACKEND_API;

const instance = axios.create({
  baseURL: `${apiUrl}/api`,
  withCredentials: true,
});

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
    cancelWorkflowInstance: async workflow => {
      try {
        const res = await instance.put(`/workflows/${workflow.instanceId}cancel`);
        return res;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          return error.response;
        }
        throw error;
      }
    },

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
    downloadWorkflowTemplate: async templateName => {
      // await instance.get(`/workflows/download/${templateName}`);
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
        console.error('There was an error during donloading:', error);
      }
    },

    getWorkflowInstance: async (workflow) => {
      const res = await instance.get(`/workflows/instances/${workflow.instanceId}`);
      return res;
    },

    getWorkflowInstances: async () => {
      const res = await instance.get('/workflows/instances');
      return res;
    },
  },
});
