import request from '@/utils/request';
// 用户管理接口

export async function getUserList(params) {
  return request('/api/admin/getUserList', {
    method: 'POST',
    data: params,
  });
}

export async function deleteUser(params) {
  return request('/api/admin/deleteUser', {
    method: 'POST',
    data: params,
  });
}

export async function setStatus(params) {
  return request('/api/admin/setStatus', {
    method: 'POST',
    data: params,
  });
}

// 添加用户
export async function createAddUser(params) {
  return request('/api/admin/createUser', {
    method: 'POST',
    data: params,
  });
}

export async function editUserInfo(params) {
  return request('/api/admin/editUserInfo', {
    method: 'POST',
    data: params,
  });
}

export async function getGroupInfo() {
  return request('/api/admin/getGroupInfo', {
    method: 'POST',
  });
}
