import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function adminLogin(params) {
  return request('/api/admin/login', {
    method: 'POST',
    data: params,
  });
}

export async function adminLogout() {
  return request('/api/admin/logout', {
    method: 'POST',
    data: {
      token: decodeURIComponent(atob(localStorage.getItem('token'))),
    },
  });
}
