import request from '@/utils/request';
// 角色管理接口

export async function getAllUserGroups(params) {
  return request('/api/admin/getAllUserGroups', {
    method: 'POST',
    data: params,
  });
}

export async function deleteUserGroup(params) {
  return request('/api/admin/deleteUserGroup', {
    method: 'POST',
    data: params,
  });
}

export async function setUserGroupStatus(params) {
  return request('/api/admin/setUserGroupStatus', {
    method: 'POST',
    data: params,
  });
}

// 新增角色
export async function createUserGroupRole(params) {
  return request('/api/admin/createUserGroupRole', {
    method: 'POST',
    data: params,
  });
}

// 修改角色
export async function editUserGroupRole(params) {
  return request('/api/admin/editUserGroupRole', {
    method: 'POST',
    data: params,
  });
}
