export const ROUTE = {
  ROOT: '/',
  HOME: '/home',
  TRIGGER: '/triggerWorkflow',
  MANAGE: '/manageWorkflow',
};

export const LoginStatus = {
  ACG: 'Authorization Code Grant',
  JWT: 'JSON Web Token',
};

export const WokrflowItemsInteractionType = {
  TRIGGER: "Trigger",
  MANAGE: "Manage"
}

export const WorkflowStatus = {
  Failed: "Failed",
  InProgress: "In-progress",
  Completed: "Completed",
};

export const WorkflowOptions = [
  { value: 'Create 1-9 document', route: '/createOneNineDocument', message: "You've successfully created a 1-9 document" },
  { value: 'Create offer letter', route: '/createOfferLetter', message: "You've successfully created Offer letter" },
  { value: 'Create NDA document', route: '/createNdaDocument', message: "You've successfully created NDA document" },
];

export const JWTWorkflowTypes = [
  { name: "WF name long name", type: "1-9 document", status: WorkflowStatus.InProgress },
  { name: "WF name long name", type: "Offer letter", status: WorkflowStatus.Failed },
  { name: "WF name long name", type: "NDA document", status: WorkflowStatus.Completed }
];