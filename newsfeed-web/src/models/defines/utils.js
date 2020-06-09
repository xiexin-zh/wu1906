import isString from 'lodash/isString';

export const toString = (str) => {
  return isString(str) ? str : '';
};
