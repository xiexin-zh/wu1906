/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let homeApi = {
  getTeacherAttendance: '/attendance/mobile/my/day/record#get', // 我的考勤,查询教职工一天的出勤打卡记录
  getTeacherStatic: '/attendance/mobile/my/month/static#get', // 我的统计,查询一个月出勤统计
  // teacherStaticDetail: '/attendance/mobile/my/month/static/detail#get', // 我的统计,查询一个月出勤统计明细
  teacherStaticState: '/attendance/mobile/my/month/state#get', // 我的考勤，一个月每天的考勤状态
  classDayStatic: '/attendance/mobile/class/day/static#get', // 学生的考勤,查询某一天学生的出勤情况
  classDayStaticDetail: '/attendance/mobile/class/day/static/detail#get', // 学生的考勤,查询某一天具体状态的学生详情
  studentMonthRecord: '/attendance/mobile/student/month/record#get', // 考勤记录,查询一个月学生的考勤记录
  studentMonthStatic: '/attendance/mobile/student/month/static#get', // 考勤记录,查询某月学生的出勤统
  childStaticDetail: '/attendance/mobile/child/month/static/detail#get', // 孩子考勤,查询孩子某月的状态天数
  classStatic: '/attendance/mobile/class/month/static#get', // 学生的统计,查询某月学生的出勤统计
  classStaticDetail: '/attendance/mobile/class/month/static/detail#get', // 学生的统计,查询一个月学生各种状态的学生
  getTeaRecordStatic: '/teacher/static/index#get', // 教师考勤统计
  teacherDetailStatistics: '/teacher/static/detail#post', // 老师考勤统计详情
  teacherMonthState: '/attendance/mobile/school/month/state#get', // 教职工考勤,查询学校一个月出勤情况
  teacherStaticDetail: '/attendance/mobile/my/month/static/detail#get', // 我的统计,查询一个月出勤统计明细
  teacherAttdanceDetail: '/attendance/mobile/school/month/detail/by/state#post', // 教职工考勤,查询学校一个月出勤情况
  //外出记录
  getrecordCoutn: '/out/record/count#post', //外出人数
  getoutRecord: '/out/record/list#post', //外出记录

}

for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11004}${homeApi[val]}`
}

export default homeApi