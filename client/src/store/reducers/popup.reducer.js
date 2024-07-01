/**
 * The initial state object for the Redux store.
 * @type {InitialState}
 *
 * @typedef {Object} InitialState
 * @property {boolean} isOpened - Indicates if the popup is opened.
 * @property {boolean} isLoading - Indicates if the popup is loading and shows the loading circle.
 * @property {string|null} errorHeader - Error header if any, otherwise null.
 * @property {string|null} errorMessage - Error message if any, otherwise null.
 * @property {string|null} templateName - The name of the template, if any, otherwise null.
 */

import {
  OPEN_POPUP,
  CLOSE_POPUP,
  LOADING_POPUP,
  LOADED_POPUP,
  SET_ERROR_POPUP,
  CLEAR_ERROR_POPUP,
  CLEAR_STATE,
} from '../types';

const initialState = {
  isOpened: false,
  isLoading: false,
  errorHeader: null,
  errorMessage: null,
  templateName: null,
};

export const popupReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case OPEN_POPUP:
      return { ...state, isOpened: true };

    case CLOSE_POPUP:
      return { ...state, isOpened: false };

    case LOADING_POPUP:
      return { ...state, isLoading: true };

    case LOADED_POPUP:
      return { ...state, isLoading: false };

    case SET_ERROR_POPUP:
      return {
        ...state,
        isOpened: true,
        errorHeader: payload.errorHeader,
        errorMessage: payload.errorMessage,
        templateName: payload.templateName,
      };

    case CLEAR_ERROR_POPUP:
      return { ...state, errorMessage: null, errorHeader: null, templateName: null };

    case CLEAR_STATE:
      return { ...initialState };

    default:
      return state;
  }
};
