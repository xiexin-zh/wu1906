import {
  // get,
  post,
  //  getFileBlobUrl
} from 'utils/fetch';

export function getGroups(data) {
  return post('/nf_api/your_group', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getLikeUser({ targetId, type, page, rows }) {
  return post('/nf_api/post_like_user', {
    data: JSON.stringify({
      targetId,
      type,
      page,
      rows,
    }),
  });
}

//点赞表情列表
/*
iconType：表情类型。
*/
export function getEmojiLikeUser({ iconType, targetId, type, page, rows }) {
  return post('/nf_api/post_like_user', {
    data: JSON.stringify({
      iconType,
      targetId,
      type,
      page,
      rows,
    }),
  });
}

export function getShareUser({ postId, page, rows }) {
  return post('/nf_api/post_share_user', {
    data: JSON.stringify({
      postId,
      page,
      rows,
    }),
  });
}

export function sendShareToIm({ userId, postId, type, vchannelIds }) {
  return post('/nf_api/share', {
    data: JSON.stringify({
      userId,
      postId,
      type,
      vchannelIds,
    }),
  });
}

//判断群组是否已关闭
export function checkGroup({ groupId, userId, checkUserId }) {
  return post('/nf_api/group_and_user_check', {
    data: JSON.stringify({
      groupId,
      userId,
      checkUserId,
    }),
  });
}
