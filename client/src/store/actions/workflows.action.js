import {
  CANCEL_WORKFLOW,
  CLEAR_CREATED_WORKFLOW,
  CREATED_WORKFLOW,
  PUBLISHED_LAST_WORKFLOW,
  UPDATE_WORKFLOWS,
} from '../types';

export const saveCreatedWorkflow = workflowId => ({
  type: CREATED_WORKFLOW,
  payload: { workflowId },
});

export const publishCreatedWorkflow = () => ({
  type: PUBLISHED_LAST_WORKFLOW,
});

export const clearCreatedWorkflowFromState = () => ({
  type: CLEAR_CREATED_WORKFLOW,
});

export const updateWorkflowDefinitions = workflows => ({
  type: UPDATE_WORKFLOWS,
  payload: { workflows },
});

export const cancelTriggeredWorkflow = workflowId => ({
  type: CANCEL_WORKFLOW,
  payload: { workflowId },
});
