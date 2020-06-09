const namespace = 'userInfo';

export const getFansAndFollowData = (userId) => {
  return {
    type: `${namespace}/getFansAndFollow`,
    payload: userId,
  };
};

export const followGroup = (groupId, follow) => {
  return {
    type: `${namespace}/followGroup`,
    payload: {
      groupId,
      follow,
    },
  };
};

export const changePostLike = ({ id, like, type, iconType }) => {
  return {
    type: `${namespace}/postChangeLike`,
    payload: { id, like, type, iconType },
  };
};

export const editPostComment = ({ commentId, type, targetId, content }) => {
  return {
    type: `${namespace}/editPostComment`,
    payload: { commentId, type, targetId, content },
  };
};
