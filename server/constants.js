const BACKEND_ROUTE = {
  AUTH: '/api/auth',
  WORKFLOWS: '/api/workflows',
};

const TEMPLATE_TYPE = {
  I9: 'I-9 document',
  OFFER: 'Offer letter',
  NDA: 'NDA document',
};

const METHOD = {
  JWT: 'jwt-auth',
  ACG: 'grand-auth',
};

const ISSUES = {
  TRIGGER_ISSUE: 'Incompatible workflow',
};

const MAESTRO_SCOPES = ['signature', 'aow_manage'];

module.exports = {
  scopes: MAESTRO_SCOPES,
  BACKEND_ROUTE,
  TEMPLATE_TYPE,
  METHOD,
  ISSUES,
};
