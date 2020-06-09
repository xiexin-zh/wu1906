import { namespace } from './constants';

export const setOwnId = (userId) => {
  return {
    type: `${namespace}/setOwnId`,
    payload: userId,
  };
};

export const getFansAndFollow = (userId) => {
  return {
    type: `${namespace}/getFansAndFollow`,
    payload: userId,
  };
};

export const addFans = (userId) => {
  return {
    type: `${namespace}/addFans`,
    payload: userId,
  };
};

export const reduceFans = (userId) => {
  return {
    type: `${namespace}/reduceFans`,
    payload: userId,
  };
};

export const reduceFollowGroup = (userId) => {
  return {
    type: `${namespace}/reduceFollowGroup`,
    payload: userId,
  };
};

export const addFollowGroup = (userId) => {
  return {
    type: `${namespace}/addFollowGroup`,
    payload: userId,
  };
};

export const getUserData = (userId) => {
  return {
    type: `${namespace}/getUserData`,
    payload: { userId },
  };
};

export const followUser = (followUserId, follow) => {
  return {
    type: `${namespace}/followUser`,
    payload: {
      followUserId,
      follow,
    },
  };
};

export const editUser = (fileObj, description) => {
  return {
    type: `${namespace}/editUser`,
    payload: {
      fileObj,
      description,
    },
  };
};

export const setAvatar = (fileObj) => {
  return {
    type: `${namespace}/setAvatar`,
    payload: {
      fileObj,
    },
  };
};
