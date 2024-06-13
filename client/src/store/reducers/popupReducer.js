const initialState = {
  isOpened: false,
  isLoading: false,
  errorMessage: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'OPEN':
      return {
        ...state,
        isOpened: true,
      };

    case 'CLOSE':
      return {
        ...state,
        isOpened: false,
      };

    case 'LOADING':
      return {
        ...state,
        isLoading: true,
      };

    case 'LOADED':
      return {
        ...state,
        isLoading: false,
      };

    case 'ERROR':
      return {
        ...state,
        isOpened: true,
        errorMessage: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
