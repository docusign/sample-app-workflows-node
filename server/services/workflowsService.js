/**
 * @file
 * This file handles work with docusign maestro and esign services.
 * Scenarios implemented:
 * - Workflow definition triggering, which create workflow instance.
 * - Workflow definitions fetching.
 * - Workflow trigger requirements fetching.
 */

const iam = require('@docusign/iam-sdk');

class WorkflowsService {
  static getWorkflowDefinitions = async args => {
    const client = new iam.IamClient({ accessToken: args.accessToken });
    const definitions = await client.maestro.workflows.getWorkflowsList({ accountId: args.accountId });

    return definitions;
  };

  static getWorkflowTriggerRequirements = async args => {
    const client = new iam.IamClient({ accessToken: args.accessToken });
    const triggerRequirements = await client.maestro.workflows.getWorkflowTriggerRequirements({
      accountId: args.accountId,
      workflowId: args.workflowId,
    });

    return triggerRequirements;
  };

  static triggerWorkflowInstance = async (args, payload) => {
    const client = new iam.IamClient({ accessToken: args.accessToken });
    const triggerPayload = {
      instanceName: 'test',
      triggerInputs: payload,
    };
    const triggerResponse = await client.maestro.workflows.triggerWorkflow({
      accountId: args.accountId,
      workflowId: args.workflowId,
      triggerWorkflow: triggerPayload,
    });

    return triggerResponse;
  };
}

module.exports = WorkflowsService;
