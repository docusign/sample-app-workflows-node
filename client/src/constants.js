export const ROUTE = {
  ROOT: '/',
  HOME: '/home',
  TRIGGER: '/trigger-workflow',
  MANAGE: '/manage-workflow',
  TRIGGERFORM: '/trigger-workflow/form',
};

export const LoginStatus = {
  ACG: 'Authorization Code Grant',
  JWT: 'JSON Web Token',
};

export const WorkflowItemsInteractionType = {
  TRIGGER: 'Trigger',
  MANAGE: 'Manage',
};

export const WorkflowStatus = {
  active: 'active',
  paused: 'paused',
};

export const WorkflowTriggerResponse = {
  TRIGGER_ISSUE: 'Incompatible workflow',
};

export const TemplateType = {
  I9: { name: 'Maestro: I-9', type: 'I-9 document' },
  OFFER: { name: 'Maestro: Offer Letter', type: 'Offer letter' },
  NDA: { name: 'Maestro: NDA', type: 'NDA document' },
};
