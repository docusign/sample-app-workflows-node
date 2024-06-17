/**
 * @file
 * This file handles the JWT authentication with DocuSign.
 * JWT flow:
 * 1. Create consent URI and obtain user consent.
 * 2. Construct JWT using the Integration Key, User ID, scopes, RSA private key, lifetime variable.
 * 3. Send POST containing the JWT to DS_AUTH_SERVER to get access token.
 * 4. Using the access token, send a POST to get the user's base URI (account_id + base_uri).
 * 5. Now you can use the access token and base URI to make API calls.
 * When the access token expires, create a new JWT and request a new access token.
 */

const fs = require('fs'); // Used to parse RSA key
const path = require('path');
const axios = require('axios');
const docusign = require('docusign-esign');
const moment = require('moment'); // Used to set and determine a token's expiration date
const config = require('../config');
const { scopes } = require('../constants');
const createPrefixedLogger = require('../utils/logger');

const oAuth = docusign.ApiClient.OAuth;
const restApi = docusign.ApiClient.RestApi;

class JwtController {
  dsApi = new docusign.ApiClient();
  rsaKey = fs.readFileSync(path.join(path.resolve(), '..', 'private.key'));
  jwtLifeSec = 60 * 60 * 1; // requested lifetime for the JWT is 1 hour
  scopes = scopes;

  // For production environment, change "DEMO" to "PRODUCTION"
  basePath = restApi.BasePath.DEMO; // https://demo.docusign.net/restapi
  oAuthBasePath = oAuth.BasePath.DEMO; // account-d.docusign.com

  constructor() {
    this.logger = createPrefixedLogger(JwtController.name);
  }

  /**
   * First checks if there is already a valid access token, updates it if it's expired,
   * then gets some user info. If the user has never provided consent, then they are
   * redirected to a login screen.
   */
  async login(req, res, next) {
    // As long as the user has attempted to login before, they have either successfully
    // logged in or was redirected to the consent URL and then redirected back to the
    // app. Only set the user to logged out if an unknown error occurred during the
    // login process.
    const isTokenValid = this.checkToken(req);

    try {
      if (!isTokenValid) {
        await this.getAndSaveToken(req);
        await this.getAndSaveUserInfo(req);
      }

      res.json({ name: req.session.userName, email: req.session.userEmail });
    } catch (error) {
      this.logger.error(error);
      // User has not provided consent yet, send the redirect URL to user.
      if (error?.response?.data?.error && error.response.data.error === 'consent_required') {
        const urlScopes = this.scopes.join('+');

        const consentUrl =
          `${config.dsOauthServer}/oauth/auth?response_type=code&` +
          `scope=${urlScopes}&client_id=${config.clientId}&` +
          `redirect_uri=${config.redirectUri}`;

        this.logger.info(`ConsentUrl: ${consentUrl}`);
        res.status(210).send(consentUrl);
      } else {
        next(error);
      }
    }
  }

  /**
   * Logs the user out by destroying the session.
   */
  logout(req, res, next) {
    this.internalLogout(req, res, next);
    res.send();
  }

  /**
   * Return "true" if the user logged in, false otherwise.
   */
  isLoggedIn(req, res, next) {
    const isTokenValid = this.checkToken(req);

    if (!isTokenValid) {
      this.internalLogout(req, res, next);
      res.status(200).send(false);
      return;
    }

    res.status(200).send(true);
  }

  /**
   * Checks to see that the current access token is available and still valid.
   * Must be called before every Docusign API call.
   * @returns {boolean}
   */
  checkToken(req) {
    const accessToken = req?.session?.accessToken;
    const tokenExpires = req?.session?.tokenExpirationTimestamp;
    const noToken = !accessToken || !tokenExpires;
    const currentTime = moment();
    const bufferTime = 1; // One minute buffer time

    // Check to see if we have a token or if the token is expired
    const needToken = noToken || moment(tokenExpires).subtract(bufferTime, 'minutes').isBefore(currentTime);

    if (noToken) {
      this.logger.info('checkToken: Need a new token');
    }
    if (!needToken) {
      this.logger.info('checkToken: Using current token');
    }

    return !needToken;
  }

  /**
   * Creates a JWT token using the integration key, user ID, scopes and RSA key.
   * Then returns access token and expiration date.
   */
  async getAndSaveToken(req) {
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

    // Save token information in session.
    req.session.accessToken = results.body.access_token;
    req.session.tokenExpirationTimestamp = expiresAt.format();
    this.logger.info('getAndSaveToken: Saving new token');
  }

  /**
   * Gets the account ID, account name, and base path of the user using the access token.
   */
  async getAndSaveUserInfo(req) {
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
    req.session.accountName = accountInfo.accountName;
    req.session.basePath = `${accountInfo.baseUri}${baseUriSuffix}`;
    req.session.userName = response.data.name;
    req.session.userEmail = response.data.email;
  }

  internalLogout(req, res, next) {
    req.session.destroy(err => {
      if (err) return next(err);
    });
  }
}

module.exports = JwtController;
