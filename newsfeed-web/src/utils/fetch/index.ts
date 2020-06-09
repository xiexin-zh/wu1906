import { AxiosRequestConfig } from 'axios';
import request from './request';

export function get(url: string, reqOptions: AxiosRequestConfig) {
  let options = {
    headers: {},
    ...reqOptions,
  };
  options.headers = {
    // FIX: prevent an Ajax GET request from caching in Internet Explorer
    'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    ...options.headers,
  };
  return request(url, options);
}

export function post(url: string, reqOptions: AxiosRequestConfig) {
  return request(url, {
    method: 'POST',
    ...reqOptions,
  });
}

// "delete" is a reserved word in JS so the function name is del.
export function del(url: string, reqOptions: AxiosRequestConfig) {
  return request(url, {
    method: 'DELETE',
    ...reqOptions,
  });
}

export function put(url: string, reqOptions: AxiosRequestConfig) {
  return request(url, {
    method: 'PUT',
    ...reqOptions,
  });
}

export function patch(url: string, reqOptions: AxiosRequestConfig) {
  return request(url, {
    method: 'PATCH',
    ...reqOptions,
  });
}

export async function getFileBlobUrl(
  url: string,
  reqOptions: AxiosRequestConfig
) {
  const blobData = await request(url, {
    method: 'get',
    responseType: 'blob',
    withCredentials: false,
    ...reqOptions,
  });
  const blobUrl = URL.createObjectURL(blobData);
  return blobUrl;
}

export default request;
