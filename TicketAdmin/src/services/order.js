import request from '@/utils/request';

// 获取工单数量统计（新工单、处理中、待审核、已办结
export async function getOrderTotal() {
  return request('/api/admin/getTicketTagsTotal', {
    method: 'POST',
    data: {},
  });
}

// 添加新工单
export async function addNewOrder(params) {
  return request('/api/admin/createTicket', {
    method: 'POST',
    data: params,
  });
}

// 获取新工单列表
export async function getNewOrderList(params) {
  return request('/api/admin/getTicketLists', {
    method: 'POST',
    data: params,
  });
}

// 获取工单详情
export async function getOrderDetails(params) {
  return request('/api/admin/getTicketDetail', {
    method: 'POST',
    data: params,
  });
}

// 编辑工单
export async function editOrder(params) {
  return request('/api/admin/editTicket', {
    method: 'POST',
    data: params,
  });
}

// 分中心自处理
export async function centerDoSelf(params) {
  return request('/api/admin/centerDoSelf', {
    method: 'POST',
    data: params,
  });
}

// 中心处理获取工单处理信息
export async function getCenterDoSelf(params) {
  return request('/api/admin/getCenterDoSelf', {
    method: 'POST',
    data: params,
  });
}

// 部门自处理
export async function deptDoSelf(params) {
  return request('/api/admin/deptDoSelf', {
    method: 'POST',
    data: params,
  });
}

// 部门自处理获取工单处理信息
export async function getDeptDoSelf(params) {
  return request('/api/admin/getDeptDoSelf', {
    method: 'POST',
    data: params,
  });
}

// 承办单位自处理
export async function compDoSelf(params) {
  return request('/api/admin/compDoSelf', {
    method: 'POST',
    data: params,
  });
}

// 承办单位自处理
export async function getCompDoSelf(params) {
  return request('/api/admin/getCompDoSelf', {
    method: 'POST',
    data: params,
  });
}

// 获取工单超时统计
export async function getStatistics(params) {
  return request('/api/admin/getTicketTotal', {
    method: 'POST',
    data: params,
  });
}

// 中心审核
export async function centerCheckTicket(params) {
  return request('/api/admin/centerCheckTicket', {
    method: 'POST',
    data: params,
  });
}

// 部门审核
export async function deptCheckComp(params) {
  return request('/api/admin/deptCheckComp', {
    method: 'POST',
    data: params,
  });
}

// 中心审核-获取提交的数据
export async function getTicketCheckInfo(params) {
  return request('/api/admin/getTicketCheckInfo', {
    method: 'POST',
    data: params,
  });
}

// 获取工单编号
export async function getTicketNo(params) {
  return request('/api/admin/getTicketNo', {
    method: 'POST',
    data: params,
  });
}

// 获取工单状态
export async function getTicketStateOption(params) {
  return request('/api/admin/getTicketStateOption', {
    method: 'POST',
    data: params,
  });
}
