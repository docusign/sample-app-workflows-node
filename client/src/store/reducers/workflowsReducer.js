/**
 * The initial state object for the Redux store.
 * @type {InitialState}
 *
 * @typedef {Array<Object>} WorkflowDefinition
 * @property {string} id - The unique identifier for the workflow.
 * @property {string} name - The name of the workflow.
 * @property {string} type - The type of the workflow.
 * @property {string} definitionId - The definition ID of the workflow.
 * @property {string} instanceState - The state of the workflow instance.
 * @property {string|undefined} instanceId - The instance ID of the workflow, if any.
 * @property {boolean|undefined} isTriggered - Indicates if the workflow is triggered.
 */

const initialState = {
  lastCreatedWorkflow: {
    id: null,
    isPublished: false,
  },
  workflowDefinitions: [],
};

const workflowsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'CREATED_WORKFLOW':
      return {
        ...state,
        lastCreatedWorkflow: { id: payload.workflowDefinitionId, isPublished: false },
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

    case 'UPDATE_WORKFLOW_DEFINITIONS':
      return {
        ...state,
        workflowDefinitions: payload.workflowDefinitions,
      };

    case 'CANCEL_WORKFLOW':
      return {
        ...state,
        workflowDefinitions: state.workflows.map(item => (item.instanceId === payload.instanceId ? payload : item)),
      };

    case 'CLEAR_STATE':
      return { ...initialState };

    default:
      return state;
  }
};

export default workflowsReducer;
