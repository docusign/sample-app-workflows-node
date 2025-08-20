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
const { ISSUES } = require('../constants');

const oAuth = docusign.ApiClient.OAuth;
const restApi = docusign.ApiClient.RestApi;

class WorkflowsController {
  // For production environment, change "DEMO" to "PRODUCTION"
  static basePath = restApi.BasePath.DEMO; // https://demo.docusign.net/restapi
  static oAuthBasePath = oAuth.BasePath.DEMO; // account-d.docusign.com
  static templatesPath = path.join(path.resolve(), 'assets/templates');
  static logger = createPrefixedLogger(WorkflowsController.name);

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
      this.handleErrorResponse(error, res);
    }
  };

  /**
   * Gets the requirements to trigger workflow.
   */
  static getWorkflowTriggerRequirements = async (req, res) => {
    try {
      const results = await WorkflowsService.getWorkflowTriggerRequirements({
        accessToken: req?.user?.accessToken || req?.session?.accessToken,
        basePath: config.maestroApiUrl,
        accountId: req.session.accountId,
        workflowId: req.params.definitionId,
      });
      res.status(200).send(results);
    } catch (error) {
      this.handleErrorResponse(error, res);
    }
  };

  /**
   * Triggers a workflow instance and sends a response.
   */
  static triggerWorkflow = async (req, res) => {
    const { body } = req;

    const args = {
      templateType: req.query.type,
      workflowId: req.params.definitionId,
      accessToken: req?.user?.accessToken || req?.session?.accessToken,
      basePath: config.maestroApiUrl,
      accountId: req.session.accountId,
    };

    try {
      const triggerRequirements = await WorkflowsService.getWorkflowTriggerRequirements(args);
      const result = await WorkflowsService.triggerWorkflowInstance(args, body, triggerRequirements);
      res.status(200).send(result);
    } catch (error) {
      res.status(200).send(ISSUES.TRIGGER_ISSUE);
    }
  };

  static pauseWorkflow = async (req, res) => {
    try {
      const args = {
        workflowId: req.params.definitionId,
        accessToken: req?.user?.accessToken || req?.session?.accessToken,
        accountId: req.session.accountId,
      };

      const result = await WorkflowsService.pauseWorkflow(args);
      res.status(200).send(result);
    } catch (error) {
      this.handleErrorResponse(error, res);
    }
  };

  static resumePausedWorkflow = async (req, res) => {
    try {
      const args = {
        workflowId: req.params.definitionId,
        accessToken: req?.user?.accessToken || req?.session?.accessToken,
        accountId: req.session.accountId,
      };

      const result = await WorkflowsService.resumePausedWorkflow(args);
      res.status(200).send(result);
    } catch (error) {
      this.handleErrorResponse(error, res);
    }
  };

  static getInstances = async (req, res) => {
    try {
      const args = {
        workflowId: req.params.definitionId,
        accessToken: req?.user?.accessToken || req?.session?.accessToken,
        accountId: req.session.accountId,
      };

      const result = await WorkflowsService.getInstances(args);
      res.status(200).send(result);
    } catch (error) {
      this.handleErrorResponse(error, res);
    }
  };

  static cancelWorkflow = async (req, res) => {
    try {
      const args = {
        workflowId: req.params.definitionId,
        instanceId: req.params.instanceId,
        accessToken: req?.user?.accessToken || req?.session?.accessToken,
        accountId: req.session.accountId,
      };

      const result = await WorkflowsService.cancelWorkflow(args);
      res.status(200).send(result);
    } catch (error) {
      this.handleErrorResponse(error, res);
    }
  };

  static handleErrorResponse(error, res) {
    this.logger.error(`handleErrorResponse: ${error}`);

    const errorCode = error?.response?.statusCode || error?.statusCode;
    const errorMessage = error?.response?.body?.message || error?.message || error?.rawMessage;

    // use custom error message if Maestro is not enabled for the account
    if (errorCode === 403) {
      res.status(403).send({ err: error, errorMessage, errorInfo: 'Contact Support to enable this Feature' });
      return;
    }

    res.status(errorCode).send({ err: error, errorMessage, errorInfo: null });
  }
}

module.exports = WorkflowsController;
