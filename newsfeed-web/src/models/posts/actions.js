import { namespace } from './constants';

export const openCreatePostDialog = () => {
  return {
    type: `${namespace}/setCreatePostDialog`,
    payload: true,
  };
};

export const closeCreatePostDialog = () => {
  return {
    type: `${namespace}/setCreatePostDialog`,
    payload: false,
  };
};

export const createPost = (payload) => {
  const {
    groupId,
    type,
    openComment = true,
    content,
    groupPostType,
    files,
    mentionUsers,
    referId,
    isPublic,
    userPostType,
    leaveMessageUserId,
  } = payload;
  return {
    type: `${namespace}/createPost`,
    payload: {
      groupId,
      type,
      openComment,
      content,
      groupPostType,
      files,
      referId,
      isPublic,
      mentionedUsersId: mentionUsers, // FIXME: 介面參數不統一
      userPostType,
      leaveMessageUserId,
    },
  };
};

export const editPost = (payload) => {
  const { postId, isPublic, content, mentionUsers, files } = payload;
  return {
    type: `${namespace}/editPost`,
    payload: {
      postId,
      isPublic,
      mentionUsers,
      content,
      files,
    },
  };
};

export const getAllPost = ({ type, groupId, postList, userId }) => {
  return {
    type: `${namespace}/getPost`,
    payload: {
      type,
      groupId,
      postList,
      userId,
    },
  };
};

export const deletePost = (postId, type = 'post') => {
  return {
    type: `${namespace}/deletePost`,
    payload: { postId, type },
  };
};

export const deleteComment = ({ userId, commentId }) => {
  return {
    type: `${namespace}/deleteComment`,
    payload: { userId, commentId },
  };
};

export const getConnectList = (payload) => {
  return {
    type: `${namespace}/getConnectList`,
    payload: {
      ...payload,
    },
  };
};

export const sharePost = (payload) => {
  const {
    groupId,
    type,
    openComment = true,
    content,
    groupPostType,
    files,
    mentionUsers,
    referId,
    isPublic,
    isInvitePage,
    urlname,
  } = payload;
  return {
    type: `${namespace}/sharePost`,
    payload: {
      groupId,
      type,
      openComment,
      content,
      groupPostType,
      files,
      referId,
      isPublic,
      mentionedUsersId: mentionUsers,
      isInvitePage,
      urlname,
    },
  };
};

export const refreshPost = ({ type, groupId, userId }) => {
  return {
    type: `${namespace}/refreshPost`,
    payload: {
      type,
      groupId,
      userId,
    },
  };
};
