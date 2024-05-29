require('dotenv').config({ path: `${process.env.PWD}/../.env` });

const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const chalk = require('chalk');
const errorText = require('./assets/errorText.json').api;
const AppError = require('./utils/appError');
const jwtRouter = require('./routes/jwtRouter');

const mode = process.env.NODE_ENV;
const port = process.env.BACKEND_PORT;

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
      secure: mode === 'development' ? false : true, // Set to false when testing on localhost, otherwise to "true"
      sameSite: 'lax',
    })
  );

// Routing
app.use('/api/auth', jwtRouter);

// Error handler
// app.use((err, req, res, next) => {
//   const statusCode = 500;

//   if (err instanceof AppError) {
//     // AppError will contain a specific status code and custom message
//     const statusCode = err.statusCode || 500;
//     const errorMessage = err.message;

//     res.status(statusCode).send({
//       title: errorText.docusignApiError,
//       description: `<b>Status code: ${statusCode}</b><br></br>${errorMessage}`,
//     });
//   } else if (err?.response?.body) {
//     // Docusign API specific error, extract error code and message
//     const errorBody = err?.response?.body;
//     const errorCode = errorBody && errorBody.errorCode;
//     const errorMessage = errorBody && errorBody.message;

//     res.status(statusCode).send({
//       title: errorText.docusignApiError,
//       description: `<b>Status code: ${statusCode}</b><br></br>${errorCode}: ${errorMessage}`,
//     });
//   } else {
//     console.log('Unknown error occurred.');
//     console.log(err);

//     res.status(500).send({
//       title: errorText.docusignApiError,
//       description: `<b>Status code: ${statusCode}</b><br></br>${errorText.unknownError}`,
//     });
//   }
// });

async function start() {
  try {
    app.listen(port, () => console.log(chalk.black.bgBlueBright(`Server started and listening on port ${port} ...`)));
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

start();
