const initialState = {
  isAuthenticated: false,
  authType: null,
  userName: null,
  userEmail: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        authType: action.authType,
        userName: action.userName,
        userEmail: action.userEmail,
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        authType: null,
        userName: null,
        userEmail: null,
      };

    default:
      return state;
  }
};

export default authReducer;
