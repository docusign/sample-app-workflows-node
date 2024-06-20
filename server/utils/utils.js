const querystring = require('querystring');

const getParameterValueFromUrl = (urlString, paramName) => {
  const parsedUrl = new URL(urlString);
  const queryParams = querystring.parse(parsedUrl.search.slice(1));

  return queryParams[paramName];
};

module.exports = { getParameterValueFromUrl };
