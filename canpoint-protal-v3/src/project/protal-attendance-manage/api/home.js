/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const Api = {
  // 学生考勤
  getStuRecord: '/student/static/record/list#post', // 学生考勤记录
  getStuTotal: '/student/static/list#post', // 学生考勤统计
  stuTotalDetail: '/student/static/detail#post', // 学生考勤统计详情
  updateStuState: '/opt/record/student/update#post', // 修改操作学生結果
  // 教职工考勤
  getTeaRecord: '/teacher/static/record/list#post', // 老师考勤记录
  getTeaTotal: '/teacher/static/list#post', // 老师考勤统计
  teaTotalDetail: '/teacher/static/detail#post', // 老师考勤统计详情
  updateTeaState: '/opt/record/teacher/update#post', // 修改操作教职工結果
  // 通知设置
  getMsgList: '/msg/setting/list#get', // 消息设置列表
  updateMsg: '/msg/setting/save#post' // 保存通知设置
}
for (const val in Api) {
  Api[val] = `${hostEnv.protal_v3_11004}${Api[val]}`
}
export default Api
