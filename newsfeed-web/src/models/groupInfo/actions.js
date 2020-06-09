import { namespace } from './constants';

export const getAllGroups = () => {
  return {
    type: `${namespace}/getAllGroups`,
    payload: {},
  };
};

export const getGroupDetails = (groupId, invite, noticeId) => {
  return {
    type: `${namespace}/getGroupDetails`,
    payload: {
      groupId,
      invite,
      noticeId,
    },
  };
};
export const setCurrentGroup = (groupId) => {
  return {
    type: `${namespace}/setCurrentGroup`,
    payload: groupId,
  };
};

export const closeCurrentGroup = () => {
  return {
    type: `${namespace}/initialization`,
    payload: {},
  };
};

export const getGroupMembers = (groupId) => {
  return {
    type: `${namespace}/getGroupMembers`,
    payload: { groupId, members: [] },
  };
};

export const followGroup = (groupId, follow, isNoticeInfo) => {
  return {
    type: `${namespace}/followGroup`,
    payload: {
      groupId,
      follow,
      isNoticeInfo,
    },
  };
};
/**
 *
 * @param {string} groupId  退出群组
 */
export const leaveGroup = (groupId) => {
  return {
    type: `${namespace}/leaveGroup`,
    payload: {
      groupId,
    },
  };
};

export const joinGroup = (groupId) => {
  return {
    type: `${namespace}/joinGroup`,
    payload: {
      groupId,
    },
  };
};

export const noAcceptGroupInvite = (groupId) => {
  return {
    type: `${namespace}/noAcceptGroupInvite`,
    payload: {
      groupId,
    },
  };
};

export const inviteUsers = (groupId, memberIds) => {
  return {
    type: `${namespace}/inviteUsers`,
    payload: {
      groupId,
      memberIds,
    },
  };
};

export const getGroupAdmin = ({ groupId }) => {
  return {
    type: `${namespace}/getGroupAdmin`,
    payload: {
      groupId,
    },
  };
};

export const setGroupAdmin = ({ groupId, adminUserId, editGroup, post }) => {
  return {
    type: `${namespace}/setGroupAdmin`,
    payload: {
      groupId,
      adminUserId,
      editGroup,
      post,
    },
  };
};
