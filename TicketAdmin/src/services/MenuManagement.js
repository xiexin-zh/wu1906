import request from '@/utils/request';
// 菜单管理接口

export async function getMenuList(params) {
  return request('/api/admin/getMenuList', {
    method: 'POST',
    data: params,
  });
}

export async function deleteMenu(params) {
  return request('/api/admin/deleteMenu', {
    method: 'POST',
    data: params,
  });
}

export async function setMenuStatus(params) {
  return request('/api/admin/setMenuStatus', {
    method: 'POST',
    data: params,
  });
}

export async function editMenu(params) {
  return request('/api/admin/editMenu', {
    method: 'POST',
    data: params,
  });
}
