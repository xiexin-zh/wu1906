import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import get from 'lodash/get';
import { getToken } from '../session';
import { ResponseError, UnusualCodeError } from './FetchError';
import { JSON_CONTENT_TYPE } from './contentTypes';

type Url = string;

const instance = axios.create();

instance.defaults.timeout = 55000;
instance.defaults.withCredentials = true;
instance.defaults.validateStatus = null; // 為了在失敗時自定義 error 資訊

instance.interceptors.request.use(
  function(config = {}) {
    const token = getToken();
    const headers = (config.headers = {});
    return Object.assign({}, config, {
      headers: {
        'Content-Type': JSON_CONTENT_TYPE,
        ...headers,
        Authorization: token
          ? `${token.token_type} ${token.access_token}`
          : null,
      },
    });
  },
  function(error) {
    return Promise.reject(error);
  }
);

function checkCode(response: AxiosResponse): AxiosResponse {
  const code = get(response, 'data.code');
  if (code !== '200' && code !== 0) {
    throw new UnusualCodeError(response, code);
  }
  // if (code !== undefined && (code !== 0)) {
  //   throw new UnusualCodeError(response, code);
  // }
  return response;
}

function checkStatus(response: AxiosResponse): AxiosResponse {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw new ResponseError(response);
}

function parseJSON(response: AxiosResponse) {
  return response.data;
}

function request(url: Url, options: AxiosRequestConfig): Promise<any> {
  return instance(url, options)
    .then(checkStatus)
    .then(checkCode)
    .then(parseJSON);
}

request.applyInterceptors = (interceptors) => {
  interceptors.forEach(([success, failure]) =>
    instance.interceptors.request.use(success, failure)
  );
};

export default request;
