/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const attendanceApi = {
  getStudentRecord: '/student/static/record/list#post', // 学生考勤记录
  getStudentStatistics: '/student/static/list#post' // 学生考勤统计
}
for (const val in attendanceApi) {
  attendanceApi[val] = `${hostEnv.protal_api_11004}${attendanceApi[val]}`
}
export default attendanceApi
