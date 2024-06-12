const fs = require('fs'); // Used to parse RSA key
const path = require('path');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const docusign = require('docusign-esign');
const moment = require('moment'); // Used to set and determine a token's expiration date
const config = require('../config');
const { scopes, METHOD } = require('../constants');

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
  static rsaKey = fs.readFileSync(path.join(path.resolve(), '..', 'private.key'));
  static jwtLifeSec = 60 * 60; // requested lifetime for the JWT is 60 min
  static scopes = scopes;
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
      config.clientId,
      config.userId,
      this.scopes,
      this.rsaKey,
      this.jwtLifeSec
    );

    const expiresAt = moment().add(results.body.expires_in, 'seconds');

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
      const currentTime = moment();
      const bufferTime = 1; // One minute buffer time

      // Check to see if we have a token or if the token is expired
      const needToken = noToken || moment(tokenExpires).subtract(bufferTime, 'minutes').isBefore(currentTime);

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
    const targetAccountId = config.targetAccountId;
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

    const response = await axios.get(`${config.dsOauthServer}/oauth/userinfo`, {
      headers: {
        Authorization: `Bearer ${req.session.accessToken}`,
      },
    });

    // Save user information in session.
    req.session.accountId = accountInfo.accountId;
    req.session.basePath = `${accountInfo.baseUri}${baseUriSuffix}`;
    req.session.userName = response.data.name;
    req.session.userEmail = response.data.email;
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
      req.session.authMethod = METHOD.JWT;

      await this.checkToken(req);
      await this.getUserInfo(req);
      req.session.isLoggedIn = true;
      res.json({ name: req.session.userName, email: req.session.userEmail });
    } catch (error) {
      console.log(error);
      // User has not provided consent yet, send the redirect URL to user.
      if (error.message === ResponseStatus.ConsentRequired) {
        const urlScopes = this.scopes.join('+');

        const consentUrl =
          `${config.dsOauthServer}/oauth/auth?response_type=code&` +
          `scope=${urlScopes}&client_id=${config.clientId}&` +
          `redirect_uri=${config.redirectUri}`;

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
  static logout = (req, res, next) => {
    req.session.destroy(err => {
      if (err) return next(err);
    });

    res.send();
  };

  /**
   * Return "true" if the user logged in, false otherwise.
   */
  static isLoggedIn = (req, res) => {
    if (req.session.isLoggedIn === undefined) {
      req.session.isLoggedIn = false;
    }
    let isLoggedIn = req.session.isLoggedIn;

    try {
      const decoded = jwt.decode(req.session.accessToken);
      if (!decoded) {
        isLoggedIn = false;
        return res.status(200).send(isLoggedIn);
      }

      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        isLoggedIn = false;
        return res.status(200).send(isLoggedIn);
      }

      return res.status(200).send(isLoggedIn);
    } catch (error) {
      isLoggedIn = false;
      return res.status(200).send(isLoggedIn);
    }
  };
}

module.exports = JwtController;
