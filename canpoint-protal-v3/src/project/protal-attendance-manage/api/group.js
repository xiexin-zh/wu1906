/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const groupApi = {
  // 考勤组设置
  getAccessList: '/attendance/group/list#post', // 考勤组设置列表
  addGroup: '/attendance/group/add#post', // 新增考勤组
  updateAccess: '/attendance/group/bind/rule/update#post', // 修改考勤组
  delAccess: '/attendance/group/teacher/delete#delQuery', // 删除考勤组
  bindAccessUser: '/attendance/group/bind/user#post', // 考勤组添加人员
  getAccessUser: '/attendance/group/bind/user/query#get', // 考勤组绑定人员列表
  updateAccessUser: '/attendance/group/bind/user/update#post', // 考勤组更新人员
  bindAccessDevice: '/attendance/group/bind/device/update#post', // 考勤组绑定设备
  getAccessDetail: '/attendance/group/detail#get', // 考勤组详情
  getTeaAccessDetail: '/attendance/group/teacher/detail#get', // 教师考勤组详情
  addAttendanceGroup: '/attendance/group/teacher/add#post', // 新增教职工考勤组
  delAttendanceGroup: '/attendance/group/teacher/delete#delQuery', // 删除教职工考勤组
  attendanceGroupDetail: '/attendance/group/teacher/detail#get', // 获取教职工考勤组详情
  getAttendanceGroup: '/attendance/group/teacher/list#post', // 获取教职工考勤组列表
  updateAttendanceGroup: '/attendance/group/teacher/update#post', // 修改教职工考勤组
  changeAttendanceRecord: '/opt/record/teacher/update#post', // 修改操作教职工結果

  // 班次管理
  getShiftManage: '/shift/manage/list#post', // 列表查询
  delShiftManage: '/shift/manage/delete#delQuery', // 删除排班计划
  shiftManageDetail: '/shift/manage/detail#get', // 获取排班计划详情
  addShiftManage: '/shift/manage/save#post', // 新增
  updateShiftManage: '/shift/manage/update#post' // 更新
}

for (const val in groupApi) {
  groupApi[val] = `${hostEnv.protal_v3_11004}${groupApi[val]}`
}
export default groupApi
