require('dotenv').config({ path: `${process.env.PWD}/../.env` });

const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const chalk = require('chalk');
const jwtRouter = require('./routes/jwtRouter');

const isDev = process.env.NODE_ENV === 'development';
const backendPort = process.env.BACKEND_PORT;
const frontendOrigins = process.env.FRONTEND_ORIGINS;
const frontendPort = process.env.FRONTEND_PORT;

const allowedOrigins = frontendOrigins.split(',').map(origin => `${origin}:${frontendPort}`);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

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
      secret: process.env.SESSION_SECRET,
      httpOnly: true,
      secure: isDev ? false : true, // Set to false when testing on localhost, otherwise to "true"
      sameSite: 'lax',
    })
  )
  .use(cors(corsOptions));

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
