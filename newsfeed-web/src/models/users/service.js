import { patch, post } from 'utils/fetch';

/**
 * 1. 个人主页
 * @param {string} userId
 * @param {string} seeUserId
 * @param {string} noticeId
 */
export function getUserData({ userId, seeUserId, noticeId }) {
  const data = { userId, seeUserId };
  if (noticeId) {
    data.noticeId = noticeId;
  }
  return post('/nf_api/user_data', {
    data: JSON.stringify(data),
  });
}

/**
 * 2. 个人主页粉丝数据
 * @param {string} userId
 * @param {string} seeUserId
 * @param {number} page
 * @param {number} rows
 */
export function getUserFans({ userId, seeUserId, page = 1, rows = 50 }) {
  return post('/nf_api/user_fans_data', {
    data: JSON.stringify({
      userId,
      ownData: userId === seeUserId,
      seeUserId,
      page,
      rows,
    }),
  });
}

/**
 * 4. 个人主页追踪中的群组
 * @param {string} userId
 * @param {string} seeUserId
 * @param {number} page
 * @param {number} rows
 */
export function getUserFollowGroup({ userId, seeUserId, page = 1, rows = 50 }) {
  return post('/nf_api/user_follow_group_list', {
    data: JSON.stringify({
      userId,
      ownData: userId === seeUserId,
      seeUserId,
      page,
      rows,
    }),
  });
}

/**
 * 6. 追踪更多个人用户
 * @param {string} userId
 */
export function getUserFollowUser(userId) {
  return post('/nf_api/user_list', {
    data: JSON.stringify({
      userId,
    }),
  });
}

/**
 * 14. 追踪/取消追踪用户
 * @param {string} userId
 * @param {string} followUserId
 * @param {boolean} follow
 */
export function followUser({ userId, followUserId, follow }) {
  return post('/nf_api/follow_user', {
    data: JSON.stringify({
      userId,
      followUserId,
      follow,
    }),
  });
}

/**
 * 40. 個人信息編輯
 * @param {string} userId
 * @param {string} description
 *
 * @param {object} avatarUrl
 * @param {string} avatarUrl.url
 * @param {number} avatarUrl.size
 * @param {number} avatarUrl.width
 * @param {number} avatarUrl.height
 *
 * @param {object} cover
 * @param {string} cover.url
 * @param {number} cover.size
 * @param {number} cover.width
 * @param {number} cover.height
 */
export function editUser({ userId, description, avatarUrl, cover }) {
  return post('/nf_api/edit_user', {
    data: JSON.stringify({
      userId,
      description,
      avatarUrl,
      cover,
    }),
  });
}

/**
 * WebChat 接口，更新头像
 * @param {*} avatarUrl
 */
export function setAvatar(avatarUrl) {
  return patch(`/api/teams/all/current_user`, {
    data: JSON.stringify({
      avatar_url: avatarUrl,
    }),
  });
}
