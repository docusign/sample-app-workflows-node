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

const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const docusign = require('docusign-maestro');
const docusignEsign = require('docusign-esign');
const { TEMPLATE_TYPE } = require('../constants');

const oAuth = docusign.ApiClient.OAuth;
const restApi = docusign.ApiClient.RestApi;

class WorkflowsService {
  // Constants
  static templatesPath = path.join(path.resolve(), 'assets/templates');
  static i9Template = 'I9Template.json';
  static offerLetterTemplate = 'OfferLetterTemplate.json';
  // static ndaTemplate = 'ndaTemplate.json';
  static ndaTemplate = 'WORKFLOW_NDA.json';
  static workflowSuffix = 'send invite to signer';
  static dsApiClient = new docusign.ApiClient();
  static workflowManagementApi = new docusign.WorkflowManagementApi(this.dsApiClient);
  static workflowInstanceManagementApi = new docusign.WorkflowInstanceManagementApi(this.dsApiClient);

  // For production environment, change "DEMO" to "PRODUCTION"
  static basePath = restApi.BasePath.DEMO; // https://demo.docusign.net/restapi
  static oAuthBasePath = oAuth.BasePath.DEMO; // account-d.docusign.com

  static cancelWorkflowInstance = async args => {
    this.dsApiClient.setBasePath(this.basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);

    return await this.workflowInstanceManagementApi.cancelWorkflowInstance(args.accountId, args.instanceId);
  };

