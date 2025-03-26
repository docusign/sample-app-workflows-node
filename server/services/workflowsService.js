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

const { initMaestroApi } = require('../api');

class WorkflowsService {
  static getWorkflowDefinitions = async args => {
    const api = initMaestroApi(args.accountId, args.basePath, args.accessToken);
    const definitions = await api.getWorkflowDefinitions({});

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
      instance_name: '',
      trigger_inputs: payload,
    };
    const triggerResponse = await api.triggerWorkflow(triggerPayload, triggerRequirements.trigger_http_config.url);

    return triggerResponse;
  };
}

module.exports = WorkflowsService;
