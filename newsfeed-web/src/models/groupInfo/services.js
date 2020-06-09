import { post } from 'utils/fetch';

/**
 *  54. 你的群组
 *  tyep:1 獲取 userId 是成員的群組 identity<3 4 5>
 *
 * @param {string} groupId
 * @param {number} page
 * @param {number} rows
 */
export function getInGroups({ userId, page = 1, rows = 9999999 }) {
  return post('/nf_api/your_group', {
    data: {
      type: 1,
      page,
      rows,
      userId,
    },
  });
}
/**
 *  54. 你的群组
 *  tyep:2 獲取 userId 是粉絲的群組 identity<2>
 *
 * @param {string} groupId
 * @param {number} page
 * @param {number} rows
 */
export function getFollowGroups({ userId, page = 1, rows = 1000 }) {
  return post('/nf_api/your_group', {
    data: {
      type: 2,
      page,
      rows,
      userId,
    },
  });
}

/**
 *  54. 你的群组
 *  tyep:3 獲取 userId 是普通成員的群組 identity<1>
 *
 * @param {string} groupId
 * @param {number} page
 * @param {number} rows
 */
export function getOtherGroups({ userId, page = 1, rows = 1000 }) {
  return post('/nf_api/your_group', {
    data: {
      type: 3,
      page,
      rows,
      userId,
    },
  });
}

/**
 * 43. 群组粉丝列表
 * @param {string} groupId
 * @param {number} page
 * @param {number} rows
 */
export function getGroupFans({ groupId, page = 1, rows = 500 }) {
  return post('/nf_api/group_follows', {
    data: {
      groupId,
      page,
      rows,
    },
  });
}

/**
 *
 * @param {string} groupId
 * @param {string} userId
 * @param {0 | 1} invite 是否是邀請訪問群組詳情 0 : 非邀請訪問 1 : 邀請訪問（默認為 0）
 * @param {string} noticeId
 */
export function getGroupDetails({ userId, groupId, invite = 0, noticeId }) {
  const data = { groupId, userId, invite };
  if (noticeId) {
    data.noticeId = noticeId;
  }
  return post('/nf_api/group_details', {
    data: JSON.stringify(data),
  });
}
/**
 *
 * @param {string} userId
 * @param {string} groupId
 * @param {number} page
 * @param {number} rows
 */
export function getGroupMembers({ userId, groupId, page = 1, rows = 5 }) {
  return post('/nf_api/group_member', {
    data: JSON.stringify({
      userId,
      groupId,
      page,
      rows,
    }),
  });
}

/**
 *
 * @param {string} groupId
 * @param {string} userId
 * @param {boolean} follow
 */
export function followGroup({ groupId, userId, follow }) {
  return post('/nf_api/follow_group', {
    data: JSON.stringify({
      groupId,
      userId,
      follow,
    }),
  });
}

/**
 *
 * @param {string} groupId
 * @param {string} userId
 * @param {boolean} join
 */
export function leaveGroup({ userId, groupId }) {
  return post('/nf_api/join_group', {
    data: JSON.stringify({
      userId,
      groupId,
      join: false,
    }),
  });
}

/**
 *
 * @param {string} groupId
 * @param {string} userId
 * @param {boolean} join
 */
export function joinGroup({ userId, groupId }) {
  return post('/nf_api/join_group', {
    data: JSON.stringify({
      userId,
      groupId,
      join: true,
    }),
  });
}

/**
 *
 * @param {string} groupId
 * @param {string} userId
 * @param {boolean} join
 */
export function noAcceptGroupInvite({ userId, groupId }) {
  return post('/nf_api/no_accept_group_invite', {
    data: JSON.stringify({
      userId,
      groupId,
    }),
  });
}

export function inviteUserFilter({ userId, groupId }) {
  return post('/nf_api/invite_user_filter', {
    data: {
      groupId,
      userId,
    },
  });
}

export function inviteUsers({ userId, groupId, members }) {
  return post('/nf_api/group_invite_users', {
    data: {
      groupId,
      userId,
      members,
    },
  });
}

export function setGroupAdmin(payload) {
  return post('/nf_api/add_group_admin', {
    data: {
      ...payload,
    },
  });
}

export function getGroupAdmin({ groupId, userId }) {
  return post('/nf_api/set_admin_list', {
    data: {
      groupId,
      userId,
    },
  });
}

export function removeGroupAdmin({ groupId, userId, adminUserId }) {
  return post('/nf_api/remove_group_admin', {
    data: {
      groupId,
      userId,
      adminUserId,
    },
  });
}

export function followGroupList({ userId, page = 1, rows = 50 }) {
  return post('/nf_api/follow_group_list', {
    data: {
      userId,
      page,
      rows,
    },
  });
}

/**
 * 此接口只用作 `群组` 中 `你的群组` 展示群组使用；
 * 由于 `群组` 中 `你的群组` 群组展示排序与移动端有差异问题；
 * 后端是使用 indexSymbol 进行排序，如果 indexSymbol 相同则会不进行对比排序，而是看`群`从数据库中拿出的先后顺序
 *
 */
export function allGroupList({ userId, page = 1, rows = 1 }) {
  return post('/nf_api/all_group_list', {
    data: {
      userId,
      page,
      rows,
    },
  });
}

export function cancelInactiveUsers({ cancelUserIds, groupId, userId }) {
  return post('/nf_api/cancel_inactive_users', {
    data: {
      cancelUserIds,
      groupId,
      userId,
    },
  });
}
