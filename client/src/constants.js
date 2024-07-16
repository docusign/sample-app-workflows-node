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
  Failed: 'Failed',
  InProgress: 'In Progress',
  Completed: 'Completed',
  NotRun: 'Not Run',
};

export const TemplateType = {
  I9: { name: 'MyMaestro: I-9', type: 'I-9 document' },
  OFFER: { name: 'MyMaestro: Offer Letter', type: 'Offer letter' },
  NDA: { name: 'MyMaestro: NDA', type: 'NDA document' },
};

export const WorkflowOptions = [
  {
    value: `Create ${TemplateType.I9.type}`,
    type: TemplateType.I9.type,
    message: "You've successfully created an I-9 workflow",
  },
  {
    value: `Create ${TemplateType.OFFER.type}`,
    type: TemplateType.OFFER.type,
    message: "You've successfully created Offer letter workflow",
  },
  {
    value: `Create ${TemplateType.NDA.type}`,
    type: TemplateType.NDA.type,
    message: "You've successfully created NDA workflow",
  },
];
