const fs = require('fs');
const docusign = require('docusign-esign');
const validator = require('validator');
const config = require('../config');
const { createWorkflow, publishWorkflow } = require('../utils/workflowUtils.js');
const path = require('path');
const { METHOD, TEMPLATE_TYPE, scopes } = require('../constants');

const oAuth = docusign.ApiClient.OAuth;
const restApi = docusign.ApiClient.RestApi;

// JWT flow:
// 1. Create consent URI and obtain user consent.
// 2. Construct JWT using the IK and User ID, scope, RSA public and private key.
// 3. Send POST containing the JWT to DS_AUTH_SERVER to get access token.
// 4. Using the access token, send a POST to get the user's base URI (account_id + base_uri).
// 5. Now you can use the access token and base URI to make API calls.
// When the access token expires, create a new JWT and request a new access token.

class WorkflowsController {
  // Constants
  static minimumBufferMin = 3;
  static exampleNumber = 1;
  static eg = `mseg00${this.exampleNumber}`; // This example reference.
  static mustAuthenticate = '/ds/mustAuthenticate';
  static dsApi = new docusign.ApiClient();
  static scopes = scopes;
  static templatesPath = path.resolve(__dirname, '../assets/templates');
  // static i9Template = 'I9Template.json';
  // static offerLetterTemplate = 'OfferLetterTemplate.json';
  static i9Template = 'I9Template.json';
  static offerLetterTemplate = 'ExampleTemplate.json';

  // For production environment, change "DEMO" to "PRODUCTION"
  static basePath = restApi.BasePath.DEMO; // https://demo.docusign.net/restapi
  static oAuthBasePath = oAuth.BasePath.DEMO; // account-d.docusign.com

  /**
   * Cancels workflow instance and returns a response.
   */
  static cancelWorkflowInstance = async args => {
    //ds-snippet-start:Maestro2Step2
    this.dsApi.setBasePath(args.basePath);
    this.dsApi.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);
    //ds-snippet-end:Maestro2Step2

    //ds-snippet-start:Maestro2Step3
    const workflowInstanceManagementApi = new docusign.WorkflowInstanceManagementApi(this.dsApi);
    //ds-snippet-end:Maestro2Step3

