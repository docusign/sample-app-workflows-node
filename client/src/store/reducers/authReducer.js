const initialState = {
  isAuthenticated: false,
  authType: null,
  userName: null,
  userEmail: null,
};

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        authType: payload.authType,
        userName: payload.userName,
        userEmail: payload.userEmail,
      };

    case 'CLEAR_STATE':
      return { ...initialState };

    default:
      return state;
  }
};

export default authReducer;
