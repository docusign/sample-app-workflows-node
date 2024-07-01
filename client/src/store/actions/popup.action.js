import { CLOSE_POPUP, LOADED_POPUP, LOADING_POPUP, OPEN_POPUP, SET_ERROR_POPUP, CLEAR_ERROR_POPUP } from '../types';

export const openPopupWindow = () => ({
  type: OPEN_POPUP,
});

export const closePopupWindow = () => ({
  type: CLOSE_POPUP,
});

export const openLoadingCircleInPopup = () => ({
  type: LOADING_POPUP,
});

export const closeLoadingCircleInPopup = () => ({
  type: LOADED_POPUP,
});

export const showErrorTextInPopup = (errorHeader, errorMessage, templateName) => ({
  type: SET_ERROR_POPUP,
  payload: {
    errorHeader,
    errorMessage,
    templateName,
  },
});

export const clearErrorTextInPopup = () => ({
  type: CLEAR_ERROR_POPUP,
});
