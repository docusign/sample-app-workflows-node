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
      instance_name: 'test',
      trigger_inputs: payload,
    };
    const triggerResponse = await client.maestro.workflows.triggerWorkflow({
      accountId: args.accountId,
      workflowId: args.workflowId,
      triggerWorkflow: triggerPayload,
    });

    return triggerResponse;
  };

  static pauseWorkflow = async args => {
    const client = new iam.IamClient({ accessToken: args.accessToken });

    return await client.maestro.workflows.pauseNewWorkflowInstances({
      accountId: args.accountId,
      workflowId: args.workflowId,
    });
  };

  static resumePausedWorkflow = async args => {
    const client = new iam.IamClient({ accessToken: args.accessToken });

    return await client.maestro.workflows.resumePausedWorkflow({
      accountId: args.accountId,
      workflowId: args.workflowId,
    });
  };

  static getInstances = async args => {
    const client = new iam.IamClient({ accessToken: args.accessToken });

    return await client.maestro.workflowInstanceManagement.getWorkflowInstancesList({
      accountId: args.accountId,
      workflowId: args.workflowId,
    });
  };

  static cancelWorkflow = async args => {
    const client = new iam.IamClient({ accessToken: args.accessToken });

    return await client.maestro.workflowInstanceManagement.cancelWorkflowInstance({
      accountId: args.accountId,
      workflowId: args.workflowId,
      instanceId: args.instanceId,
    });
  };
}

module.exports = WorkflowsService;
