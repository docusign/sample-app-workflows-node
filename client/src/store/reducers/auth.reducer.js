/**
 * The initial state object for the Redux store related to authentication.
 * @type {InitialState}
 *
 * @typedef {Object} InitialState
 * @property {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @property {string|null} authType - The type of authentication (e.g., 'ACG', 'JWT'), if any, otherwise null.
 * @property {string|null} userName - The name of the authenticated user, if any, otherwise null.
 * @property {string|null} userEmail - The email of the authenticated user, if any, otherwise null.
 */

import { LOGIN_USER, CLEAR_STATE } from '../types';

const initialState = {
  isAuthenticated: false,
  authType: null,
  userName: null,
  userEmail: null,
};

export const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN_USER:
      return {
        ...state,
        isAuthenticated: true,
        authType: payload.authType,
        userName: payload.userName,
        userEmail: payload.userEmail,
      };

    case CLEAR_STATE:
      return { ...initialState };

    default:
      return state;
  }
};
