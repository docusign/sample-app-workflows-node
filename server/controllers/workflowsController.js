const docusign = require('docusign-maestro');
const validator = require('validator');
const config = require('../config');
const { createWorkflow, publishWorkflow } = require('../utils/workflowUtils.js');
const path = require('path');

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
  static webformsScopes = ['webforms_read', 'webforms_instance_read', 'webforms_instance_write'];
  static scopes = ['signature', 'aow_manage', 'impersonation'];
  static templatesPath = path.resolve(__dirname, '../assets/templates');
  static newI9Template = 'NewI9Template.json';

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

    switch (req.templateType) {
      case 'newI9':
        templateFile = this.newI9Template;
        break;
      // TODO: Add NDA Template File
      case 'newNda':
        break;
      // TODO: Add OfferLetter Template File
      case 'newOfferLetter':
        break;
    }

    const args = {
      accessToken: req.user.userId,
      accountId: req.session.accountId,
      templateType: req.templateType,
      docFile: path.resolve(this.templatesPath, templateFile),
    };

    this.dsApi.setBasePath(args.basePath);
    this.dsApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
    let templatesApi = new docusign.TemplatesApi(this.dsApi);
    let results = null;
    let templateId = null; // the template that exists or will be created.
    let resultsTemplateName = null;
    let createdNewTemplate = null;
    // Step 1. See if the template already exists
    // Exceptions will be caught by the calling function
    results = await templatesApi.listTemplates(args.accountId, {
      searchText: args.templateName,
    });

    if (results.resultSetSize > 0) {
      templateId = results.envelopeTemplates[0].templateId;
      resultsTemplateName = results.envelopeTemplates[0].name;
      createdNewTemplate = false;
    } else {
      // Template doesn't exist. Therefore, create it...
      // Step 2 Create the template
      //ds-snippet-start:eSign8Step3
      let templateReqObject = this.makeTemplate(args);
      results = await templatesApi.createTemplate(args.accountId, {
        envelopeTemplate: templateReqObject,
      });
      //ds-snippet-end:eSign8Step3
      createdNewTemplate = true;
      // Retrieve the new template Name / TemplateId
      results = await templatesApi.listTemplates(args.accountId, {
        searchText: args.templateName,
      });
      templateId = results.envelopeTemplates[0].templateId;
      resultsTemplateName = results.envelopeTemplates[0].name;
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
    const authType = req.session.authType;

    if (authType === 'JWT') {
      //TODO: Add authenticate redirect url to give user an ability to authenticate
      // const authenticateUrl
      res.status(403).send({ errorMessage: 'Authenticate with DocuSign Developer Account.' });
    }

    let templateId;
    if (req.session.templateId === null) {
      templateId = await this.createTemplate(req).templateId;
    } else {
      templateId = req.session.templateId;
    }

    // Step 2. Call the worker method
    const args = {
      templateId: templateId,
      accessToken: req.user.accessToken,
      basePath: config.maestroApiUrl,
      accountId: req.session.accountId,
    };
    let results = null;

    try {
      req.session.workflowId = await createWorkflow(args);
      const consentUrl = await publishWorkflow(args, req.session.workflowId);
      if (consentUrl) {
        const urlScopes = this.scopes.concat(this.webformsScopes).join('+');

        const consentUrl =
          `${config.dsOauthServer}/oauth/auth?response_type=code&` +
          `scope=${urlScopes}&client_id=${config.clientId}&` +
          `redirect_uri=${config.redirectUri}`;

        console.log(consentUrl);

        res.status(210).send(consentUrl);
      }
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
}

module.exports = WorkflowsController;
