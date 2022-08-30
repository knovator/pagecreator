import fetchUrl, { setAPIConfig } from '@knovator/api';
import apiList from './list';
import { ACTION_TYPES, API_TYPE, BaseAPIProps, Routes_Input } from '../types';

const handleError = (error: Error) => {
  console.log(error);
};

const commonApi = async ({
  data,
  config,

  baseUrl,
  token,

  url,
  method,

  onError = handleError,
}: BaseAPIProps) => {
  let apiToken = token;
  if (typeof token === 'function') {
    apiToken = await token();
  }
  setAPIConfig({
    baseUrl,
    tokenPrefix: 'jwt',
    getToken: apiToken,
    onError,
  });
  return fetchUrl({
    type: method,
    url,
    data,
    config,
  });
};

const getApiType = ({
  routes,
  action,
  prefix,
  id,
}: {
  routes?: Routes_Input;
  action: ACTION_TYPES;
  prefix: string;
  id?: string;
}): API_TYPE => {
  let route: API_TYPE;
  if (routes && typeof routes[action] === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    route = routes[action]!({ prefix, id });
  } else {
    route = apiList[action]({ prefix, id });
  }
  return route;
};

export default commonApi;
export { getApiType };
