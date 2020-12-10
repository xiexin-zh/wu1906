/**
 * @des 接口列表主模块
 */

import hostEnv from '@/config/host-env'

const homeApi = {
  loginOut: '/user/user/auth/logout', // 用户注销
  changePassWord: '/user/user/auth/pwd', // 修改密码
  userLogin: '/user/user/auth/login', // 用户登录
  userInfo: '/user/user/auth/webuser', // 获取用户信息
  getTotal: '/dorm/index/count/total/', // 获取学生归寝情况统计
  getNumberList: '/dorm/index/count/total/details', // 获取学生归寝情况详情
  getPersonChart: '/dorm/index/month/exception', // 获取人员弹框饼图数据
  getPersonDetail: '/dorm/index/userinfo/', // 获取人员弹框人员信息详情数据
  getPersonStatus: '/dorm/index/personStatusRecord' // 获取人员弹框人员异常详情数据
}

for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11006}${homeApi[val]}`
}
export default homeApi
