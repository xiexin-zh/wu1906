/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const userApi = {
  getUserInfoList: '/user/info/list#postForm',
  getUserList: '/user/info/list#postForm', // 获取子节点
  // 登录相关
  userAuthLogin: '/user/auth/login#postForm', // 登录接口
  userAuthWebuser: '/user/auth/webuser#get', // 获取用户个人信息
  updateUserPwd: '/user/auth/pwd#postForm', // 更改用户密码,
  loginOut: '/user/auth/logout#get' // 用户注销
}
for (const val in userApi) {
  userApi[val] = `${hostEnv.protal_api_11002}${userApi[val]}`
}
export default userApi
