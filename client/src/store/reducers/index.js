import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './auth.reducer';
import { popupReducer } from './popup.reducer';
import { workflowsReducer } from './workflows.reducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  workflows: workflowsReducer,
  popup: popupReducer,
});

export const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['popup'],
};
