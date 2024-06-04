require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const chalk = require('chalk');
const jwtRouter = require('./routes/jwtRouter');
const config = require('./config');

const isDev = config.nodeEnv === 'development';
const backendPort = config.backendPort;

// Max session age
const maxSessionAge = 1000 * 60 * 60 * 24 * 1; // One day

// Configure server
const app = express()
  .use(helmet())
  .use(bodyParser.json())
  .use(cookieParser())
  .use(
    cookieSession({
      name: 'MyMaestroApp',
      maxAge: maxSessionAge,
      secret: config.sessionSecret,
      httpOnly: true,
      secure: isDev ? false : true, // Set to false when testing on localhost, otherwise to "true"
      sameSite: 'lax',
    })
  )
  .use(cors({ credentials: true, origin: true }));

// Routing
app.use('/api/auth', jwtRouter);

async function start() {
  try {
    app.listen(backendPort, () =>
      console.log(chalk.black.bgBlueBright(`Server started and listening on port ${backendPort} ...`))
    );
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

start();
