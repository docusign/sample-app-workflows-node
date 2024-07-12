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

  static getTemplate = async args => {
    const { templateCaller } = this.selectWorkflow(args.templateType);
    const templateName = templateCaller().name;

    this.dsApiClient.setBasePath(args.basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);
    const templatesApi = new docusignEsign.TemplatesApi(this.dsApiClient);

    const results = await templatesApi.listTemplates(args.accountId, {
      searchText: templateName,
    });

    if (!results?.resultSetSize || Number(results.resultSetSize) <= 0) {
      return {
        message:
          'This template is missing on your Docusign account. Download the template, login to your account, go to "Templates / Start / Envelope Templates / Upload Template", upload it there and try again',
        templateName: this.selectTemplate(args.templateType),
      };
    }

    return {
      templateId: results.envelopeTemplates[0].templateId,
      templateName: results.envelopeTemplates[0].name,
      createdNewTemplate: false,
    };
  };

  static createTemplate = async args => {
    const { templateCaller } = this.selectWorkflow(args.templateType);

    this.dsApiClient.setBasePath(args.basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);
    const templatesApi = new docusignEsign.TemplatesApi(this.dsApiClient);
    const template = await templatesApi.createTemplate(args.accountId, {
      envelopeTemplate: templateCaller(),
    });

    return {
      templateId: template.templateId,
      templateName: template.name,
      createdNewTemplate: false,
    };
  };

  static createWorkflow = async ({ templateId, accessToken, basePath, accountId, templateType }) => {
    const { workflowCaller } = this.selectWorkflow(templateType);
    const workflowTemplate = workflowCaller(templateId, accountId);
    workflowTemplate.workflowDefinition.workflowName += ` - ${this.workflowSuffix}`;

    this.dsApiClient.setBasePath(basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

    const workflowManagementApi = new docusign.WorkflowManagementApi(this.dsApiClient);
    const workflow = await workflowManagementApi.createWorkflowDefinition(workflowTemplate, accountId);

    return workflow;
  };

  static getWorkflowDefinition = async args => {
    this.dsApiClient.setBasePath(args.basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);

    return await this.workflowManagementApi.getWorkflowDefinition(args.accountId, args.workflowId);
  };

  static getWorkflowDefinitions = async args => {
    this.dsApiClient.setBasePath(args.basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);

    const definitions = await this.workflowManagementApi.getWorkflowDefinitions(args.accountId, {
      status: 'active',
    });
    return definitions;
  };

  static getWorkflowInstance = async args => {
    this.dsApiClient.setBasePath(args.basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);

    return await this.workflowInstanceManagementApi.getWorkflowInstance(
      args.accountId,
      args.definitionId,
      args.instanceId
    );
  };

  static getWorkflowInstances = async args => {
    this.dsApiClient.setBasePath(args.basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);

    return await this.workflowInstanceManagementApi.getWorkflowInstances(args.accountId, args.definitionId);
  };

  static publishWorkflow = async (args, workflowId) => {
    this.dsApiClient.setBasePath(args.basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);

    try {
      const publishedWorkflow = await this.workflowManagementApi.publishOrUnPublishWorkflowDefinition(
        new docusign.DeployRequest(),
        args.accountId,
        workflowId
      );
      return publishedWorkflow;
    } catch (error) {
      const isConsentRequired = error?.response?.body?.message === 'Consent required';

      if (isConsentRequired) {
        throw {
          errorMessage: 'Consent required',
          consentUrl: error.response.body.consentUrl,
        };
      }

      throw error;
    }
  };

  static triggerWorkflowInstance = async args => {
    this.dsApiClient.setBasePath(args.basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);

    const workflowTriggerApi = new docusign.WorkflowTriggerApi(this.dsApiClient);

    const mtid = args.mtid;
    const mtsec = args.mtsec;

    const payload = {};
    if (args.templateType === TEMPLATE_TYPE.I9) {
      payload.preparerName = args.preparerName;
      payload.preparerEmail = args.preparerEmail;
      payload.employeeName = args.employeeName;
      payload.employeeEmail = args.employeeEmail;
      payload.hrApproverName = args.hrApproverName;
      payload.hrApproverEmail = args.hrApproverEmail;
    }
    if (args.templateType === TEMPLATE_TYPE.OFFER) {
      payload.hrManagerName = args.hrManagerName;
      payload.hrManagerEmail = args.hrManagerEmail;
      payload.Company = args.Company;
    }
    if (args.templateType === TEMPLATE_TYPE.NDA) {
      payload.hrManagerName = args.hrManagerName;
      payload.hrManagerEmail = args.hrManagerEmail;
    }

    const triggerPayload = docusign.TriggerPayload.constructFromObject({
      participant: {},
      payload: payload,
      metadata: {},
    });

    return await workflowTriggerApi.triggerWorkflow(triggerPayload, args.accountId, { mtid, mtsec });
  };
}

module.exports = WorkflowsService;
