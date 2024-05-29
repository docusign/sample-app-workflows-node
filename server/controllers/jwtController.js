const fs = require('fs'); // Used to parse RSA key
const path = require('path');
const docusign = require('docusign-esign');
const dayjs = require('dayjs'); // Used to set and determine a token's expiration date

const ResponseStatus = {
  ConsentRequired: 'Consent required. Follow redirectUri in browser and give consent access.',
};

const oAuth = docusign.ApiClient.OAuth;
const restApi = docusign.ApiClient.RestApi;

// JWT flow:
// 1. Create consent URI and obtain user consent.
// 2. Construct JWT using the IK and User ID, scope, RSA public and private key.
// 3. Send POST containing the JWT to DS_AUTH_SERVER to get access token.
// 4. Using the access token, send a POST to get the user's base URI (account_id + base_uri).
// 5. Now you can use the access token and base URI to make API calls.
// When the access token expires, create a new JWT and request a new access token.

class JwtController {
  // Constants
  static rsaKey = fs.readFileSync(path.resolve(__dirname, '../../private.key'));
  static jwtLifeSec = 60 * 60; // requested lifetime for the JWT is 60 min
  static scopes = ['signature', 'aow_manage', 'impersonation'];
  static webformsScopes = ['webforms_read', 'webforms_instance_read', 'webforms_instance_write'];
  static dsApi = new docusign.ApiClient();

  // For production environment, change "DEMO" to "PRODUCTION"
  static basePath = restApi.BasePath.DEMO; // https://demo.docusign.net/restapi
  static oAuthBasePath = oAuth.BasePath.DEMO; // account-d.docusign.com

  /**
   * Creates and sends a JWT token using the integration key, user ID, scopes and RSA key.
   * Then stores the returned access token and expiration date.
   */
  static getToken = async () => {
    // Get API client and set the base paths
    this.dsApi.setOAuthBasePath(this.oAuthBasePath);

    // Request a JWT token
    const results = await this.dsApi.requestJWTUserToken(
      process.env.DS_JWT_CLIENT_ID,
      process.env.USER_ID,
      this.scopes.concat(this.webformsScopes),
      this.rsaKey,
      this.jwtLifeSec
    );

    const expiresAt = dayjs().add(results.body.expires_in, 's');

    return {
      accessToken: results.body.access_token,
      tokenExpirationTimestamp: expiresAt.format(),
    };
  };

  /**
   * Checks to see that the current access token is still valid, and if not,
   * updates the token.
   * Must be called before every Docusign API call.
   */
  static checkToken = async req => {
    try {
      const sessionToken = req.session.accessToken;
      const tokenExpires = req.session.tokenExpirationTimestamp;
      const noToken = !sessionToken || !tokenExpires;
      const currentTime = dayjs();
      const bufferTime = 1; // One minute buffer time

      // Check to see if we have a token or if the token is expired
      const needToken = noToken || dayjs(tokenExpires).subtract(bufferTime, 'm').isBefore(currentTime);

      // Update the token if needed
      if (needToken) {
        const tokenInfo = await this.getToken();
        req.session.accessToken = tokenInfo.accessToken;
        req.session.tokenExpirationTimestamp = tokenInfo.tokenExpirationTimestamp;
      }
    } catch (error) {
      if (error?.response?.data?.error && error.response.data.error === 'consent_required') {
        throw new Error(ResponseStatus.ConsentRequired);
      } else {
        throw error;
      }
    }
  };

  /**
   * Gets the account ID, account name, and base path of the user using the access token.
   */
  static getUserInfo = async req => {
    // Get API client
    const targetAccountId = process.env.TARGET_ACCOUNT_ID;
    const baseUriSuffix = '/restapi';

    // Get API client and set the base paths
    this.dsApi.setOAuthBasePath(this.oAuthBasePath);

    // Get user info using access token
    const userInfoResults = await this.dsApi.getUserInfo(req.session.accessToken);

    let accountInfo;
    if (targetAccountId) {
      // Find the matching account
      accountInfo = userInfoResults.accounts.find(account => account.accountId == targetAccountId);
    }

    if (!targetAccountId) {
      // Find the default account
      accountInfo = userInfoResults.accounts.find(account => account.isDefault === 'true');
    }

    if (!accountInfo) {
      throw new Error(`Target account ${targetAccountId} not found!`);
    }

    // Save user information in session.
    req.session.accountId = accountInfo.accountId;
    req.session.basePath = `${accountInfo.baseUri}${baseUriSuffix}`;
  };

  /**
   * First checks if there is already a valid access token, updates it if it's expired,
   * then gets some user info. If the user has never provided consent, then they are
   * redirected to a login screen.
   */
  static login = async (req, res, next) => {
    try {
      // As long as the user has attempted to login before, they have either successfully
      // logged in or was redirected to the consent URL and then redirected back to the
      // app. Only set the user to logged out if an unknown error occurred during the
      // login process.

      await this.checkToken(req);
      await this.getUserInfo(req);
      req.session.isLoggedIn = true;
      res.status(200).send('Successfully logged in.');
    } catch (error) {
      console.log(JSON.stringify(error.message));
      // User has not provided consent yet, send the redirect URL to user.
      if (error.message === ResponseStatus.ConsentRequired) {
        const urlScopes = this.scopes.concat(this.webformsScopes).join('+');
        const dsOauthServer = process.env.DS_OAUTH_SERVER;
        const dsJWTClientId = process.env.DS_JWT_CLIENT_ID;
        const redirectUri = process.env.REDIRECT_URI;

        const consentUrl =
          `${dsOauthServer}/oauth/auth?response_type=code&` +
          `scope=${urlScopes}&client_id=${dsJWTClientId}&` +
          `redirect_uri=${redirectUri}`;

        console.log(consentUrl);

        res.status(210).send(consentUrl);
      } else {
        req.session.isLoggedIn = false;
        next(error);
      }
    }
  };

  /**
   * Logs the user out by destroying the session.
   */
  static logout = (req, res) => {
    req.session = null;
    console.log('Successfully logged out!');
    res.status(200).send('Success: you have logged out');
  };

  /**
   * Return "true" if the user logged in, false otherwise.
   */
  static isLoggedIn = (req, res) => {
    let isLoggedIn;
    if (req.session.isLoggedIn === undefined) {
      isLoggedIn = false;
    } else {
      isLoggedIn = req.session.isLoggedIn;
    }

    res.status(200).send(isLoggedIn);
  };
}

module.exports = JwtController;
