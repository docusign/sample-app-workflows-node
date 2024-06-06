const initialState = {
  isAuthenticated: false,
  token: null,
  authType: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload,
        authType: action.authType,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        authType: null,
      };
    default:
      return state;
  }
};

export default authReducer;
