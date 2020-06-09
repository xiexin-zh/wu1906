import request from '@/utils/request'
import qs from 'querystring'

export interface IToken {
  token: string
}

export function login (data: {
  username: string,
  password: string
}) {
  const params = qs.stringify({
    ...data
  })
  return request.post<IToken>('/login/doLogin', params)
}

export function changePwd (data: {
  oldpwd: string
  newpwd: string
}) {
  return request.post<any>('/admin/changepwd', data)
}

export function getUserMsg () {
  return request.post<any>('/member/detail')
}

export const saveUserMsg = (data: {
  type: string,
  keyword: string
}) => {
  return request.post<any>('/member/editUser', data)
}

export const saveUserPwd = (data: {
  oldpwd: string,
  newpwd: string,
  newpwd2: string
}) => {
  return request.post<any>('/member/changepwd', data)
}
