/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const dataViewApi = {
  // 首页
  getboardList: '/visible/board/manage/list#postQuery', // 实时看板列表
  addBoard: '/visible/board/manage/add/and/update#post', // 添加实时看板
  delBoard: '/visible/board/manage/delete#delQuery', // 删除实时看板
  getBoarddetail: '/visible/board/manage/detail#getQuery', // 实时看板详情
  getboarddeviceList: '/visible/board/manage/device/relation/list#getQuery', // 实时看板设备列表
  getInOutTotal: '/record/access/realtime/static#postQuery', // 进出校数据汇总
  getHourList: '/record/access/hour/static#post', // 今日出入校人次
  getDoorDeviceList: '/setting/device/info/query#post', // 门禁设备列表

  // 出入记录
  getRecordList: '/record/access/list#post', // 出入记录列表

  // 通行权限
  addControl: '/setting/place/controller/relation/add#post', // 添加控制组
  delControl: '/setting/place/controller/relation/delete#delQuery', // 删除控制组
  getGroupList: '/setting/rule/group/list#postForm', // 获取通行权限列表
  addGroup: '/setting/rule/group/add#post', // 添加编辑通行权限组
  editGroup: '/setting/rule/group/time/update#post', // 编辑通行权限组
  getGroupDetail: '/setting/rule/group/detail#get', // 查询权限组详情
  delRuleGroup: '/setting/rule/group/delete#delQuery', // 删除通行权限组
  bindAccessUser: '/setting/rule/group/user/add#post', // 权限组添加人员
  bindAccessDevice: '/setting/rule/group/device/update#post', // 权限组添加设备
  updateAccessUser: '/setting/rule/group/user/update#post', // 权限组添加人员
  getAccessUserList: '/setting/rule/user/list#post', // 权限组人员列表
  getStudentAccess: '/studentAccess#get', // 学生通行权限
  getTeacherAccess: '/teacherAccess#get' // 教师通行权限
}

for (const val in dataViewApi) {
  dataViewApi[val] = `${hostEnv.protal_v3_10162}${dataViewApi[val]}`
}
export default dataViewApi
