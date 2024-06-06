export const ROUTE = {
  ROOT: '/',
  HOME: '/home',
};

export const LoginStatus = {
  ACG: 'Authorization Code Grant',
  JWT: 'JSON Web Token',
};


export const WorkflowOptions = [
  { value: 'Create 1-9 document', route: '/createOneNineDocument', message: "You've successfully created a 1-9 document" },
  { value: 'Create offer letter', route: '/createOfferLetter', message: "You've successfully created Offer letter" },
  { value: 'Create NDA document', route: '/createNdaDocument', message: "You've successfully created NDA document" },
];