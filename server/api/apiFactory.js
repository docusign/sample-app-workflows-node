const configureInterceptors = (api, accessToken) => {
  // Request interceptor for API calls
  api.interceptors.request.use(
    async config => {
      config.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    },
    error => {
      Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    response => response,
    error => {
      // eslint-disable-next-line no-console
      console.error(`API call failed. Error:  ${error}`);
      return Promise.reject(error);
    }
  );
  return api;
};

const createAPI = (axios, accessToken) => {
  const api = configureInterceptors(
    axios.create({
      withCredentials: false,
    }),
    accessToken
  );
  return api;
};

const createMaestroApi = (axios, basePath, accountId, accessToken) => {
  const api = createAPI(axios, accessToken);

  const getWorkflowDefinitions = async params => {
    const response = await api.get(`${basePath}/accounts/${accountId}/workflows`, { params });
    return response.data;
  };

  const getTriggerRequirements = async workflowId => {
    const response = await api.get(`${basePath}/accounts/${accountId}/workflows/${workflowId}/trigger-requirements`);
    return response.data;
  };

  const triggerWorkflow = async (args, triggerUrl) => {
    const response = await api.post(triggerUrl);
    return response.data;
  };

  return {
    getWorkflowDefinitions,
    getTriggerRequirements,
    triggerWorkflow,
  };
};

module.exports = { createMaestroApi };
