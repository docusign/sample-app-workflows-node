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

const path = require('path');
const validator = require('validator'); // Package to prevent XSS. This is not express-validator
const docusign = require('docusign-esign');
const config = require('../config');
const WorkflowsService = require('../services/workflowsService');
const createPrefixedLogger = require('../utils/logger');
const { getParameterValueFromUrl } = require('../utils/utils');

const oAuth = docusign.ApiClient.OAuth;
const restApi = docusign.ApiClient.RestApi;

class WorkflowsController {
  // For production environment, change "DEMO" to "PRODUCTION"
  static basePath = restApi.BasePath.DEMO; // https://demo.docusign.net/restapi
  static oAuthBasePath = oAuth.BasePath.DEMO; // account-d.docusign.com
  static logger = createPrefixedLogger(WorkflowsController.name);

  /**
   * Creates workflow instance and sends a response.
   */
  static createWorkflow = async (req, res) => {
    if (!req.session.templateId) {
      const templateResponse = await WorkflowsService.getTemplate({
        basePath: this.basePath,
        accessToken: req.user.accessToken,
        accountId: req.session.accountId,
        templateType: req?.body?.templateType,
      });

      if (!templateResponse.templateId) {
        this.logger.info("createWorkflow: templateResponse doesn't have templateId, returns 400 status");
        res.status(400).send(templateResponse);
        return;
      }

      req.session.templateId = templateResponse.templateId;
    }

    try {
      const workflow = await WorkflowsService.createWorkflow({
        templateId: req.session.templateId,
        accessToken: req.user.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req.session.accountId,
        templateType: req?.body?.templateType,
      });

      res.json({ workflowDefinitionId: workflow.workflowDefinitionId });
    } catch (error) {
      this.handleForbiddenResponse(error, res);
    }
  };

  /**
   * Cancels workflow instance and sends a response.
   */
  static cancelWorkflow = async (req, res) => {
    try {
      const results = await WorkflowsService.cancelWorkflowInstance({
        instanceId: req?.params?.instanceId,
        accessToken: req.user.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req.session.accountId,
      });
      res.status(200).send(results);
    } catch (error) {
      this.handleForbiddenResponse(error, res);
    }
  };

  /**
   * Publish workflow by id.
   */
  static publishWorkflow = async (req, res) => {
    const workflowId = req?.body?.workflowId;

    try {
      let result = await WorkflowsService.publishWorkflow(
        {
          basePath: config.maestroApiUrl,
          accessToken: req.user.accessToken,
          accountId: req.session.accountId,
        },
        workflowId
      );

      res.status(200).send(result);
    } catch (error) {
      if (error?.errorMessage === 'Consent required') {
        res.status(210).send(error.consentUrl);
        return;
      }

      this.handleForbiddenResponse(error, res);
    }
  };

  /**
   * Gets workflow definitions and returns it.
   */
  static getWorkflowDefinitions = async (req, res) => {
    try {
      const results = await WorkflowsService.getWorkflowDefinitions({
        accessToken: req?.user?.accessToken || req?.session?.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req.session.accountId,
      });
      res.status(200).send(results);
    } catch (error) {
      this.handleForbiddenResponse(error, res);
    }
  };

  /**
   * Gets workflow instance and returns it.
   */
  static getWorkflowInstance = async (req, res) => {
    try {
      const results = await WorkflowsService.getWorkflowInstance({
        instanceId: req?.params?.instanceId,
        definitionId: req?.params?.definitionId,
        accessToken: req.user.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req.session.accountId,
      });
      res.status(200).send(results);
    } catch (error) {
      this.handleForbiddenResponse(error, res);
    }
  };

  /**
   * Gets workflow instances and returns it.
   */
  static getWorkflowInstances = async (req, res) => {
    try {
      const results = await WorkflowsService.getWorkflowInstances({
        definitionId: req.params.definitionId,
        accessToken: req.user.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req.session.accountId,
      });

      res.status(200).send(results);
    } catch (error) {
      this.handleForbiddenResponse(error, res);
    }
  };

  /**
   * Triggers a workflow instance and sends a response.
   */
  static triggerWorkflow = async (req, res) => {
    const { body } = req;
    const args = {
      instanceName: validator.escape(body?.instanceName),
      signerEmail: validator.escape(body?.signerEmail),
      signerName: validator.escape(body?.signerName),
      ccEmail: validator.escape(body?.ccEmail),
      ccName: validator.escape(body?.ccName),
      workflowId: req.params.definitionId,
      accessToken: req.user.accessToken,
      basePath: config.maestroApiUrl,
      accountId: req.session.accountId,
      mtid: undefined,
      mtsec: undefined,
    };

    try {
      const workflow = await WorkflowsService.getWorkflowDefinition(args);
      args.mtid = getParameterValueFromUrl(workflow.triggerUrl, 'mtid');
      args.mtsec = getParameterValueFromUrl(workflow.triggerUrl, 'mtsec');

      const results = await WorkflowsService.triggerWorkflowInstance(args);
      res.status(200).send(results);
    } catch (error) {
      this.handleForbiddenResponse(error, res);
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

  static handleForbiddenResponse(error, res) {
    this.logger.error(`handleForbiddenResponse: ${error}`);

    const errorCode = error?.response?.statusCode;
    const errorMessage = error?.response?.body?.message;

    // use custom error message if Maestro is not enabled for the account
    const errorInfo = errorCode === 403 ? 'Contact Support to enable this Feature' : null;

    res.status(403).send({ err: error, errorCode, errorMessage, errorInfo });
  }
}

module.exports = WorkflowsController;
