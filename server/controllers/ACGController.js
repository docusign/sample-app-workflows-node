/**
 * @file
 * This file implements the DSAuthCodeGrant class.
 * It handles the OAuth Authorization Code Grant flow.
 * It also looks up the user's default account and baseUrl
 *
 * For the purposes of this example, it ignores the refresh
 * token that is returned from DocuSign. In production,
 * depending on your use case, you can store and then use the
 * refresh token instead of requiring the user to re-authenticate.
 */

const moment = require('moment');
const passport = require('passport');
const config = require('../config');
const createPrefixedLogger = require('../utils/logger');

class ACGController {
  constructor() {
    this.logger = createPrefixedLogger(ACGController.name);
  }

  login(req, res, next) {
    this.internalLogout(req);
    passport.authenticate('docusign')(req, res, next);
  }

  oauthCallback1(req, res, next) {
    // This callback URL is used for the login flow
    passport.authenticate('docusign', { failureRedirect: '/' })(req, res, next);
  }

  oauthCallback2(req, res, next) {
    const { accessToken, tokenExpirationTimestamp, name, email } = req.user;
    this.logger.info(`Received accessToken: |${accessToken}|`);
    this.logger.info(`Expires at ${tokenExpirationTimestamp.format('dddd, MMMM Do YYYY, h:mm:ss a')}`);

    // The DocuSign Passport strategy looks up the user's account information via OAuth::userInfo.
    // See https://developers.docusign.com/esign-rest-api/guides/authentication/user-info-endpoints
    // The data includes the user's information and information on the accounts the user has access too.
    //
    // To make an API or SDK call, the accountId and baseUri are needed.
    //
    // A user can (and often) belongs to multiple accounts.
    // You can search for a specific account the user has, or
    // give the user the choice of account to use, or use
    // the user's default account. This example looks for a specific account or the default account.
    //
    // The baseUri changes rarely so it can (and should) be cached.
    //
    // req.user holds the result of the DocuSign OAuth call and the OAuth::userInfo method,
    // except for the expires element.
    // req.user.accessToken: "eyJ0Xbz....vXXFw7IlVwfDRA"
    // req.user.accounts:  An array of accounts that the user has access to
    //   An example account: {
    //     account_id: "8118f2...8a",
    //     is_default: false,
    //     account_name: "Xylophone World",
    //     base_uri: "https://demo.docusign.net" (Note: does not include '/restapi/v2')
    //   }
    // created: "2015-05-20T11:48:23.363"  // when was the user's record created
    // email: "name@example.com" // the user's email
    // The expires element is added in function _processDsResult in file server.js.
    // It is the datetime when the token will expire:
    // expires: Moment {_isAMomentObject: true, _isUTC: false, _pf: {…}, _locale: Locale, _d: Tue Jun 26 2018 04:05:37 GMT+0300 (IDT), …}
    // expiresIn: 28800  // when the token will expire, in seconds, from when the OAuth response is sent by DocuSign
    // family_name: "LastName" // the user's last name
    // given_name: "Larry" // the user's first name
    // name: "Larry LastName"
    // provider: "docusign"
    // refreshToken: "eyJ0eXAiOiJ...HB4Q" // Can be used to obtain a new set of access and response tokens.
    // The lifetime for the refreshToken is typically 30 days
    // sub: "...5fed18870" // the user's id in guid format

    this.getAndSaveDefaultAccountInfo(req);
    res.json({ name, email });
  }

  /**
   * Clears the DocuSign authentication session
   * https://account-d.docusign.com/oauth/logout
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

  checkToken(req) {
    const accessToken = req?.user?.accessToken;
    const tokenExpires = req?.user?.tokenExpirationTimestamp;
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
   * Clears the object's and session's user information including the tokens.
   */
  internalLogout(req, res, next) {
    req.session.accountId = null;
    req.session.accountName = null;
    req.session.basePath = null;

    req.logout(err => {
      if (err) return next(err);

      req.session.destroy(err => {
        if (err) return next(err);
      });
    }); // see http://www.passportjs.org/docs/logout/
  }

  /**
   * Find the accountId, accountName, and baseUri that will be used.
   * The config.targetAccountId may be used to find a specific account (if the user has access to it).
   * Side effect: store in the session
   */
  getAndSaveDefaultAccountInfo(req) {
    const targetAccountId = config.targetAccountId;
    const baseUriSuffix = '/restapi';

    const accounts = req.user.accounts;
    let account;

    if (targetAccountId) {
      // Find the matching account
      account = accounts.find(account => account.account_id === targetAccountId);
    }

    if (!targetAccountId) {
      // Find the default account
      account = accounts.find(account => account.is_default);
    }

    if (!account) {
      throw new Error('Could not find account information for the user');
    }

    // Save the account information to the session
    req.session.accountId = account.account_id;
    req.session.accountName = account.account_name;
    req.session.basePath = `${account.base_uri}${baseUriSuffix}`;
    this.logger.info(`Using account ${account.account_id}: ${account.account_name}`);
  }
}

module.exports = ACGController;
