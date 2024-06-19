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

export const TEMPLATE_TYPE = {
  I9: '1-9 document',
  OFFER: 'Offer letter',
  NDA: 'NDA document',
};

export const WorkflowOptions = [
  {
    value: `Create ${TEMPLATE_TYPE.I9}`,
    type: TEMPLATE_TYPE.I9,
    message: "You've successfully created a 1-9 workflow",
  },
  {
    value: `Create ${TEMPLATE_TYPE.OFFER}`,
    type: TEMPLATE_TYPE.OFFER,
    message: "You've successfully created Offer letter workflow",
  },
  {
    value: `Create ${TEMPLATE_TYPE.NDA}`,
    type: TEMPLATE_TYPE.NDA,
    message: "You've successfully created NDA workflow",
  },
];

export const JWTWorkflowTypes = [
  { name: 'WF name long name', type: TEMPLATE_TYPE.I9, status: WorkflowStatus.InProgress },
  { name: 'WF name long name', type: TEMPLATE_TYPE.OFFER, status: WorkflowStatus.Failed },
  { name: 'WF name long name', type: TEMPLATE_TYPE.NDA, status: WorkflowStatus.Completed },
];
