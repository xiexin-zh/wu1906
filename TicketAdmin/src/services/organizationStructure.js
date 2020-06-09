// 通讯录管理

import request from '@/utils/request';

// 组织结构 树形结构
export async function getDepartmentLists(params) {
  return request(`/api/admin/getDepartmentLists`, {
    method: 'POST',
    data: params,
  });
}

// 组织结构 树形新增
export async function createDepartment(params) {
  return request(`/api/admin/createDepartment`, {
    method: 'POST',
    data: params,
  });
}

// 组织结构 树形修改
export async function editDepartment(params) {
  return request(`/api/admin/editDepartment`, {
    method: 'POST',
    data: params,
  });
}

// 组织结构 树形删除
export async function deleteDepartment(params) {
  return request(`/api/admin/deleteDepartment`, {
    method: 'POST',
    data: params,
  });
}

// 组织结构 用户列表
export async function getDepartmentUserById(params) {
  return request(`/api/admin/getDepartmentUserById`, {
    method: 'POST',
    data: params,
  });
}
