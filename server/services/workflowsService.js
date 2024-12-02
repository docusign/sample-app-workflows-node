/**
 * @file
 * This file handles work with docusign maestro and esign services.
 * Scenarios implemented:
 * - Workflow definition creation.
 * - Workflow definition publishing.
 * - Workflow definition triggering, which create workflow instance.
 * - Workflow instance cancellation.
 * - Workflow instance fetching.
 */

const docusign = require('docusign-maestro');
const docusignEsign = require('docusign-esign');
const workflowI9 = require('../assets/workflows/I9.workflow');
const workflowOfferLetter = require('../assets/workflows/offerLetter.workflow');
const workflowNda = require('../assets/workflows/nda.workflow');
const templateI9 = require('../assets/templates/I9.template');
const templateOfferLetter = require('../assets/templates/offerLetter.template');
const templateNda = require('../assets/templates/nda.template');
const { TEMPLATE_TYPE } = require('../constants');
const { initMaestroApi } = require('../api');

const oAuth = docusign.ApiClient.OAuth;
const restApi = docusign.ApiClient.RestApi;

class WorkflowsService {
  // Constants
  static dsApiClient = new docusign.ApiClient();
  static workflowManagementApi = new docusign.WorkflowManagementApi(this.dsApiClient);
  static workflowInstanceManagementApi = new docusign.WorkflowInstanceManagementApi(this.dsApiClient);
  static workflowSuffix = 'send invite to signer';

  // For production environment, change "DEMO" to "PRODUCTION"
  static basePath = restApi.BasePath.DEMO; // https://demo.docusign.net/restapi
  static oAuthBasePath = oAuth.BasePath.DEMO; // account-d.docusign.com

  static cancelWorkflowInstance = async args => {
    this.dsApiClient.setBasePath(this.basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);

    return await this.workflowInstanceManagementApi.cancelWorkflowInstance(args.accountId, args.instanceId);
  };

  static selectTemplate = templateType => {
    let templateFile = null;

    switch (templateType) {
      case TEMPLATE_TYPE.I9:
        templateFile = 'Maestro_I9.json';
        break;

      case TEMPLATE_TYPE.OFFER:
        templateFile = 'Maestro_Offer_Letter.json';
        break;

      case TEMPLATE_TYPE.NDA:
        templateFile = 'Maestro_NDA.json';
        break;

      default:
        throw new Error('selectTemplate: TemplateType is not correct or not found');
    }

    return templateFile;
  };

  static selectWorkflow = templateType => {
    let workflowCaller = null;
    let templateCaller = null;

    switch (templateType) {
      case TEMPLATE_TYPE.I9:
        workflowCaller = workflowI9;
        templateCaller = templateI9;
        break;

      case TEMPLATE_TYPE.OFFER:
        workflowCaller = workflowOfferLetter;
        templateCaller = templateOfferLetter;
        break;

      case TEMPLATE_TYPE.NDA:
        workflowCaller = workflowNda;
        templateCaller = templateNda;
        break;

      default:
        throw new Error('selectWorkflow: TemplateType is not correct or not found');
    }

    return { workflowCaller, templateCaller };
  };

  static getWorkflowDefinition = async args => {
    this.dsApiClient.setBasePath(args.basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);

    return await this.workflowManagementApi.getWorkflowDefinition(args.accountId, args.workflowId);
  };

  static getWorkflowDefinitions = async args => {
    const api = initMaestroApi(args.accountId, args.basePath, args.accessToken);
    const definitions = await api.getWorkflowDefinitions({
      status: 'active',
    });

    return definitions;
  };

  static getWorkflowTriggerRequirements = async args => {
    const api = initMaestroApi(args.accountId, args.basePath, args.accessToken);
    const triggerRequirements = await api.getTriggerRequirements(args.workflowId);

    return triggerRequirements;
  };

  static triggerWorkflowInstance = async (args, payload, triggerRequirements) => {
    const api = initMaestroApi(args.accountId, args.basePath, args.accessToken);
    const triggerPayload = {
      participant: {},
      metadata: {},
      payload,
    };
    const triggerResponse = await api.triggerWorkflow(triggerPayload, triggerRequirements.trigger_http_config.url);

    return triggerResponse;
  };
}

module.exports = WorkflowsService;
