require("dotenv").config({ path: `${process.env.PWD}/../.env` });

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const chalk = require("chalk");
const errorText = require("./assets/errorText.json").api;
const AppError = require("./utils/appError");

// Environment mode
const mode = process.env.NODE_ENV;

// Configure server
const app = express().use(helmet()).use(bodyParser.json()).use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server started");
  res.end();
});

// Error handler
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    // AppError will contain a specific status code and custom message
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message;

    res.status(statusCode).send({
      title: errorText.docusignApiError,
      description: `<b>Status code: ${statusCode}</b><br></br>${errorMessage}`,
    });
  } else if (err && err.response && err.response.body) {
    // Docusign API specific error, extract error code and message
    const statusCode = 500;
    const errorBody = err && err.response && err.response.body;
    const errorCode = errorBody && errorBody.errorCode;
    const errorMessage = errorBody && errorBody.message;

    res.status(statusCode).send({
      title: errorText.docusignApiError,
      description: `<b>Status code: ${statusCode}</b><br></br>${errorCode}: ${errorMessage}`,
    });
  } else {
    console.log("Unknown error occurred.");
    console.log(err);

    res.status(500).send({
      title: errorText.docusignApiError,
      description: `<b>Status code: ${statusCode}</b><br></br>${errorText.unknownError}`,
    });
  }
});

// Serve static assets if in production
if (mode === "production") {
  console.log("In production");
  app.use("/assets", express.static(path.join(__dirname, "assets", "public")));
}

const port = process.env.BACKEND_PORT;

async function start() {
  try {
    app.listen(port, () => console.log(chalk.black.bgBlueBright(`Server started and listening on port ${port} ...`)));
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

start();
