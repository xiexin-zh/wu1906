import { namespace } from './constants';

export const kickWebUser = (data) => {
  return {
    type: `${namespace}/kickWebUser`,
    payload: data.message,
  };
};

export const kickoutDevices = (data) => {
  return {
    type: `${namespace}/kickoutDevices`,
    payload: data,
  };
};
