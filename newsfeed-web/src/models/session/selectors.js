import { namespace } from './constants';

export const getStore = (state) => state[namespace];
export const getCurrentUserId = (state) =>
  state[namespace].getIn(['user', 'id']);

export const getSystemConfig = (state) => state[namespace].get('config');

export const getCommentMaxLenght = (state) =>
  state[namespace].getIn(['config', 'commentLength']);
