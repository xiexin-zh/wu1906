/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  getSchoolDate: '/school/date/list#post', // 校历列表
  getSpecialDate: '/special/date/list#post', // 特殊日期列表
  getTeachersLeave: '/teacher/leave/list#post', // 教职工请假列表
  getStudentsLeave: '/student/leave/list#post', // 学生请假列表
  getTeacherLeaveDetail: '/teacher/leave/detailById#getUrl', // 教职工请假详情
  getStudentLeaveDetail: '/student/leave/detailById#getUrl' // 学生请假详情
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_10054}${homeApi[val]}`
}
export default homeApi
