import { namespace } from './constants';

export const initDialogs = () => {
  return {
    type: `${namespace}/initDialogs`,
    payload: {},
  };
};
