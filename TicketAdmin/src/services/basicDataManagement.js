// 基础数据管理接口

import request from '@/utils/request';

// 获取
export async function getTicketOption(params) {
  return request(`/api/admin/getTicketOption/${params.category}`, {
    method: 'POST',
    data: params,
  });
}

// 添加
export async function addBasicData(params) {
  return request(`/api/admin/addBasicData/${params.category}`, {
    method: 'POST',
    data: params,
  });
}

// 编辑
export async function editBasicData(params) {
  return request(`/api/admin/editBasicData/${params.category}`, {
    method: 'POST',
    data: params,
  });
}

// 删除
export async function delBasicData(params) {
  return request(`/api/admin/delBasicData/${params.category}`, {
    method: 'POST',
    data: params,
  });
}

// 获取所有市级分类
export async function getAllCityType() {
  return request('/api/admin/getAllCityType', {
    method: 'POST',
  });
}

// 获取下一子集的分类
export async function getChildrenById(params) {
  return request('/api/admin/getChildrenById', {
    method: 'POST',
    data: params,
  });
}

// 获取所有中心分类
export async function getAllQuesType() {
  return request('/api/admin/getAllQuesType', {
    method: 'POST',
  });
}

// 获取挂帐类别列表
export async function getAllOnAccount() {
  // return request('/api/admin/getAllGuazhang', {
  return request('/api/admin/getAllOnAccount', {
    method: 'POST',
  });
}

// 获取挂帐类别列表
export async function getAllRejectType() {
  return request('/api/admin/getAllRejectType', {
    method: 'POST',
  });
}
