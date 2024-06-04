function readRequiredEnvVariable(variableName) {
  const value = process.env[variableName];
  if (!value) throw new Error(`Can not read the ${variableName} from the env variables`);
  return value;
}

function extractPort(url) {
  const regex = /https?:\/\/[^:]+:(\d+)/;
  const match = url.match(regex);
  if (match) return Number(match[1]);

  throw new Error("PORT wasn't extracted. It wasn't found in received url");
}

const config = {
  nodeEnv: readRequiredEnvVariable('NODE_ENV'),
  backendHost: readRequiredEnvVariable('BACKEND_HOST'),
  backendPort: extractPort(readRequiredEnvVariable('BACKEND_HOST')),
  redirectUri: readRequiredEnvVariable('REDIRECT_URI'),
  dsOauthServer: readRequiredEnvVariable('DS_OAUTH_SERVER'),
  userId: readRequiredEnvVariable('USER_ID'),
  clientId: readRequiredEnvVariable('DS_CLIENT_ID'),
  clientSecret: readRequiredEnvVariable('DS_CLIENT_SECRET'),
  targetAccountId: JSON.parse(readRequiredEnvVariable('TARGET_ACCOUNT_ID')),
  sessionSecret: readRequiredEnvVariable('SESSION_SECRET'),
  frontendPort: readRequiredEnvVariable('FRONTEND_PORT'),
};

module.exports = config;
