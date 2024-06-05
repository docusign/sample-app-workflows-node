export const ROUTE = {
  ROOT: '/',
  HOME: '/home',
};

export const LoginStatus = {
  ACG: 'Authorization Code Grant',
  JWT: 'JSON Web Token',
};


export const WorkflowOptions = [
  { value: "Create 1-9 document", route: "/createOneNineDocument" },

  { value: "Create offer letter", route: "/createOfferLetter" },

  { value: "Create NDA document", route: "/createNdaDocument" }
];