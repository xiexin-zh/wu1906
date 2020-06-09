import { namespace } from './constants';

export const getStore = (state) => state[namespace];
export const getLoadingStatus = (state) =>
  state[namespace].get('membersLoading');

export const getMember = (state, userId) => {
  return state[namespace].getIn(['memberMap', userId]);
};

export const getUserAvatar = (state, userId) => {
  return state.members.getIn(['memberMap', userId, 'avatarUrl']);
};

export const getUserDetail = (state, userId) => {
  return state.members.getIn(['memberMap', userId]);
};
