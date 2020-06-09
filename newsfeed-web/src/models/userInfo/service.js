import { post } from 'utils/fetch';

export function getUserData(data) {
  return post('/nf_api/user_data', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getUserPostListComment(data) {
  return post('/nf_api/comment_list', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function postComment(data) {
  return post('/nf_api/comment', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function secondPostComment(data) {
  return post('/nf_api/second_comment_list', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function postChangeLike(data) {
  return post('/nf_api/like', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function postVote(data) {
  return post('/nf_api/submit_vote', {
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getUserFans({ userId, seeUserId, page = 1, rows = 20 }) {
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

export function getUserFollowUser({ userId, seeUserId, page = 1, rows = 20 }) {
  return post('/nf_api/follow_user_list', {
    data: JSON.stringify({
      userId,
      ownData: userId === seeUserId,
      seeUserId,
      page,
      rows,
    }),
  });
}

export function getUserFollowGroup({ userId, seeUserId, page = 1, rows = 20 }) {
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

export function followGroup({ userId, groupId, follow }) {
  return post('/nf_api/follow_group', {
    data: JSON.stringify({
      userId,
      groupId,
      follow,
    }),
  });
}

export function editPostComment({
  userId,
  commentId,
  type,
  targetId,
  content,
}) {
  return post('/nf_api/edit_comment', {
    data: JSON.stringify({
      userId,
      commentId,
      type,
      targetId,
      content,
    }),
  });
}
