/**
 * @des 绑定注册模块
 */

import hostEnv from '@config'

let bindApi = {
  smsSend: '/data/sms/send/', // 短信发送
  checkCode: '/data/check/code', // 验证码发送
  userAdd: '/user/info/add', // 用户注册
  getUserInfo: '/user/info/detail/', // 根据openId查询个人信息
  judgeIsRegister: '/user/info/regist/login/', // 判断当前用户是否注册
  addLogInfo: '/sign/log/info/add', // 添加登录日志
  getClassList: '/data/classinfo/list/', // 根据年级编码获取班级列表
  getGradeList: '/data/gradeinfo/list/', // 根据学校编码获取年级列表
  getMenuList: '/data/menu/list', // 获取当前用户在应用系统中的菜单列表
  getTypeList: '/data/type/list/', // 获取身份类型列表
  relationBind: '/relation/add', // 绑定班级,楼栋或学生
  getRelationList: '/relation/list#get', // 获取已绑定班级 楼栋 学生
  unbindRelatioin: '/relation/remove/relation', // 解除班级 楼栋 学生的绑定
  getDormBuildList: '/mobile/dorm/building/list/', // 楼栋列表查询
  getDormFloorList: '/mobile/dorm/building/floor/list/#postQuery', // 根据楼栋编码获取楼层和房间列表
  getSystemList: '/data/app/list/', // 获取系统列表
  getStudentInfo: '/user/info/student/info#get' // 获取用户信息
}

for (let val in bindApi) {
  bindApi[val] = `${hostEnv.protal_api_11006}${bindApi[val]}`
  // bindApi[val] = `${hostEnv.baseEnv}${bindApi[val]}`
}

export default bindApi
