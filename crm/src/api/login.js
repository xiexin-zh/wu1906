import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: 'admin/base/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'admin/base/logout',
    method: 'post'
  })
}
