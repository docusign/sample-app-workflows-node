const initialState = {
  workflows: [],
};

//TODO: Adjust reducer logic after working with workflows

const workflowsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_WORKFLOW':
      return {
        ...state,
        workflows: [...state.workflows, action.payload],
      };

    case 'CANCEL_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(
          item =>
            item.instanceId === action.payload.instanceId
              ? action.payload
              : item,
        ),
      };

    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(
          item =>
            item.instanceId === action.payload.instanceId
              ? action.payload
              : item,
        ),
      };

    case 'CLEAR_STATE':
      return { ...initialState };

    default:
      return state;
  }
};

export default workflowsReducer;
