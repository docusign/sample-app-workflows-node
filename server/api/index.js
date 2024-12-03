const axios = require('axios');
const { createMaestroApi } = require('./apiFactory');

const initMaestroApi = (accountId, basePath, accessToken) => createMaestroApi(axios, basePath, accountId, accessToken);

module.exports = { initMaestroApi };
