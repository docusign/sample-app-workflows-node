import { LOGIN_USER } from '../types';

export const authorizeUser = (authType, userName, userEmail) => ({
  type: LOGIN_USER,
  payload: {
    authType,
    userName,
    userEmail,
  },
});
