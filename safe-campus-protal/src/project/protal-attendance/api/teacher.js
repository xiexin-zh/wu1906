/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const teacherApi = {
  getTeacherRecord: '/teacher/static/record/list#post', // 老师考勤记录
  getTeacherStatistics: '/teacher/static/list#post', // 老师考勤统计
  teacherDetailStatistics: '/teacher/static/detail#post', // 老师考勤统计详情
  getStudentRecord: '/student/static/record/list#post', // 学生考勤记录
  getStudentStatistics: '/student/static/list#post', // 学生考勤统计
  studentDetailStatistics: '/student/static/detail#post', // 学生考勤统计详情
  getRecordList: '/opt/record/list#get', // 获取操作列表
  recordUpdate: '/opt/record/update#post', // 修改操作结果
  studentAccess: '/msg/setting/access#post', // 学生出入通知
  studentNoEnter: '/msg/setting/no/enter#post', // 学生未到校通知
  studentRetention: '/msg/setting/retention#post', // 学生滞留通知
  getSetting: '/msg/setting/list#get', // 消息设置列表
  getTeacherOperate: '/teacher/operate/record#get', // 老师考勤操作记录
  getTeacherDetail: '/teacher/statistics/detail#get', // 老师考勤统计详情
  getTeacherInfo: '/teacher/record/info#get', // 教职工考勤记录基本信息
  getStudentInfo: '/student/record/info#get', // 学生考勤记录基本信息
  getStudentOperate: '/student/operate/record#get', // 学生考勤操作记录
  getStudentDetail: '/student/statistics/detail#get' // 学生考勤统计详情
}
for (const val in teacherApi) {
  teacherApi[val] = `${hostEnv.protal_api_11004}${teacherApi[val]}`
}
export default teacherApi
