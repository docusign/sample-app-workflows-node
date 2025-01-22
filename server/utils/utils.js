const querystring = require('querystring');

const getParameterValueFromUrl = (urlString, paramName) => {
  const parsedUrl = new URL(urlString);
  const queryParams = querystring.parse(parsedUrl.search.slice(1));

  return queryParams[paramName];
};

const extractPortFromUrl = url => {
  const regex = /https?:\/\/[^:]+:(\d+)/;
  const match = url.match(regex);

  if (match) return Number(match[1]);
  return null;
};

const getPayloadBySchema = (data, schema) => {
  return schema.reduce((acc, field) => {
    const fieldName = field.field_name;
    if (fieldName in data) {
      acc[fieldName] = data[fieldName];
    }
    return acc;
  }, {});
};

module.exports = { getParameterValueFromUrl, extractPortFromUrl, getPayloadBySchema };
