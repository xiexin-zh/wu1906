import { namespace } from './constants';
import { getFollowGroupList } from '../groupInfo/selectors';
import { Set } from 'immutable';

export const getStore = (state) => state[namespace];
export const getUserDataFromStore = (state, userId) => {
  const ownId = state[namespace].get('ownId');
  if (userId === ownId || !userId) {
    return state[namespace].get('ownInfo');
  } else {
    return state[namespace].getIn(['userMap', userId]);
  }
};

export const getFansListFromStore = (state, userId) => {
  const ownId = state[namespace].get('ownId');
  if (userId === ownId) {
    return state[namespace].get('ownFansList');
  } else {
    return state[namespace].getIn(['userFansMap', userId], Set([]));
  }
};

export const getFollowListFromStore = (state, userId) => {
  const ownId = state[namespace].get('ownId');
  if (userId === ownId) {
    return state[namespace].get('ownFollowUserList');
  } else {
    return state[namespace].getIn(['userFollowUserMap', userId], Set([]));
  }
};

export const getFollowGroupFromStore = (state, userId) => {
  const ownId = state[namespace].get('ownId');
  if (userId === ownId) {
    return Set.fromKeys(getFollowGroupList(state));
  } else {
    return state[namespace].getIn(['userFollowGroupMap', userId], Set([]));
  }
};
