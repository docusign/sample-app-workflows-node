const BACKEND_ROUTE = {
  AUTH: '/api/auth',
  WORKFLOWS: '/api/workflows',
};

const METHOD = {
  JWT: 'jwt-auth',
  ACG: 'grand-auth',
};

const TEMPLATE_TYPE = {
  I9: '1-9 document',
  NDA: 'Offer letter',
  OFFER: 'NDA document',
};

const MAESTRO_SCOPES = ['signature', 'aow_manage', 'impersonation'];
const WEBFORMS_SCOPES = ['webforms_read', 'webforms_instance_read', 'webforms_instance_write'];

const scopes = [...MAESTRO_SCOPES, ...WEBFORMS_SCOPES];

module.exports = {
  scopes,
  BACKEND_ROUTE,
  METHOD,
  TEMPLATE_TYPE,
};
