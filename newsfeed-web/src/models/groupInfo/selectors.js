import { namespace } from './constants';
import { fromJS } from 'immutable';

export const getStore = (state) => state[namespace];

export const getAdminGroupList = (state) => {
  return state[namespace].get('groupMap').filter((group) => group.isGroupAdmin);
};

export const getMemberGroupList = (state) => {
  return state[namespace]
    .get('groupMap')
    .filter((group) => group.isOrdinaryMember);
};

export const getFollowGroupList = (state) => {
  return state[namespace]
    .get('groupMap')
    .filter((group) => group.isGroupFans && group.isPublic);
};

export const getOtherGroupList = (state) => {
  return state[namespace]
    .get('groupMap')
    .filter((group) => group.isUnrelatedGroup && group.isPublic);
};

export const getGroupDetail = (state, groupId) => {
  return state[namespace].getIn(['groupMap', groupId], fromJS({}));
};

export const getOwnGroup = (state) => {
  return state[namespace]
    .get('groupMap')
    .filter(
      (group) =>
        group.isOrdinaryMember ||
        group.isGroupAdmin ||
        (group.isGroupFans && group.isPublic)
    );
};

export const getGroupMap = (state) => {
  return state[namespace].get('groupMap');
};
