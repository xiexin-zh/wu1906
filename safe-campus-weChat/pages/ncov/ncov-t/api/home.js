/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let gradeApi = {
  getGradeList: `${hostEnv.protal_api_11002}/grade/manage/list#postQuery`, // 获取年级列表
  getClassList: `${hostEnv.protal_api_11002}/classManage/list#post` // 获取班级列表
}

let homeApi = {
  addReport: '/day/record/add#post', // 疫情上报
  getDaily: '/mobile/day/report/getUserReportRecordList#post', // 获取疫情日报
  getReportDetail: '/mobile/day/report/getRecordDetailsById#getUrl', // 获取上报详情
  getReportDetailByUserCode: '/mobile/day/report/getHighestByUseCode#get', // 获取当天最高温度详情
  getDayFever: '/mobile/day/report/getDayFever#post', // 获取异常日期
  getReportCount: '/mobile/day/report/getDayReportCount#post', // 获取班级学校上报数量
  getReportByState: '/mobile/day/report/getRecordByState#post', // 获取班级学校上报数量详情
  isXY: '/mobile/day/report/getSchoolDoctor#get', // 判断教职工是否为校医
  getTempPlan: '/plan/record/query/By/SchoolCodeAndDate#get', // 查询该学校下的该天的测温计划
  getPersonalStatic: '/mobile/day/report/getPersonalStatic/by/userCode#postQuery', // 健康档案
  getTemperatureData: '/day/report/user/detail#get', // 个人体温走势
}
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11005}${homeApi[val]}`
}

homeApi = {
  ...homeApi,
  getClassInfo: `${hostEnv.protal_api_10166}/mobile/user/info/bind/clazz/info#get`
}

export default homeApi