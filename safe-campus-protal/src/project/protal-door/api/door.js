/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'
const visitorApi = {
  getReasonList: '/reasonList#get', // 来访事由
  getFkControl: '/fkControl#get', // 获取访客控制组配置
  getFkRecord: '/fkRecord#get', // 获取访客记录
  downAppoint: '/invite/appoint/access/downloadExcel#export' // 访客记录导出
}
let doorApi = {
  // getDoorSet: '/setting/place/relation/list#post', // 获取门卫列表
  getDoorSet: '/setting/guard/info#getUrl', // 获取门卫列表
  // addDoor: '/setting/place/user/relation/add#post', // 添加门卫
  addDoor: '/setting/guard/info/add#post', // 添加门卫
  delDoor: '/setting/guard/info/del#del', // 删除门卫
  // delDoor: '/setting/place/user/relation/delete#delQuery', // 删除门卫
  addControl: '/setting/place/controller/relation/add#post', // 添加控制组
  delControl: '/setting/place/controller/relation/delete#delQuery', // 删除控制组
  getGroupList: '/setting/rule/group/list#postForm', // 获取通行权限列表
  addGroup: '/setting/rule/group/add#post', // 添加编辑通行权限组
  getGroupDetail: '/setting/rule/group/detail#get', // 查询权限组详情
  delRuleGroup: '/setting/rule/group/delete#delQuery', // 删除通行权限组
  bindAccessUser: '/setting/rule/group/user/add#post', // 权限组添加人员
  getAccessUserList: '/setting/rule/user/list#post', // 权限组人员列表
  getStudentAccess: '/studentAccess#get', // 学生通行权限
  getTeacherAccess: '/teacherAccess#get' // 教师通行权限
}
for (const val in visitorApi) {
  visitorApi[val] = `${hostEnv.protal_api_10162}${visitorApi[val]}`
}
for (const val in doorApi) {
  doorApi[val] = `${hostEnv.protal_api_10162}${doorApi[val]}`
}
doorApi = {
  ...doorApi,
  ...visitorApi,
  initcauseList: `${hostEnv.protal_api_10160}/cause/info/init#post`
}
export default doorApi
