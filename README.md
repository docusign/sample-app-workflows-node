# Node.js and React: MyMaestro Sample Application

## Introduction

Welcome to the MyMaestro sample app! MyMaestro is written using Node.js (server) and React (client), and showcase the new Maestro API and how developers can use the API to create solutions for HR use cases, specifically use cases related to hiring

## Configuring your integration

Before you can run this sample app on your local machine, you must first create a new integration with a Docusign developer account.

### Create a new integration

1. If you don't already have one, create a [free developer account](https://go.docusign.com/sandbox/productshot/?elqCampaignId=16535).
2. Log into your developer account, and navigate to [My Apps & Keys](https://admindemo.docusign.com/authenticate?goTo=apiIntegratorKey).
3. Select **Add App and Integration Key**.
4. Create a new integration that is configured to use **JSON Web Token (JWT) Grant**.
   You will need the **integration key** itself and its **RSA key pair**. To use this application, you must add your application's **Redirect URI** to your integration key. See our video, [**Creating an Integration Key for JWT Authentication**](https://www.youtube.com/watch?v=GgDqa7-L0yo) for a demonstration of how to create an integration key (client ID) for a user application like this example.
   - Save the **integration key** and **private RSA key pair** somewhere safe as you will need these later.
5. Add the following as redirect URIs for your app:
   - http://localhost:3000
   - http://localhost:3000/index

## Installation guide

### Prerequisites

- A free Docusign developer account.
- Integration key and corresponding RSA key pair from the integration you created above.
- [Node.js](https://nodejs.org/) v18+
- [VS Code](https://code.visualstudio.com/)
- [Docker](https://docs.docker.com/get-docker/)

### Docusign account settings

The following must be enabled on your developer account in order to run all of the examples:

- **Payment**: You must have a Payment gateway set up, see the [Payments](#configure-a-payment-gateway) section below for further instructions.
- **SMS delivery**: Follow the instructions in the [Docusign eSignature Admin Guide](https://support.docusign.com/guides/ndse-admin-guide-sending-settings) under the **Fields and Properties** section. Make sure "Allow SMS delivery to recipients" is checked.
- **Conditional routing**: Follow the instructions in the [Introduction to Conditional Routing](https://support.docusign.com/en/guides/ndse-user-guide-intro-to-conditional-routing) under the **Getting started with conditional routing** section. Make sure "Enable conditional routing" is checked.
- **CertifiedDelivery recipients**: Follow the instructions on this [Docusign eSignature Admin Guide](https://support.docusign.com/guides/ndse-admin-guide-sending-settings) under the **Recipient Roles** section. Make sure "Enable needs to view role" is checked.
- **Document visibility**: Follow the instructions on this [Docusign eSignature Admin Guide](https://support.docusign.com/guides/ndse-admin-guide-sending-settings) under the **Fields and Properties** section. Set your settings to "Must sign to view, unless sender," and make sure "Allow sender to specify document visibility" is checked.
- **IDV**: Follow the instructions in the [Docusign Identify - ID Verification Q&A](https://support.docusign.com/en/articles/Tech-Readiness-DocuSign-Identify-ID-Verification#How_to_add_ID_Verification_on_an_account) to enable IDV on your account.

### Install dependencies locally

1. Download or clone this repository to your workstation in a new folder named **sample-app-mymaestro-node**.
2. Navigate to that folder: **`cd sample-app-mymaestro-node`**
3. Navigate to the **client** folder: **`cd client`**
4. Install dependencies using the [npm](https://www.npmjs.com/) package manager: **`npm install`**
5. Navigate to the **server** folder: **`cd ../server`**
6. Install dependencies: **`npm install`**
7. Rename the **.env.example** file in the root directory to **.env**, and update the file with the integration key and other settings.
   > **Note:** Protect your integration key and client secret. You should make sure that the **.env** file will not be stored in your source code repository.
8. Rename the **example_private.key** file to **private.key**, and paste your complete private RSA key into this file (including the header and footer of the key).

## Running MyGovernment

1. Navigate to the application folder: **`cd sample-app-mymaestro-node`**
2. Navigate to the server folder: **`cd server`**
3. To start the server and client at the same time: **`npm run dev`**
4. **Or,** to run the server and client separately:
   - In one terminal, navigate to the server folder (**`cd server`**) and run **`npm run server`**
   - In a separate terminal, navigate to the client folder (**`cd client`**) and run **`npm start`**
5. Open a browser to **http://localhost:3000**

## License information

This repository uses the MIT License. See the [LICENSE](./LICENSE) file for more information.
