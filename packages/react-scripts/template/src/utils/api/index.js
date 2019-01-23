import { normalize } from 'normalizr';
import Root from 'store/schemas/root';
import ClientError from 'errors/clientError';
import Hermes from '@wepow/hermes';

import parseHal from './hal';

// eslint-disable-next-line
const config = require(`../../../config/private/${process.env.NODE_ENV}.json`);

let requestOptions;

const defaultOptions = {
  withCredentials: true,
};
const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// TODO: Refactor to automatically load all schemas
export const schemas = {};
schemas[Root._key] = Root;
// ENDTODO

export const setupClient = ({ options = {}, headers = {} }) => {
  requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };
};

const getAPIUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return `${config.baseUrl}/api`;
  }
  const {
    location: { protocol, hostname },
  } = window;

  return `${protocol}//${hostname}/api`;
};

const initialize = ({ url }) => {
  let _url = url;

  if (_url === undefined) {
    _url = getAPIUrl();
  }

  return Hermes(_url, { requestOptions });
};

const client = ({ url }) => initialize({ url });

const parseMethod = ({ resource, relation }) => {
  let method;

  if (relation && relation._method) {
    method = relation._method;
  } else {
    const allow = ((resource && relation.allow) || 'GET').split(' ');

    if (allow.length > 1) {
      const message = `Must specify method for ${relation}, options are: ${allow}`;
      throw new ClientError(message);
    }

    [method] = allow;
  }

  return method.toLowerCase();
};

const processRequest = ({
  resource,
  relation,
  data = {},
  options = {},
} = {}) => {
  const _method = parseMethod({ resource, relation });
  const url = resource ? relation.href : undefined;

  return client({ url })[_method]({ ...options, data });
};

export const resolve = async params => {
  const response = await processRequest(params);

  if (response.body) {
    const body = parseHal(response.body);
    return schemas[body._type] ? normalize(body, schemas[body._type]) : body;
  }

  return undefined;
};
