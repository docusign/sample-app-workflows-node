function readRequiredEnvVariable(variableName) {
  const value = process.env[variableName];
  if (!value) throw new Error(`Can not read the ${variableName} from the env variables`);
  return value;
}

const nodeEnv = readRequiredEnvVariable('NODE_ENV');

const config = {
  nodeEnv: nodeEnv,
  backendHost: readRequiredEnvVariable('BACKEND_HOST'),
  backendPort: Number(readRequiredEnvVariable('BACKEND_PORT')),
  redirectUri: readRequiredEnvVariable('REDIRECT_URI'),
  dsOauthServer: readRequiredEnvVariable('DS_OAUTH_SERVER'),
  userId: readRequiredEnvVariable('USER_ID'),
  clientId: readRequiredEnvVariable('DS_CLIENT_ID'),
  clientSecret: readRequiredEnvVariable('DS_CLIENT_SECRET'),
  targetAccountId: JSON.parse(readRequiredEnvVariable('TARGET_ACCOUNT_ID')),
  sessionSecret: readRequiredEnvVariable('SESSION_SECRET'),
  frontendHost:
    nodeEnv === 'development'
      ? readRequiredEnvVariable('FRONTEND_DEV_HOST')
      : readRequiredEnvVariable('FRONTEND_PROD_HOST'),
};

module.exports = config;
