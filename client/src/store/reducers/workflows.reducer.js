/**
 * The initial state object for the Redux store.
 * @type {InitialState}
 *
 * @typedef {Array<Object>} WorkflowDefinition
 * @property {string} id - The unique identifier for the workflow definition.
 * @property {string} name - The name of the workflow.
 * @property {string} type - The type of the workflow.
 * @property {string} instanceState - The state of the workflow instance.
 * @property {string|undefined} instanceId - The instance ID of the workflow, if any.
 * @property {boolean|undefined} isTriggered - Indicates if the workflow was triggered.
 * @property {boolean|undefined} isCancelled - Indicates if the workflow was cancelled.
 *
 * Workflow, workflowDefinition - this is the same
 */

import { UPDATE_WORKFLOWS, CLEAR_STATE } from '../types';

const initialState = {
  workflows: [],
  lastCreatedWorkflow: {
    id: null,
    isPublished: false,
  },
};

export const workflowsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_WORKFLOWS:
      return {
        ...state,
        workflows: payload.workflows,
      };

    case CLEAR_STATE:
      return { ...initialState, workflows: [] };

    default:
      return state;
  }
};
