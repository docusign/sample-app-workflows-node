const initialState = {
  isOpened: false,
  isLoading: false,
  errorMessage: null,
  templateName: null,
};

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'OPEN':
      return { ...state, isOpened: true };

    case 'CLOSE':
      return { ...state, isOpened: false };

    case 'LOADING':
      return { ...state, isLoading: true };

    case 'LOADED':
      return { ...state, isLoading: false };

    case 'ERROR':
      return {
        ...state,
        isOpened: true,
        errorMessage: payload.errorMessage,
        templateName: payload.templateName,
      };

    case 'CLEAR_ERROR':
      return { ...state, errorMessage: null, templateName: null };

    case 'CLEAR_STATE':
      return { ...initialState };

    default:
      return state;
  }
};

export default authReducer;
