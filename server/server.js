require('dotenv').config();

const express = require('express');
const helmet = require('helmet'); // https://expressjs.com/en/advanced/best-practice-security.html
const bodyParser = require('body-parser');
const session = require('express-session'); // https://github.com/expressjs/session
const MemoryStore = require('memorystore')(session); // https://github.com/roccomuso/memorystore
const passport = require('passport');
const DSAuthCodeGrant = require('./lib/DSAuthCodeGrant');
const DsJwtAuth = require('./lib/DSJwtAuth');
const cors = require('cors');
const chalk = require('chalk');
const DocusignStrategy = require('passport-docusign');
const moment = require('moment');
const config = require('./config');
const { scopes, BACKEND_ROUTE, METHOD } = require('./constants');
const authRouter = require('./routes/authRouter');
const workflowsRouter = require('./routes/workflowsRouter');

const maxSessionAge = 1000 * 60 * 60 * 24 * 1; // One day

const app = express()
  .use(helmet())
  .use(bodyParser.json())
  .use(
    session({
      secret: config.sessionSecret,
      name: 'my-maestro-session',
      cookie: { maxAge: maxSessionAge },
      saveUninitialized: true,
      resave: true,
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  // Add an instance of DSAuthCodeGrant to req
  .use((req, res, next) => {
    req.dsAuthCodeGrant = new DSAuthCodeGrant(req);
    req.dsAuthJwt = new DsJwtAuth(req);

    switch (true) {
      case req.session.authMethod === METHOD.JWT || req.url.startsWith(`${BACKEND_ROUTE.AUTH}/jwt`):
        req.dsAuth = req.dsAuthJwt;
        break;
      case req.session.authMethod === METHOD.ACG || req.url.startsWith(`${BACKEND_ROUTE.AUTH}/passport`):
        req.dsAuth = req.dsAuthCodeGrant;
        break;
      default:
        req.dsAuth = req.dsAuthCodeGrant;
    }

    next();
  })
  .use(cors({ credentials: true, origin: true }));

// Routing
app.use(BACKEND_ROUTE.AUTH, authRouter);
app.use(BACKEND_ROUTE.WORKFLOWS, workflowsRouter);

async function start() {
  try {
    app.listen(config.backendPort, () =>
      console.log(chalk.black.bgBlueBright(`Server started and listening on port ${config.backendPort} ...`))
    );
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

start();

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete DocuSign profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Configure passport for DocusignStrategy
const docusignStrategy = new DocusignStrategy(
  {
    production: false,
    clientID: config.clientId,
    scope: scopes.join(' '),
    clientSecret: config.clientSecret,
    callbackURL: config.frontendHost,
    state: false, // automatic CSRF protection.
    // See https://github.com/jaredhanson/passport-oauth2/blob/master/lib/state/session.js
  },
  function _processDsResult(accessToken, refreshToken, params, profile, done) {
    // The params arg will be passed additional parameters of the grant.
    // See https://github.com/jaredhanson/passport-oauth2/pull/84
    //
    // Here we're just assigning the tokens to the account object
    // We store the data in DSAuthCodeGrant.getDefaultAccountInfo
    const user = profile;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.expiresIn = params.expires_in;
    user.tokenExpirationTimestamp = moment().add(user.expiresIn, 's'); // The dateTime when the access token will expire
    return done(null, user);
  }
);

/**
 * The DocuSign OAuth default is to allow silent authentication.
 * An additional OAuth query parameter is used to not allow silent authentication
 */
const allowSilentAuthentication = true;
if (allowSilentAuthentication) {
  // See https://stackoverflow.com/a/32877712/64904
  docusignStrategy.authorizationParams = function (options) {
    return { prompt: 'login' };
  };
}
passport.use(docusignStrategy);
