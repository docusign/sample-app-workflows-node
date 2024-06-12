// dsJwtAuth.js
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const docusign = require('docusign-esign');
const config = require('../config');
const { scopes, METHOD } = require('../constants');

const tokenReplaceMinGet = 30;

/**
 * @file
 * This file handles the JWT authentication with DocuSign.
 * It also looks up the user's account and base_url
 * via the OAuth::userInfo method.
 * See https://developers.docusign.com/esign-rest-api/guides/authentication/user-info-endpoints userInfo method.
 * @author DocuSign
 */

('use strict');
const DsJwtAuth = function _DsJwtAuth(req) {
  // private globals
  this._debug_prefix = 'DsJwtAuth';
  this.accessToken = req.user && req.user.accessToken;
  this.accountId = req.user && req.user.accountId;
  this.accountName = req.user && req.user.accountName;
  this.basePath = req.user && req.user.basePath;
  this._tokenExpiration = req.user && req.user.tokenExpirationTimestamp;
  this.eg = req.session.eg;

  this.scopes = scopes;
  this.jwtLifeSec = 60 * 60; // requested lifetime for the JWT is 60 min
  this.dsApi = new docusign.ApiClient();
  this.rsaKey = fs.readFileSync(path.join(path.resolve(), '..', 'private.key'));
  this.oAuthBasePath = config.dsOauthServer.replace('https://', ''); // account-d.docusign.com

  // For production use, you'd want to store the refresh token in non-volatile storage since it is
  // good for 30 days. You'd probably want to encrypt it too.
  this._debug = true; // ### DEBUG ### setting
};
module.exports = DsJwtAuth; // SET EXPORTS for the module.

/**
 * This is the key method for the object.
 * It should be called before any API call to DocuSign.
 * It checks that the existing access accessToken can be used.
 * If the existing accessToken is expired or doesn't exist, then
 * a new accessToken will be obtained from DocuSign by using
 * the JWT flow.
 *
 * This is an async function so call it with await.
 *
 * SIDE EFFECT: Sets the access accessToken that the SDK will use.
 * SIDE EFFECT: If the accountId et al is not set, then this method will
 *              also get the user's information
 * @function
 */
DsJwtAuth.prototype.checkToken = function _checkToken(bufferMin = tokenReplaceMinGet) {
  let noToken = !this.accessToken || !this._tokenExpiration;
  let now = moment();
  let needToken = noToken || moment(this._tokenExpiration).subtract(bufferMin, 'm').isBefore(now);
  if (this._debug) {
    if (noToken) {
      this._debug_log('checkToken: Starting up--need a token');
    }
    if (needToken && !noToken) {
      this._debug_log('checkToken: Replacing old token');
    }
    if (!needToken) {
      this._debug_log('checkToken: Using current token');
    }
  }

  return !needToken;
};

/**
 * Async function to obtain a accessToken via JWT grant
 *
 * RETURNS {accessToken, tokenExpirationTimestamp}
 *
 * We need a new accessToken. We will use the DocuSign SDK's function.
 */
DsJwtAuth.prototype.getToken = async function _getToken() {
  // Data used
  // dsConfig.dsJWTClientId
  // dsConfig.impersonatedUserGuid
  // dsConfig.privateKey
  // dsConfig.dsOauthServer
  this.dsApi.setOAuthBasePath(this.oAuthBasePath); // it should be domain only.
  const results = await this.dsApi.requestJWTUserToken(
    config.clientId,
    config.userId,
    this.scopes,
    this.rsaKey,
    this.jwtLifeSec
  );

  const bufferTime = 1; // One minute buffer time

  const expiresAt = moment().add(results.body.expires_in, 'seconds').subtract(bufferTime, 'minutes');

  this.accessToken = results.body.access_token;
  this._tokenExpiration = expiresAt.format();

  return {
    accessToken: results.body.access_token,
    tokenExpirationTimestamp: expiresAt.format(),
  };
};

