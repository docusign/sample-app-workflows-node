export const ROUTE = {
  ROOT: '/',
  TRIGGER: '/trigger-workflow',
  TRIGGERFORM: '/trigger-workflow/form',
};

export const LoginStatus = {
  ACG: 'Authorization Code Grant',
  JWT: 'JSON Web Token',
};

export const WorkflowItemsInteractionType = {
  TRIGGER: 'Trigger',
};

export const WorkflowTriggerResponse = {
  TRIGGER_ISSUE: 'Incompatible workflow',
};

export const TemplateType = {
  I9: { name: 'Workflow Builder: I-9', type: 'I-9 document' },
  OFFER: { name: 'Workflow Builder: Offer Letter', type: 'Offer letter' },
  NDA: { name: 'Workflow Builder: NDA', type: 'NDA document' },
};