  static getTemplate = async args => {
    let templateFile = null;

    switch (args.templateType) {
      case TEMPLATE_TYPE.I9:
        templateFile = this.i9Template;
        break;

      case TEMPLATE_TYPE.NDA:
        templateFile = this.ndaTemplate;
        break;

      case TEMPLATE_TYPE.OFFER:
        templateFile = this.offerLetterTemplate;
        break;
    }

    const templateFileBuffer = fs.readFileSync(path.resolve(this.templatesPath, templateFile), 'utf8');
    const templateFileContent = JSON.parse(templateFileBuffer);

    this.dsApiClient.setBasePath(args.basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${args.accessToken}`);
    let templatesApi = new docusignEsign.TemplatesApi(this.dsApiClient);

    const results = await templatesApi.listTemplates(args.accountId, {
      searchText: templateFileContent.name,
    });

    if (!results?.resultSetSize || Number(results.resultSetSize) <= 0) {
      return {
        message:
          'This template is missing on your Docusign account. Download the template, login to your account, go to "Templates / Start / Envelope Templates / Upload Template", upload it there and try again',
        templateName: templateFile,
      };
    }

    return {
      templateId: results.envelopeTemplates[0].templateId,
      templateName: results.envelopeTemplates[0].name,
      createdNewTemplate: false,
    };
  };

  static createWorkflow2 = async ({ templateId, accessToken, basePath, accountId, templateType }) => {
    const signerId = uuid.v4();
    const ccId = uuid.v4();
    const triggerId = 'wfTrigger';

    const participants = {
      [signerId]: {
        participantRole: 'Signer',
      },
      [ccId]: {
        participantRole: 'CC',
      },
    };

    const dacIdField = `dacId_${triggerId}`;
    const idField = `id_${triggerId}`;
    // const signerNameField = `signerName_${triggerId}`;
    // const signerEmailField = `signerEmail_${triggerId}`;
    // const ccNameField = `ccName_${triggerId}`;
    // const ccEmailField = `ccEmail_${triggerId}`;
    const hrApproverNameField = `hrApproverName_${triggerId}`;
    const hrApproverEmailField = `hrApproverEmail_${triggerId}`;
    const trigger = docusign.DSWorkflowTrigger.constructFromObject({
      name: 'Get_URL',
      type: 'Http',
      httpType: 'Get',
      id: triggerId,
      input: {
        metadata: {
          customAttributes: {},
        },
        payload: {
          [dacIdField]: {
            source: 'step',
            propertyName: 'dacId',
            stepId: triggerId,
          },
          [idField]: {
            source: 'step',
            propertyName: 'id',
            stepId: triggerId,
          },

          [hrApproverNameField]: {
            source: 'step',
            propertyName: 'hrApproverName',
            stepId: triggerId,
          },
          [hrApproverEmailField]: {
            source: 'step',
            propertyName: 'hrApproverEmail',
            stepId: triggerId,
          },
          // [signerNameField]: {
          //   source: 'step',
          //   propertyName: 'signerName',
          //   stepId: triggerId,
          // },
          // [signerEmailField]: {
          //   source: 'step',
          //   propertyName: 'signerEmail',
          //   stepId: triggerId,
          // },
          // [ccNameField]: {
          //   source: 'step',
          //   propertyName: 'ccName',
          //   stepId: triggerId,
          // },
          // [ccEmailField]: {
          //   source: 'step',
          //   propertyName: 'ccEmail',
          //   stepId: triggerId,
          // },
        },
        participants: {},
      },
      output: {
        [dacIdField]: {
          source: 'step',
          propertyName: 'dacId',
          stepId: triggerId,
        },
      },
    });

    const variables = {
      [dacIdField]: docusign.DSWorkflowVariableRecord.constructFromObject({
        source: 'step',
        propertyName: 'dacId',
        stepId: triggerId,
      }),
      [idField]: docusign.DSWorkflowVariableRecord.constructFromObject({
        source: 'step',
        propertyName: 'id',
        stepId: triggerId,
      }),

      [hrApproverNameField]: docusign.DSWorkflowVariableRecord.constructFromObject({
        source: 'step',
        propertyName: 'hrApproverName',
        stepId: triggerId,
      }),
      [hrApproverEmailField]: docusign.DSWorkflowVariableRecord.constructFromObject({
        source: 'step',
        propertyName: 'hrApproverEmail',
        stepId: triggerId,
      }),
      // [signerNameField]: docusign.DSWorkflowVariableRecord.constructFromObject({
      //   source: 'step',
      //   propertyName: 'signerName',
      //   stepId: triggerId,
      // }),
      // [signerEmailField]: docusign.DSWorkflowVariableRecord.constructFromObject({
      //   source: 'step',
      //   propertyName: 'signerEmail',
      //   stepId: triggerId,
      // }),
      // [ccNameField]: docusign.DSWorkflowVariableRecord.constructFromObject({
      //   source: 'step',
      //   propertyName: 'ccName',
      //   stepId: triggerId,
      // }),
      // [ccEmailField]: docusign.DSWorkflowVariableRecord.constructFromObject({
      //   source: 'step',
      //   propertyName: 'ccEmail',
      //   stepId: triggerId,
      // }),

      envelopeId_step2: docusign.DSWorkflowVariableRecord.constructFromObject({
        source: 'step',
        propertyName: 'envelopeId',
        stepId: 'step2',
        type: 'String',
      }),
      combinedDocumentsBase64_step2: docusign.DSWorkflowVariableRecord.constructFromObject({
        source: 'step',
        propertyName: 'combinedDocumentsBase64',
        stepId: 'step2',
        type: 'File',
      }),
      'fields.signer.text.value_step2': docusign.DSWorkflowVariableRecord.constructFromObject({
        source: 'step',
        propertyName: 'fields.signer.text.value',
        stepId: 'step2',
        type: 'String',
      }),
    };

    const step1 = {
      id: 'step1',
      name: 'Set Up Invite',
      moduleName: 'Notification-SendEmail',
      configurationProgress: 'Completed',
      type: 'DS-EmailNotification',
      config: {
        templateType: 'WorkflowParticipantNotification',
        templateVersion: 1,
        language: 'en',
        sender_name: 'DocuSign Orchestration',
        sender_alias: 'Orchestration',
        participantId: signerId,
      },
      input: {
        recipients: [
          {
            name: {
              source: 'step',
              propertyName: 'hrApproverName',
              // propertyName: 'signerName',
              stepId: triggerId,
            },
            email: {
              source: 'step',
              propertyName: 'hrApproverEmail',
              // propertyName: 'signerEmail',
              stepId: triggerId,
            },
          },
        ],
        mergeValues: {
          CustomMessage: 'Follow this link to access and complete the workflow.',
          ParticipantFullName: {
            source: 'step',
            propertyName: 'hrApproverName',
            // propertyName: 'signerName',
            stepId: triggerId,
          },
        },
      },
      output: {},
    };

    const step2 = {
      id: 'step2',
      name: 'Get Signatures',
      moduleName: 'ESign',
      configurationProgress: 'Completed',
      type: 'DS-Sign',
      config: {
        participantId: signerId,
      },
      input: {
        isEmbeddedSign: true,
        documents: [
          {
            type: 'FromDSTemplate',
            eSignTemplateId: templateId,
          },
        ],
        emailSubject: 'Please sign this document',
        emailBlurb: '',
        recipients: {
          signers: [
            {
              defaultRecipient: 'false',
              tabs: {
                signHereTabs: [
                  {
                    stampType: 'signature',
                    name: 'SignHere',
                    tabLabel: 'Sign Here',
                    scaleValue: '1',
                    optional: 'false',
                    documentId: '1',
                    recipientId: '1',
                    pageNumber: '1',
                    xPosition: '191',
                    yPosition: '148',
                    tabId: '1',
                    tabType: 'signhere',
                  },
                ],
                textTabs: [
                  {
                    requireAll: 'false',
                    value: '',
                    required: 'false',
                    locked: 'false',
                    concealValueOnDocument: 'false',
                    disableAutoSize: 'false',
                    tabLabel: 'text',
                    font: 'helvetica',
                    fontSize: 'size14',
                    localePolicy: {},
                    documentId: '1',
                    recipientId: '1',
                    pageNumber: '1',
                    xPosition: '153',
                    yPosition: '230',
                    width: '84',
                    height: '23',
                    tabId: '2',
                    tabType: 'text',
                  },
                ],
                checkboxTabs: [
                  {
                    name: '',
                    tabLabel: 'ckAuthorization',
                    selected: 'false',
                    selectedOriginal: 'false',
                    requireInitialOnSharedChange: 'false',
                    required: 'true',
                    locked: 'false',
                    documentId: '1',
                    recipientId: '1',
                    pageNumber: '1',
                    xPosition: '75',
                    yPosition: '417',
                    width: '0',
                    height: '0',
                    tabId: '3',
                    tabType: 'checkbox',
                  },
                  {
                    name: '',
                    tabLabel: 'ckAuthentication',
                    selected: 'false',
                    selectedOriginal: 'false',
                    requireInitialOnSharedChange: 'false',
                    required: 'true',
                    locked: 'false',
                    documentId: '1',
                    recipientId: '1',
                    pageNumber: '1',
                    xPosition: '75',
                    yPosition: '447',
                    width: '0',
                    height: '0',
                    tabId: '4',
                    tabType: 'checkbox',
                  },
                  {
                    name: '',
                    tabLabel: 'ckAgreement',
                    selected: 'false',
                    selectedOriginal: 'false',
                    requireInitialOnSharedChange: 'false',
                    required: 'true',
                    locked: 'false',
                    documentId: '1',
                    recipientId: '1',
                    pageNumber: '1',
                    xPosition: '75',
                    yPosition: '478',
                    width: '0',
                    height: '0',
                    tabId: '5',
                    tabType: 'checkbox',
                  },
                  {
                    name: '',
                    tabLabel: 'ckAcknowledgement',
                    selected: 'false',
                    selectedOriginal: 'false',
                    requireInitialOnSharedChange: 'false',
                    required: 'true',
                    locked: 'false',
                    documentId: '1',
                    recipientId: '1',
                    pageNumber: '1',
                    xPosition: '75',
                    yPosition: '508',
                    width: '0',
                    height: '0',
                    tabId: '6',
                    tabType: 'checkbox',
                  },
                ],
                radioGroupTabs: [
                  {
                    documentId: '1',
                    recipientId: '1',
                    groupName: 'radio1',
                    radios: [
                      {
                        pageNumber: '1',
                        xPosition: '142',
                        yPosition: '384',
                        value: 'white',
                        selected: 'false',
                        tabId: '7',
                        required: 'false',
                        locked: 'false',
                        bold: 'false',
                        italic: 'false',
                        underline: 'false',
                        fontColor: 'black',
                        fontSize: 'size7',
                      },
                      {
                        pageNumber: '1',
                        xPosition: '74',
                        yPosition: '384',
                        value: 'red',
                        selected: 'false',
                        tabId: '8',
                        required: 'false',
                        locked: 'false',
                        bold: 'false',
                        italic: 'false',
                        underline: 'false',
                        fontColor: 'black',
                        fontSize: 'size7',
                      },
                      {
                        pageNumber: '1',
                        xPosition: '220',
                        yPosition: '384',
                        value: 'blue',
                        selected: 'false',
                        tabId: '9',
                        required: 'false',
                        locked: 'false',
                        bold: 'false',
                        italic: 'false',
                        underline: 'false',
                        fontColor: 'black',
                        fontSize: 'size7',
                      },
                    ],
                    shared: 'false',
                    requireInitialOnSharedChange: 'false',
                    requireAll: 'false',
                    tabType: 'radiogroup',
                    value: '',
                    originalValue: '',
                  },
                ],
                listTabs: [
                  {
                    listItems: [
                      {
                        text: 'Red',
                        value: 'red',
                        selected: 'false',
                      },
                      {
                        text: 'Orange',
                        value: 'orange',
                        selected: 'false',
                      },
                      {
                        text: 'Yellow',
                        value: 'yellow',
                        selected: 'false',
                      },
                      {
                        text: 'Green',
                        value: 'green',
                        selected: 'false',
                      },
                      {
                        text: 'Blue',
                        value: 'blue',
                        selected: 'false',
                      },
                      {
                        text: 'Indigo',
                        value: 'indigo',
                        selected: 'false',
                      },
                      {
                        text: 'Violet',
                        value: 'violet',
                        selected: 'false',
                      },
                    ],
                    value: '',
                    originalValue: '',
                    required: 'false',
                    locked: 'false',
                    requireAll: 'false',
                    tabLabel: 'list',
                    font: 'helvetica',
                    fontSize: 'size14',
                    localePolicy: {},
                    documentId: '1',
                    recipientId: '1',
                    pageNumber: '1',
                    xPosition: '142',
                    yPosition: '291',
                    width: '78',
                    height: '0',
                    tabId: '10',
                    tabType: 'list',
                  },
                ],
                numericalTabs: [
                  {
                    validationType: 'currency',
                    value: '',
                    required: 'false',
                    locked: 'false',
                    concealValueOnDocument: 'false',
                    disableAutoSize: 'false',
                    tabLabel: 'numericalCurrency',
                    font: 'helvetica',
                    fontSize: 'size14',
                    localePolicy: {
                      cultureName: 'en-US',
                      currencyPositiveFormat: 'csym_1_comma_234_comma_567_period_89',
                      currencyNegativeFormat: 'opar_csym_1_comma_234_comma_567_period_89_cpar',
                      currencyCode: 'usd',
                    },
                    documentId: '1',
                    recipientId: '1',
                    pageNumber: '1',
                    xPosition: '163',
                    yPosition: '260',
                    width: '84',
                    height: '0',
                    tabId: '11',
                    tabType: 'numerical',
                  },
                ],
              },
              signInEachLocation: 'false',
              agentCanEditEmail: 'false',
              agentCanEditName: 'false',
              requireUploadSignature: 'false',
              name: {
                source: 'step',
                propertyName: 'hrApproverName',
                // propertyName: 'signerName',
                stepId: triggerId,
              },
              email: {
                source: 'step',
                propertyName: 'hrApproverEmail',
                // propertyName: 'signerEmail',
                stepId: triggerId,
              },
              recipientId: '1',
              recipientIdGuid: '00000000-0000-0000-0000-000000000000',
              accessCode: '',
              requireIdLookup: 'false',
              routingOrder: '1',
              note: '',
              roleName: 'signer',
              completedCount: '0',
              deliveryMethod: 'email',
              templateLocked: 'false',
              templateRequired: 'false',
              inheritEmailNotificationConfiguration: 'false',
              recipientType: 'signer',
            },
          ],
          carbonCopies: [
            {
              agentCanEditEmail: 'false',
              agentCanEditName: 'false',
              name: {
                source: 'step',
                propertyName: 'hrApproverName',
                // propertyName: 'ccName',
                stepId: triggerId,
              },
              email: {
                source: 'step',
                propertyName: 'hrApproverEmail',
                // propertyName: 'ccEmail',
                stepId: triggerId,
              },
              recipientId: '2',
              recipientIdGuid: '00000000-0000-0000-0000-000000000000',
              accessCode: '',
              requireIdLookup: 'false',
              routingOrder: '2',
              note: '',
              roleName: 'cc',
              completedCount: '0',
              deliveryMethod: 'email',
              templateLocked: 'false',
              templateRequired: 'false',
              inheritEmailNotificationConfiguration: 'false',
              recipientType: 'carboncopy',
            },
          ],
          certifiedDeliveries: [],
        },
      },
      output: {
        envelopeId_step2: {
          source: 'step',
          propertyName: 'envelopeId',
          stepId: 'step2',
          type: 'String',
        },
        combinedDocumentsBase64_step2: {
          source: 'step',
          propertyName: 'combinedDocumentsBase64',
          stepId: 'step2',
          type: 'File',
        },
        'fields.signer.text.value_step2': {
          source: 'step',
          propertyName: 'fields.signer.text.value',
          stepId: 'step2',
          type: 'String',
        },
      },
    };

    const step3 = {
      id: 'step3',
      name: 'Show a Confirmation Screen',
      moduleName: 'ShowConfirmationScreen',
      configurationProgress: 'Completed',
      type: 'DS-ShowScreenStep',
      config: {
        participantId: signerId,
      },
      input: {
        httpType: 'Post',
        payload: {
          participantId: signerId,
          confirmationMessage: {
            title: 'Tasks complete',
            description: 'You have completed all your workflow tasks.',
          },
        },
      },
      output: {},
    };

    const workflowDefinition = docusign.WorkflowDefinition.constructFromObject({
      workflowName: `${templateType} - ${this.workflowSuffix}`,
      workflowDescription: '',
      accountId: accountId,
      participants: participants,
      trigger: trigger,
      variables: variables,
      steps: [step1, step2, step3],
    });
    workflowDefinition.documentVersion = '1.0.0';
    workflowDefinition.schemaVersion = '1.0.0';

    this.dsApiClient.setBasePath(basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

    const workflowManagementApi = new docusign.WorkflowManagementApi(this.dsApiClient);
    const workflow = await workflowManagementApi.createWorkflowDefinition({ workflowDefinition }, accountId);

    return workflow;
  };

  static createWorkflow = async ({ templateId, accessToken, basePath, accountId }) => {
    const wdefinition = require('../assets/templates/WORKFLOW_NDA.json');
    const workflowDefinition = wdefinition;

    this.dsApiClient.setBasePath(basePath);
    this.dsApiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

    const workflowManagementApi = new docusign.WorkflowManagementApi(this.dsApiClient);
    const workflow = await workflowManagementApi.createWorkflowDefinition(workflowDefinition, accountId);

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

    const triggerPayload = docusign.TriggerPayload.constructFromObject({
      // instanceName: args.instanceName,
      participant: {},
      // payload: {
      //   signerEmail: args.signerEmail,
      //   signerName: args.signerName,
      //   ccEmail: args.ccEmail,
      //   ccName: args.ccName,
      // },
      payload: {
        hrApproverName: 'test3',
        hrApproverEmail: 'test3@test3.com',
        employee_email: {
          value: 'sdgsdg',
        },
        employee_name: {
          value: 'sdgsdg',
        },
      },
      metadata: {},
    });

    return await workflowTriggerApi.triggerWorkflow(triggerPayload, args.accountId, { mtid, mtsec });
  };
}

module.exports = WorkflowsService;
