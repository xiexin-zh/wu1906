import { isObject, setCookie } from './utils';

interface TokenInfo {
  access_token: string;
  refresh_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
}

const APP_KEY = btoa('sunpeople');

export function getToken(): TokenInfo | null {
  try {
    const tokenBase64 = localStorage.getItem(APP_KEY);
    if (!tokenBase64) {
      return null;
    }
    const jsonStr = decodeURIComponent(atob(tokenBase64));
    const token = JSON.parse(jsonStr);
    if (!isObject(token)) {
      return null;
    }
    const { access_token, refresh_token } = token;
    if (!access_token && !refresh_token) {
      return null;
    }
    return token;
  } catch (e) {
    console.warn(e);
    return null;
  }
}

export function setToken(data) {
  if (!isObject(data)) {
    console.warn('token data error:', data);
    return;
  }
  const jsonStr = JSON.stringify(data);
  setCookie('cityfruit', data.access_token, 5);
  localStorage.setItem(APP_KEY, btoa(encodeURIComponent(jsonStr)));
}

export const loginState = {
  LOGIN: 'login',
  LOGIN_PENDING: 'loginPending',
  LOGIN_SUCCESS: 'loginSuccess',
  LOGIN_FAILURE: 'loginFailure',
};
