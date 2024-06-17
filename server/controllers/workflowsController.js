/**
 * @file
 * This file handles the Workflow scenarios.
 * Scenarios implemented:
 * - Workflow definition creation.
 * - Workflow definition publishing.
 * - Workflow definition triggering, which create workflow instance.
 * - Workflow instance cancellation.
 * - Workflow instance fetching.
 */

const docusign = require('docusign-esign');
const validator = require('validator');
const config = require('../config');
const workflowsUtils = require('../utils/workflowsUtils');
const path = require('path');
const createPrefixedLogger = require('../utils/logger');
const oAuth = docusign.ApiClient.OAuth;
const restApi = docusign.ApiClient.RestApi;

class WorkflowsController {
  // Constants
  static mustAuthenticate = '/ds/mustAuthenticate';

  // For production environment, change "DEMO" to "PRODUCTION"
  static basePath = restApi.BasePath.DEMO; // https://demo.docusign.net/restapi
  static oAuthBasePath = oAuth.BasePath.DEMO; // account-d.docusign.com

  constructor() {
    this.logger = createPrefixedLogger(WorkflowsController.name);
  }

  /**
   * Cancels workflow instance and sends a response.
   */
  static cancelWorkflow = async (req, res) => {
    const args = {
      instanceId: req.session.instanceId,
      accessToken: req.user.accessToken,
      basePath: config.maestroApiUrl,
      accountId: req.session.accountId,
    };
    let results = null;

    try {
      results = await workflowsUtils.cancelWorkflowInstance(args);
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
   * Creates workflow instance and sends a response.
   */
  static createWorkflow = async (req, res) => {
    let templateId;
    if (!req.session.templateId) {
      const createTemplateArgs = {
        basePath: this.basePath,
        accessToken: req.user.accessToken,
        accountId: req.session.accountId,
        templateType: req.body.templateType,
      };

      const templateResponse = await workflowsUtils.getTemplate(createTemplateArgs);
      if (templateResponse.templateId) {
        templateId = templateResponse.templateId;
      } else {
        res.status(400).send(templateResponse);
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
        const workflow = await workflowsUtils.createWorkflow(args);
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
   * Gets workflow instance and returns it.
   */
  static getWorkflowInstance = async (req, res) => {
    const args = {
      instanceId: req.session.instanceId,
      definitionId: req.session.workflowDefinitionId,
      accessToken: req.user.accessToken,
      basePath: config.maestroApiUrl,
      accountId: req.session.accountId,
    };
    let results = null;

    try {
      results = await workflowsUtils.getWorkflowInstance(args);
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
   * Gets workflow instances and returns it.
   */
  static getWorkflowInstances = async (req, res) => {
    const args = {
      definitionId: req.session.workflowDefinitionId,
      accessToken: req.user.accessToken,
      basePath: config.maestroApiUrl,
      accountId: req.session.accountId,
    };
    let results = null;

    try {
      results = await workflowsUtils.getWorkflowInstances(args);
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
   * Triggers a workflow instance and sends a response.
   */
  static triggerWorkflow = async (req, res) => {
    // Step 1. Check the token
    // At this point we should have a good token. But we
    // double-check here to enable a better UX to the user.
    const isTokenOK = req.dsAuth.checkToken(req);
    if (!isTokenOK) {
      req.flash('info', 'Sorry, you need to re-authenticate.');
      // Save the current operation, so it will be resumed after authentication
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
      basePath: config.maestroApiUrl,
      accountId: req.session.accountId,
    };
    let results = null;

    try {
      const workflow = await workflowsUtils.getWorkflowDefinition(args);
      results = await workflowsUtils.triggerWorkflowInstance(workflow, args);
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
   * Download workflow template from assets/[name].json.
   */
  static downloadWorkflowTemplate = async (req, res) => {
    const templateName = req.params.templateName;
    const templatePath = path.resolve(this.templatesPath, templateName);
    res.download(templatePath);
  };
}

module.exports = WorkflowsController;
