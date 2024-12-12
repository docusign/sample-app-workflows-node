import { UPDATE_WORKFLOWS } from '../types';

export const updateWorkflowDefinitions = workflows => ({
  type: UPDATE_WORKFLOWS,
  payload: { workflows },
});
