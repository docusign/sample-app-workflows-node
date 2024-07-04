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
  I9: '1-9 document',
  OFFER: 'Offer letter',
  NDA: 'NDA document',

  I92: 'MyMaestro: I-9',
  OFFER2: 'MyMaestro: Offer Letter',
  NDA2: 'MyMaestro: NDA',
};

export const WorkflowOptions = [
  {
    value: `Create ${TemplateType.I9}`,
    type: TemplateType.I9,
    message: "You've successfully created a 1-9 workflow",
  },
  {
    value: `Create ${TemplateType.OFFER}`,
    type: TemplateType.OFFER,
    message: "You've successfully created Offer letter workflow",
  },
  {
    value: `Create ${TemplateType.NDA}`,
    type: TemplateType.NDA,
    message: "You've successfully created NDA workflow",
  },
];
