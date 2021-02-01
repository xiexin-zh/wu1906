/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let homeApi = {
  addReport: '/day/record/add#post', // 疫情上报
  getDaily: '/mobile/day/report/getUserReportRecordList#post', // 获取疫情日报
  getDayFever: '/mobile/day/report/getDayFever#post', // 获取异常日期
  getReportDetail: '/mobile/day/report/getRecordDetailsById#getUrl', // 获取上报详情
  getPersonalStatic: '/mobile/day/report/getPersonalStatic/by/userCode#postQuery', // 健康档案
  getTemperatureData: '/day/report/user/detail#get', // 个人体温走势
}

for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11005}${homeApi[val]}`
}

export default homeApi