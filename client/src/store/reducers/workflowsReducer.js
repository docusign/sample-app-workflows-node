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
 * @property {boolean|undefined} isTriggered - Indicates if the workflow is triggered.
 *
 * Workflow, workflowDefinition - this is the same
 */

const initialState = {
  workflows: [],
  lastCreatedWorkflow: {
    id: null,
    isPublished: false,
  },
};

const workflowsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'CREATED_WORKFLOW':
      return {
        ...state,
        lastCreatedWorkflow: { id: payload.workflowId, isPublished: false },
      };

    case 'PUBLISHED_LAST_WORKFLOW':
      return {
        ...state,
        lastCreatedWorkflow: { ...state.lastCreatedWorkflow, isPublished: true },
      };

    case 'CLEAR_CREATED_WORKFLOW':
      return {
        ...state,
        lastCreatedWorkflow: initialState.lastCreatedWorkflow,
      };

    case 'UPDATE_WORKFLOWS':
      return {
        ...state,
        workflows: payload.workflows,
      };

    case 'CANCEL_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(workflow => {
          if (workflow.id === payload.workflowId) return { ...workflow, isTriggered: false, instanceId: undefined };
          return { ...workflow };
        }),
      };

    case 'CLEAR_STATE':
      return { ...initialState };

    default:
      return state;
  }
};

export default workflowsReducer;
