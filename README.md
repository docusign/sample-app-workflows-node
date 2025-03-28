# Node.js and React: Workflows Sample App

## Introduction

Welcome to the Workflows Sample App! The app is written using Node.js and React. Docusign Maestro lets you easily build and deploy customized workflows that automate and accelerate your agreement processes without writing any code. Maestro connects all the tools and activities in your workflow so that agreement processes are more efficient, more uniform, and have better visibility.

With Docusign Maestro, you can combine Docusign features such as ID Verification, Web Forms, and eSignature with third-party extensions to automate your workflows from end to end.

## Configuring your integration

Before you can run this sample app on your local machine, you must first create a new integration key in your Docusign developer account.

### Create a new integration

1. If you don't already have one, create a [free developer account](https://www.docusign.com/developers/sandbox).
2. Log in to your developer account and navigate to [My Apps & Keys](https://admindemo.docusign.com/apps-and-keys).
3. Select **Add App and Integration Key**.
4. Create a new integration that is configured to use **JSON Web Token (JWT) Grant** and **Authorization Code Grant (ACG)**.
    You will need the **integration key** itself and its **RSA key pair**. To use this application, you must add your application’s **Redirect URI** to your integration key. See our video, [**Creating an Integration Key for JWT Authentication**](https://www.youtube.com/watch?v=GgDqa7-L0yo) for a demonstration of how to create an integration key (client ID) for a user application like this example.
      - Save the **integration key** and **private RSA key pair** somewhere safe as you will need these later.
5. Add redirect URIs for your app. There are several variables from the **.env** file that are used in the code and configured for redirect urls. Find variables below in the **.env** file and add the values of these variables in the Docusign account settings in the appropriate **Redirect URIs** section:
    - FRONTEND_DEV_HOST (http://localhost:3000)
    - JWT_REDIRECT_URI (https://developers.docusign.com/platform/auth/consent)

If you run this project in Docker using the **docker-compose.local.yml** file, the variable FRONTEND_DEV_HOST there changes to the value **http://localhost:80**. Keep in mind that in this case this value will also have to be added to the **Redirect URIs** section.

### Prerequisites

- A free Docusign developer account.
- Integration key and corresponding RSA key pair from the integration you created above.
- [Node.js](https://nodejs.org/) v20+
- [VS Code](https://code.visualstudio.com/)
- [Docker](https://docs.docker.com/get-docker/)

### Install dependencies locally

1. Download or clone this repository to your workstation in a new folder named **sample-app-workflows-node**.
2. Navigate to that folder: **`cd sample-app-workflows-node`**
3. Navigate to the **client** folder: **`cd client`**
4. Install dependencies using the [npm](https://www.npmjs.com/) package manager: **`npm install`**
5. Navigate to the **server** folder: **`cd ../server`**
6. Install dependencies: **`npm install`**
7. Rename the **.env.example** file in the root directory to **.env**, and update the file with the integration key and other settings.
  > **Note:** Protect your integration key and client secret. You should make sure that the **.env** file will not be stored in your source code repository.
8. Rename the **example_private.key** file to **private.key**, and paste your complete private RSA key into this file (including the header and footer of the key). This should be the private RSA you should have gotten when you created your Docusign account.

## Running the Workflows Sample App in development mode

1. Navigate to the application folder: **`cd sample-app-workflows-node`**
2. To start the server and client at the same time: **`npm run concurrently:dev`**
3. **Or,** to run the server and client separately:
    - In one terminal, run **`npm run client:dev`**
    - In a separate terminal, run **`npm run server:dev`**
4. Open a browser to **http://localhost:3000**

## Running the Workflows Sample App in Docker

You can run the application in Docker locally in production mode:

1. Navigate to the application folder: **`cd sample-app-workflows-node`**
2. Make sure that you configured **.env** file and saved your **private.key** in the root of the folder. Make sure that you have Docker installed.
3. Run **`docker-compose -f docker-compose.local.yaml up -d`**
4. To stop containers, run **`docker compose -f docker-compose.local.yaml down`**
5. Open a browser to **http://localhost:80**
