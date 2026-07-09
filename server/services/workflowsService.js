/**
 * @file
 * This file handles work with docusign workflow builder and esign services.
 * Scenarios implemented:
 * - Workflow definition triggering, which create workflow instance.
 * - Workflow definitions fetching.
 * - Workflow trigger requirements fetching.
 */

const iam = require('@docusign/iam-sdk');

class WorkflowsService {
  static getWorkflowDefinitions = async args => {
    const client = new iam.IamClient({ accessToken: args.accessToken });
    const definitions = await client.workflowBuilder.workflows.getWorkflowsList({ accountId: args.accountId });

    return definitions;
  };

  static getWorkflowTriggerRequirements = async args => {
    const client = new iam.IamClient({ accessToken: args.accessToken });
    const triggerRequirements = await client.workflowBuilder.workflows.getWorkflowTriggerRequirements({
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
    const triggerResponse = await client.workflowBuilder.workflows.triggerWorkflow({
      accountId: args.accountId,
      workflowId: args.workflowId,
      triggerWorkflow: triggerPayload,
    });

    return triggerResponse;
  };

  static pauseWorkflow = async args => {
    const client = new iam.IamClient({ accessToken: args.accessToken });

    return await client.workflowBuilder.workflows.pauseNewWorkflowInstances({
      accountId: args.accountId,
      workflowId: args.workflowId,
    });
  };

  static resumePausedWorkflow = async args => {
    const client = new iam.IamClient({ accessToken: args.accessToken });

    return await client.workflowBuilder.workflows.resumePausedWorkflow({
      accountId: args.accountId,
      workflowId: args.workflowId,
    });
  };

  static getInstances = async args => {
    const client = new iam.IamClient({ accessToken: args.accessToken });

    return await client.workflowBuilder.workflowInstanceManagement.getWorkflowInstancesList({
      accountId: args.accountId,
      workflowId: args.workflowId,
    });
  };

  static cancelWorkflow = async args => {
    const client = new iam.IamClient({ accessToken: args.accessToken });

    return await client.workflowBuilder.workflowInstanceManagement.cancelWorkflowInstance({
      accountId: args.accountId,
      workflowId: args.workflowId,
      instanceId: args.instanceId,
    });
  };
}

module.exports = WorkflowsService;
