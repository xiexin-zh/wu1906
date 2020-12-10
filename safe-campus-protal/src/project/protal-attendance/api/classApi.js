/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const classApi = {
  getShiftManage: '/shift/manage/list#post', // 列表查询
  delShiftManage: '/shift/manage/delete#delQuery', // 删除排班计划
  shiftManageDetail: '/shift/manage/detail#get', // 获取排班计划详情
  addShiftManage: '/shift/manage/save#post', // 新增
  updateShiftManage: '/shift/manage/update#post', // 更新
  addAttendanceGroup: '/attendance/group/teacher/add#post', // 新增教职工考勤组
  delAttendanceGroup: '/attendance/group/teacher/delete#delQuery', // 删除教职工考勤组
  attendanceGroupDetail: '/attendance/group/teacher/detail#get', // 获取教职工考勤组详情
  getAttendanceGroup: '/attendance/group/teacher/list#post', // 获取教职工考勤组列表
  updateAttendanceGroup: '/attendance/group/teacher/update#post', // 修改教职工考勤组
  changeAttendanceRecord: '/opt/record/teacher/update#post', // 修改操作教职工結果
  //外出记录
  getrecordCoutn: '/out/record/count#post', //外出人数
  getoutRecord: '/out/record/list#post', //外出记录
  exportRecord: '/out/record/export#export' //导出
}
for (const val in classApi) {
  classApi[val] = `${hostEnv.protal_api_11004}${classApi[val]}`
}
export default classApi