    return await workflowInstanceManagementApi.cancelWorkflowInstance(args.accountId, args.instanceId);
  };

  /**
   * Cancels workflow instance and sends a response.
   */
  static cancelWorkflow = async (req, res) => {
    // Step 1. Check the token
    // At this point we should have a good token. But we
    // double-check here to enable a better UX to the user.
    const isTokenOK = req.dsAuth.checkToken(this.minimumBufferMin);
    if (!isTokenOK) {
      req.flash('info', 'Sorry, you need to re-authenticate.');
      // Save the current operation, so it will be resumed after authentication
      req.dsAuth.setEg(req, this.eg);
      return res.redirect(this.mustAuthenticate);
    }

    // Step 2. Call the worker method
    const args = {
      instanceId: req.session.instanceId,
      accessToken: req.user.accessToken,
      basePath: config.maestroApiUrl,
      accountId: req.session.accountId,
    };
    let results = null;

    try {
      results = await this.cancelWorkflowInstance(args);
    } catch (error) {
      const errorCode = error?.response?.statusCode;
      const errorMessage = error?.response?.body?.message;
      let errorInfo;

      // use custom error message if Maestro is not enabled for the account
      if (errorCode === 403) {
        errorInfo = 'Contact Support to enable this Feature';
      }

      res.status(403).send({ err: error, errorCode, errorMessage, errorInfo });
    }
    if (results) {
      res.status(200).send(results);
    }
  };

  /**
   * Creates workflow template.
   */
  static createTemplate = async req => {
    let templateFile = null;

    switch (req.body.templateType) {
      case TEMPLATE_TYPE.I9:
        templateFile = this.i9Template;
        break;
      // TODO: Add NDA Template File
      case TEMPLATE_TYPE.NDA:
        break;
      // TODO: Add OfferLetter Template File
      case TEMPLATE_TYPE.OFFER:
        templateFile = this.offerLetterTemplate;
        break;
    }

    const args = {
      basePath: 'https://demo.docusign.net/restapi',
      accessToken: req.user.accessToken,
      accountId: req.session.accountId,
      templateType: req.body.templateType,
      docFile: path.resolve(this.templatesPath, templateFile),
      templateName: 'Example Template',
    };

    this.dsApi.setBasePath(args.basePath);
    this.dsApi.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);
    let templatesApi = new docusign.TemplatesApi(this.dsApi);
    let results = null;
    let templateId = null; // the template that exists or will be created.
    let resultsTemplateName = null;
    let createdNewTemplate = null;
    // Step 1. See if the template already exists
    // Exceptions will be caught by the calling function

    // results = await templatesApi.listTemplates(args.accountId, function (error, templateList, response) {
    //   console.log('first');
    // });
    results = await templatesApi.listTemplates(args.accountId, {
      searchText: args.templateName,
    });

    if (results.resultSetSize && Number(results.resultSetSize) > 0) {
      templateId = results.envelopeTemplates[0].templateId;
      resultsTemplateName = results.envelopeTemplates[0].name;
      createdNewTemplate = false;
    } else {
      return {
        errorMessage: 'Template for this workflow is missing, make sure that you uploaded it on your account',
      };
    }

    return {
      templateId: templateId,
      templateName: resultsTemplateName,
      createdNewTemplate: createdNewTemplate,
    };
  };

  /**
   * Cancels workflow instance and sends a response.
   */
  static createWorkflow = async (req, res) => {
    let templateId;
    if (!req.session.templateId) {
      const templateResponse = await this.createTemplate(req);
      if (templateResponse.templateId) {
        templateId = templateResponse.templateId;
      } else {
        res.status(200).send({ err: templateResponse.errorMessage });
      }
    } else {
      templateId = req.session.templateId;
    }

    if (templateId) {
      // Step 2. Call the worker method
      const args = {
        templateId: templateId,
        accessToken: req.user.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req.session.accountId,
      };
      let results = null;

      try {
        const workflow = await createWorkflow(args);
        // const consentUrl = await publishWorkflow(args, req.session.workflowId);
        const workflowResponse = {
          ...workflow.workflowDefinition,
          workflowDefinitionId: workflow.workflowDefinitionId,
        };
        res.json(workflowResponse);
      } catch (error) {
        const errorCode = error?.response?.statusCode;
        const errorMessage = error?.response?.body?.message;
        let errorInfo;

        // use custom error message if Maestro is not enabled for the account
        if (errorCode === 403) {
          errorInfo = 'Contact Support to enable this Feature';
        }

        res.status(403).send({ err: error, errorCode, errorMessage, errorInfo });
        return;
      }

      if (results) {
        res.status(200).send(results);
      }
    }
  };

  /**
   * Gets workflow definition.
   */
  static getWorkflowDefinition = async args => {
    //ds-snippet-start:Maestro1Step2
    this.dsApi.setBasePath(args.basePath);
    this.dsApi.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);
    //ds-snippet-end:Maestro1Step2

    //ds-snippet-start:Maestro1Step3
    const workflowManagementApi = new docusign.WorkflowManagementApi(this.dsApi);
    return await workflowManagementApi.getWorkflowDefinition(args.accountId, args.workflowId);
  };

  /**
   * Gets workflow definitions.
   */
  static getWorkflowDefinitions = async args => {
    this.dsApi.setBasePath(args.basePath);
    this.dsApi.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);

    const workflowManagementApi = new docusign.WorkflowManagementApi(this.dsApi);
    return await workflowManagementApi.getWorkflowDefinitions(args.accountId, {
      status: 'active',
    });
  };

  /**
   * Triggers a workflow instance and returns a response.
   */
  static triggerWorkflowInstance = async (workflow, args) => {
    this.dsApi.setBasePath(args.basePath);
    this.dsApi.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);

    const workflowTriggerApi = new docusign.WorkflowTriggerApi(this.dsApi);

    const mtid = args.mtid;
    const mtsec = args.mtsec;
    //ds-snippet-end:Maestro1Step3

    //ds-snippet-start:Maestro1Step4
    const triggerPayload = docusign.TriggerPayload.constructFromObject({
      instanceName: args.instanceName,
      participant: {},
      payload: {
        signerEmail: args.signerEmail,
        signerName: args.signerName,
        ccEmail: args.ccEmail,
        ccName: args.ccName,
      },
      metadata: {},
    });
    //ds-snippet-end:Maestro1Step4

    //ds-snippet-start:Maestro1Step5
    return await workflowTriggerApi.triggerWorkflow(triggerPayload, args.accountId, { mtid, mtsec });
  };

  /**
   * Triggers a workflow instance and sends a response.
   */
  static triggerWorkflow = async (req, res) => {
    // Step 1. Check the token
    // At this point we should have a good token. But we
    // double-check here to enable a better UX to the user.
    const isTokenOK = req.dsAuth.checkToken(this.minimumBufferMin);
    if (!isTokenOK) {
      req.flash('info', 'Sorry, you need to re-authenticate.');
      // Save the current operation, so it will be resumed after authentication
      req.dsAuth.setEg(req, this.eg);
      return res.redirect(this.mustAuthenticate);
    }

    // Step 2. Call the worker method
    const { body } = req;
    const args = {
      instanceName: validator.escape(body.instanceName),
      signerEmail: validator.escape(body.signerEmail),
      signerName: validator.escape(body.signerName),
      ccEmail: validator.escape(body.ccEmail),
      ccName: validator.escape(body.ccName),
      workflowId: req.session.workflowId,
      accessToken: req.user.accessToken,
      basePath: config.maestroApiURL,
      accountId: req.session.accountId,
    };
    let results = null;

    try {
      const workflow = await this.getWorkflowDefinition(args);
      results = await this.triggerWorkflow(workflow, args);
    } catch (error) {
      const errorCode = error?.response?.statusCode;
      const errorMessage = error?.response?.body?.message;
      let errorInfo;

      // use custom error message if Maestro is not enabled for the account
      if (errorCode === 403) {
        errorInfo = 'Contact Support to enable this Feature';
      }

      res.status(403).send({ err: error, errorCode, errorMessage, errorInfo });
    }

    if (results) {
      res.status(200).send(results);
    }
  };

  static makeTemplate = args => {
    const docPdfBytes = fs.readFileSync(args.docFile);
    const docB64 = Buffer.from(docPdfBytes).toString('base64');

    // add the documents
    const doc = new docusign.Document.constructFromObject({
      documentBase64: docB64,
      name: 'Lorem Ipsum',
      fileExtension: 'pdf',
      documentId: '1',
    });

    // Create fields
    const signHere = docusign.SignHere.constructFromObject({
      documentId: '1',
      tabLabel: 'Signature',
      anchorString: '/SignHere/',
      anchorUnits: 'pixels',
      anchorXOffset: '20',
      anchorYOffset: '10',
    });
    const check = docusign.Checkbox.constructFromObject({
      documentId: '1',
      tabLabel: 'Yes',
      anchorString: '/SMS/',
      anchorUnits: 'pixels',
      anchorXOffset: '20',
      anchorYOffset: '10',
    });
    const text1 = docusign.Text.constructFromObject({
      documentId: '1',
      tabLabel: 'FullName',
      anchorString: '/FullName/',
      anchorUnits: 'pixels',
      anchorXOffset: '20',
      anchorYOffset: '10',
    });
    const text2 = docusign.Text.constructFromObject({
      documentId: '1',
      tabLabel: 'PhoneNumber',
      anchorString: '/PhoneNumber/',
      anchorUnits: 'pixels',
      anchorXOffset: '20',
      anchorYOffset: '10',
    });
    const text3 = docusign.Text.constructFromObject({
      documentId: '1',
      tabLabel: 'Company',
      anchorString: '/Company/',
      anchorUnits: 'pixels',
      anchorXOffset: '20',
      anchorYOffset: '10',
    });
    const text4 = docusign.Text.constructFromObject({
      documentId: '1',
      tabLabel: 'JobTitle',
      anchorString: '/JobTitle/',
      anchorUnits: 'pixels',
      anchorXOffset: '20',
      anchorYOffset: '10',
    });
    const dateSigned = docusign.DateSigned.constructFromObject({
      documentId: '1',
      tabLabel: 'DateSigned',
      anchorString: '/Date/',
      anchorUnits: 'pixels',
      anchorXOffset: '20',
      anchorYOffset: '10',
    });

    // Tabs are set per recipient / signer
    const signerTabs = docusign.Tabs.constructFromObject({
      checkboxTabs: [check],
      signHereTabs: [signHere],
      textTabs: [text1, text2, text3, text4],
      dateSigned: [dateSigned],
    });

    // create a signer recipient
    const signer = docusign.Signer.constructFromObject({
      roleName: 'signer',
      recipientId: '1',
      routingOrder: '1',
      tabs: signerTabs,
    });

    // Add the recipients to the env object
    const recipients = docusign.Recipients.constructFromObject({
      signers: [signer],
    });

    // create the overall template definition
    const template = new docusign.EnvelopeTemplate.constructFromObject({
      // The order in the docs array determines the order in the env
      documents: [doc],
      emailSubject: 'Please sign this document',
      description: 'Example template created via the API',
      name: args.templateName,
      shared: 'false',
      recipients: recipients,
      status: 'created',
    });

    return template;
  };
}

module.exports = WorkflowsController;
