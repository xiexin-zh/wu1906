import request from '@/utils/request';

// 获取日报数量
export async function getDayTotalNum(params) {
  return request('/api/admin/getDayTotalNum', {
    method: 'POST',
    data: params,
  });
}

// 获取工单类别
export async function getDayTypeTotal(params) {
  return request('/api/admin/getDayTypeTotal', {
    method: 'POST',
    data: params,
  });
}

// 获取问题类型
export async function getDayQuesTypeTotal(params) {
  return request('/api/admin/getDayQuesTypeTotal', {
    method: 'POST',
    data: params,
  });
}

// 获取承办单位
export async function getDayCompanyTotal(params) {
  return request('/api/admin/getDayCompanyTotal', {
    method: 'POST',
    data: params,
  });
}

// 获取工单概要
export async function getDayTotalInfo(params) {
  return request('/api/admin/getDayTotalInfo', {
    method: 'POST',
    data: params,
  });
}

// 获取工单概要
export async function getDayTicketLists(params) {
  return request('/api/admin/getDayTicketLists', {
    method: 'POST',
    data: params,
  });
}
