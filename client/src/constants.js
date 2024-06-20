export const ROUTE = {
  ROOT: '/',
  HOME: '/home',
  TRIGGER: '/trigger-workflow',
  MANAGE: '/manage-workflow',
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
  InProgress: 'In-progress',
  Completed: 'Completed',
};

export const TemplateType = {
  I9: '1-9 document',
  OFFER: 'Offer letter',
  NDA: 'NDA document',
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
