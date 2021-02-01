/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let homeApi = {
  // 调宿审批 
  getDormApprover: '/change/dorm/approver/list#post', // 转班申请审批列表
  agreeDormApprover: '/change/dorm/approver/agree/and/forward#post', // 调宿申请审批同意并转交
  dormApproverDetail: '/change/dorm/approver/detail#get', // 转班申请审批列表详情
  refuseDormApprover: '/change/dorm/approver/update#post', // 调宿申请审批通过或者不通过
  getDaily: '/mobile/day/report/getUserReportRecordList#post', // 获取疫情日报
  getDayFever: '/mobile/day/report/getDayFever#post', // 获取异常日期
  getReportDetail: '/mobile/day/report/getRecordDetailsById#getUrl', // 获取上报详情
  getPersonalStatic: '/mobile/day/report/getPersonalStatic/by/userCode#postQuery', // 健康档案
  getTemperatureData: '/day/report/user/detail#get', // 个人体温走势
}

for (let val in homeApi) {
	homeApi[val] = `${hostEnv.protal_api_11006}${homeApi[val]}`
}

export default homeApi