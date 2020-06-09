import { post } from 'utils/fetch';

export function groupNotice({ userId, groupId, notice }) {
  return post('/nf_api/group_notice', {
    data: {
      userId,
      groupId,
      notice,
    },
  });
}

export function groupMember({ userId, groupId }) {
  return post('/nf_api/group_member', {
    data: {
      page: 1,
      rows: 50,
      userId,
      groupId,
    },
  });
}

export function removeGroupMember({ userId, groupId, memberUserId }) {
  return post('/nf_api/remove_group_member', {
    data: {
      groupId,
      userId,
      memberUserId,
    },
  });
}

export function applyJoinOrCancelGroup({ userId, groupId, cancelOrJoin }) {
  return post('/nf_api/applicant_join_group', {
    data: {
      groupId,
      userId,
      cancelOrJoin,
    },
  });
}

export function allowUserJoinGroup({
  userId,
  groupId,
  allowJoin,
  operateUserIds,
}) {
  return post('/nf_api/is_allow_user_join_group', {
    data: {
      groupId,
      userId,
      allowJoin,
      operateUserIds,
    },
  });
}
