function readRequiredEnvVariable(variableName) {
  const value = process.env[variableName];
  if (!value) throw new Error(`Can not read the ${variableName} from the env variables`);
  return value;
}

const config = {
  nodeEnv: readRequiredEnvVariable('NODE_ENV'),
  backendHost: readRequiredEnvVariable('BACKEND_HOST'),
  backendPort: Number(readRequiredEnvVariable('BACKEND_PORT')),
  redirectUri: readRequiredEnvVariable('REDIRECT_URI'),
  dsOauthServer: readRequiredEnvVariable('DS_OAUTH_SERVER'),
  userId: readRequiredEnvVariable('USER_ID'),
  clientId: readRequiredEnvVariable('DS_CLIENT_ID'),
  clientSecret: readRequiredEnvVariable('DS_CLIENT_SECRET'),
  targetAccountId: JSON.parse(readRequiredEnvVariable('TARGET_ACCOUNT_ID')),
  sessionSecret: readRequiredEnvVariable('SESSION_SECRET'),
  reactBackendApi: readRequiredEnvVariable('BACKEND_API'),
};

module.exports = config;
