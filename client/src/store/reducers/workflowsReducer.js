const initialState = {
  workflows: [],
  workflowDefinitions: [],
  lastCreatedWorkflowId: null,
  lastCreatedWorkflowPublished: false,
};

const workflowsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'ADD_WORKFLOW':
      return {
        ...state,
        workflows: [...state.workflows, payload],
        lastCreatedWorkflowId: payload.workflowDefinitionId,
      };

    case 'CANCEL_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(item => (item.instanceId === payload.instanceId ? payload : item)),
      };

    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: payload.workflows
          ? state.workflows.map(item => (item.instanceId === payload.instanceId ? payload : item))
          : state.workflows,
        workflowDefinitions: payload.workflowDefinitions ?? state.workflowDefinitions,
        lastCreatedWorkflowId: payload.lastCreatedWorkflowId ?? state.lastCreatedWorkflowId,
        lastCreatedWorkflowPublished: payload.lastCreatedWorkflowPublished ?? state.lastCreatedWorkflowPublished,
      };

    case 'CLEAR_WORKFLOW':
      return { ...initialState };

    case 'CLEAR_STATE':
      return { ...initialState };

    default:
      return state;
  }
};

export default workflowsReducer;
