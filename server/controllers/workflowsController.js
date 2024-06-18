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
const validator = require('validator');
const docusign = require('docusign-esign');
const config = require('../config');
const WorkflowsService = require('../services/workflowsService');

const oAuth = docusign.ApiClient.OAuth;
const restApi = docusign.ApiClient.RestApi;

class WorkflowsController {
  // For production environment, change "DEMO" to "PRODUCTION"
  static basePath = restApi.BasePath.DEMO; // https://demo.docusign.net/restapi
  static oAuthBasePath = oAuth.BasePath.DEMO; // account-d.docusign.com

  /**
   * Cancels workflow instance and sends a response.
   */
  static cancelWorkflow = async (req, res) => {
    try {
      const results = await WorkflowsService.cancelWorkflowInstance({
        instanceId: req?.params?.instanceId,
        accessToken: req?.user?.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req?.session?.accountId,
      });
      res.status(200).send(results);
    } catch (error) {
      this.handleForbiddenResponse(error, res);
    }
  };

  /**
   * Creates workflow instance and sends a response.
   */
  static createWorkflow = async (req, res) => {
    if (!req.session.templateId) {
      const templateResponse = await WorkflowsService.getTemplate({
        basePath: this.basePath,
        accessToken: req?.user?.accessToken,
        accountId: req?.session?.accountId,
        templateType: req?.body?.templateType,
      });

      if (!templateResponse.templateId) {
        res.status(400).send(templateResponse);
        return;
      }

      req.session.templateId = templateResponse.templateId;
    }

    try {
      const workflow = await WorkflowsService.createWorkflow({
        templateId: req?.session?.templateId,
        accessToken: req?.user?.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req?.session?.accountId,
      });

      const workflowResponse = {
        ...workflow.workflowDefinition,
        workflowDefinitionId: workflow.workflowDefinitionId,
      };
      res.json(workflowResponse);
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
        accessToken: req?.user?.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req?.session?.accountId,
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
        definitionId: req?.params?.definitionId,
        accessToken: req?.user?.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req?.session?.accountId,
      });

      res.status(200).send(results);
    } catch (error) {
      this.handleForbiddenResponse(error, res);
    }
  };

  /**
   * Triggers a workflow instance and sends a response.
   */
  static triggerWorkflow = async (req, res, next) => {
    // Step 1. Check the token
    const isTokenOK = req.dsAuth.checkToken(req);
    if (!isTokenOK) {
      req.dsAuth.internalLogout(req, res, next);
      res.status(401).send();
      return;
    }

    // Step 2. Call the worker method
    const { body } = req;
    const args = {
      instanceName: validator.escape(body?.instanceName),
      signerEmail: validator.escape(body?.signerEmail),
      signerName: validator.escape(body?.signerName),
      ccEmail: validator.escape(body?.ccEmail),
      ccName: validator.escape(body?.ccName),
      workflowId: req?.session?.workflowId,
      accessToken: req?.user?.accessToken,
      basePath: config.maestroApiUrl,
      accountId: req?.session?.accountId,
    };

    try {
      const workflow = await WorkflowsService.getWorkflowDefinition(args);
      const results = await WorkflowsService.triggerWorkflowInstance(workflow, args);
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
    const errorCode = error?.response?.statusCode;
    const errorMessage = error?.response?.body?.message;

    // use custom error message if Maestro is not enabled for the account
    const errorInfo = errorCode === 403 ? 'Contact Support to enable this Feature' : null;

    res.status(403).send({ err: error, errorCode, errorMessage, errorInfo });
  }
}

module.exports = WorkflowsController;
