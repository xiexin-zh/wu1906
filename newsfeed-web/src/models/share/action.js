const namespace = 'share';

//判断群组是否关闭
export const checkGroup = ({ groupId, userId, checkUserId }) => {
  return {
    type: `${namespace}/checkGroup`,
    payload: {
      groupId,
      userId,
      checkUserId,
    },
  };
};

//获取一级表情点赞用户列表
export const getEmojiLikeList = ({ iconType, targetId, type, page, rows }) => {
  return {
    type: `${namespace}/getEmojiLikeList`,
    payload: {
      iconType,
      targetId,
      type,
      page,
      rows,
    },
  };
};
