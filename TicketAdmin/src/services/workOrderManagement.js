import request from '@/utils/request';

export async function leadersInstructions(params) {
  return request('/api/admin/leaderCommand', {
    method: 'POST',
    data: params,
  });
}

export async function getDeptLists(params) {
  return request('/api/admin/getDeptLists', {
    method: 'POST',
    data: params,
  });
}

export async function centerAssignTo2(params) {
  return request('/api/admin/centerAssignTo2', {
    method: 'POST',
    data: params,
  });
}

export async function centerAssignTo1(params) {
  return request('/api/admin/centerAssignTo1', {
    method: 'POST',
    data: params,
  });
}

export async function deptDoSelf(params) {
  // 部门-新工单自处理
  return request('/api/admin/deptDoSelf', {
    method: 'POST',
    data: params,
  });
}

export async function deptAssignTo(params) {
  // 部门-新工单分派
  return request('/api/admin/deptAssignTo', {
    method: 'POST',
    data: params,
  });
}

export async function deptCheckComp(params) {
  // 工单审核（来自承办单位）
  return request('/api/admin/deptCheckComp', {
    method: 'POST',
    data: params,
  });
}

export async function centerCheckTicket(params) {
  // 新的审核接口
  return request('/api/admin/centerCheckTicket', {
    method: 'POST',
    data: params,
  });
}

export async function getAllRejectType(params) {
  // 新的审核接口
  return request('/api/admin/getAllRejectType', {
    method: 'POST',
    data: params,
  });
}

export async function getAllOnAccount(params) {
  // 新的审核接口
  return request('/api/admin/getAllOnAccount', {
    method: 'POST',
    data: params,
  });
}

export async function deptReject(params) {
  // 新的审核接口
  return request('/api/admin/deptReject', {
    method: 'POST',
    data: params,
  });
}

export async function getCenterReject(params) {
  // 中心获取提挂帐信息
  return request('/api/admin/getCenterReject', {
    method: 'POST',
    data: params,
  });
}

export async function centerCheckReject(params) {
  // 中心工单审核(剔挂帐)
  return request('/api/admin/centerCheckReject', {
    method: 'POST',
    data: params,
  });
}

export async function getDeptReject(params) {
  // 获取剔挂账信息（部门）
  return request('/api/admin/getDeptReject', {
    method: 'POST',
    data: params,
  });
}

export async function getCompReject(params) {
  // 获取剔挂账信息（承办单位）
  return request('/api/admin/getCompReject', {
    method: 'POST',
    data: params,
  });
}

export async function compReject(params) {
  // 承办单位申请剔挂账
  return request('/api/admin/compReject', {
    method: 'POST',
    data: params,
  });
}
