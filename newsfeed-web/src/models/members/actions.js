import { namespace } from './constants';

export const checkForUpdates = (userId) => {
  return {
    type: `${namespace}/checkForUpdates`,
  };
};

export const updateMemberAvatar = (userId, avatarUrl) => {
  return {
    type: `${namespace}/updateMemberAvatar`,
    payload: {
      userId,
      avatarUrl,
    },
  };
};

export const updateSelf = (userData) => {
  const { id, avatar_url } = userData;
  return {
    type: `${namespace}/updateMemberAvatar`,
    payload: {
      userId: id,
      avatarUrl: avatar_url,
    },
  };
};
