/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let homeApi = {
  getChildAttendance: '/attendance/mobile/child/day/record#get', // 孩子考勤,查询孩子某一天的打卡记录
  getChildStatic: '/attendance/mobile/child/month/state#get', // 孩子考勤,查询孩子一个月每天的状态
  childStaticDetail: '/attendance/mobile/child/month/static/detail#get', // 孩子考勤,查询孩子某月的状态天数
  studentMonthStatic: '/attendance/mobile/student/month/static#get', // 考勤记录,查询某月学生的出勤统计
  studentMonthState: '/attendance/mobile/child/month/state#get' // 孩子考勤，查询一个月每一天的考勤状态
}

for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11004}${homeApi[val]}`
}

export default homeApi
