const namespace = 'groupOption';

export function applyJoinOrCancelGroup({ groupId, cancelOrJoin }) {
  return {
    type: `${namespace}/applyJoinOrCancelGroup`,
    payload: {
      groupId,
      cancelOrJoin,
    },
  };
}

export function allowUserJoinGroup({ groupId, allowJoin, operateUserIds }) {
  return {
    type: `${namespace}/allowUserJoinGroup`,
    payload: {
      groupId,
      allowJoin,
      operateUserIds,
    },
  };
}