/**
 * Sets the following variables:
 * DsJwtAuth.accountId
 * DsJwtAuth.accountName
 * DsJwtAuth.basePath
 * DsJwtAuth.userName
 * DsJwtAuth.userEmail
 * @function _getAccount
 * @returns {promise}
 * @promise
 */
DsJwtAuth.prototype.getUserInfo = async function _getUserInfo() {
  // Data used:
  // dsConfig.targetAccountId
  // dsConfig.dsOauthServer
  // DsJwtAuth.accessToken

  const dsApi = new docusign.ApiClient();
  const targetAccountId = config.targetAccountId;
  const baseUriSuffix = '/restapi';

  dsApi.setOAuthBasePath(this.oAuthBasePath); // it have to be domain name
  const results = await dsApi.getUserInfo(this.accessToken);

  let accountInfo;
  if (!targetAccountId) {
    // Find the default account
    accountInfo = results.accounts.find(account => account.isDefault === 'true');
  }
  if (targetAccountId) {
    // Find the matching account
    accountInfo = results.accounts.find(account => account.accountId == targetAccountId);
  }

  if (!accountInfo) {
    throw new Error(`Target account ${targetAccountId} not found!`);
  }

  this.accountId = accountInfo.accountId;
  this.accountName = accountInfo.accountName;
  this.basePath = accountInfo.baseUri + baseUriSuffix;
  return {
    accountId: this.accountId,
    basePath: this.basePath,
    accountName: this.accountName,
  };
};

/**
 * Clears the accessToken. Same as logging out
 * @function
 */
DsJwtAuth.prototype.clearToken = function () {
  // "logout" function
  this._tokenExpiration = false;
  this.accessToken = false;
};

DsJwtAuth.prototype.login = async function (req, res, next) {
  this.internalLogout(req, res);
  req.session.authMethod = METHOD.JWT;

  try {
    const auth = await this.getToken();
    const user = await this.getUserInfo();

    const userData = {
      ...auth,
      ...user,
    };

    req.login(userData, err => {
      if (err) {
        return next(err);
      }

      req.session.authMethod = METHOD.JWT;
      req.session.accountId = userData.accountId;
      req.session.accountName = userData.accountName;
      req.session.basePath = userData.basePath;
    });
  } catch (e) {
    const body = e?.response?.body || e?.response?.data;

    if (body) {
      if (body?.error === 'consent_required') {
        const consentScopes = this.scopes;
        const consentUrl =
          `${config.dsOauthServer}/oauth/auth?response_type=code&` +
          `scope=${consentScopes}&client_id=${config.clientId}&` +
          `redirect_uri=${config.reactBackendApi}/api/callback`;
        res.redirect(consentUrl);
      } else {
        this._debug_log(
          `\nAPI problem: Status code ${e.response.status}, message body: ${JSON.stringify(body, null, 4)}\n\n`
        );
      }
    } else {
      // Not an API problem
      return next(e);
    }
  }
};

/**
 * Clears the object's and session's user information including the tokens.
 * @function
 */
DsJwtAuth.prototype.internalLogout = function _internalLogout(req, res) {
  this._tokenExpiration = null;
  req.session.accountId = null;
  req.session.accountName = null;
  req.session.basePath = null;
};

/**
 * Clears the user information including the tokens.
 * @function
 */
DsJwtAuth.prototype.logoutCallback = function _logoutCallback(req, res) {
  req.logout(function (err) {
    if (err) {
      throw err;
    }
  }); // see http://www.passportjs.org/docs/logout/
  this.internalLogout(req, res);
  res.redirect('/');
};

/**
 * Clears the DocuSign authentication session token
 * https://account-d.docusign.com/oauth/logout
 * @function
 */
DsJwtAuth.prototype.logout = function _logout(req, res) {
  this.logoutCallback(req, res);
};

/**
 * If in debug mode, prints message to the console
 * @function
 * @param {string} m The message to be printed
 * @private
 */
DsJwtAuth.prototype._debug_log = function (m) {
  if (!this._debug) {
    return;
  }
  console.log(this._debug_prefix + ': ' + m);
};
