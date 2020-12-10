/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from './host-env.js'
let consumeApi = {
  getAccountInfo: '/api/mobile/queryAccountInfoByUserCode#postQuery', // 查询用户账户信息
  getBillList: '/api/mobile/queryUserBillRecord#postQuery', // 查询用户账单
	updateConsumeRule: '/api/mobile/updateConsumeRule#postQuery', // 更新消费规则
	getBillDetail: '/api/mobile/queryRecordInfoByBillNo#postQuery', // 通过账单查询账单详情
	createRecharge: '/api/mobile/createRecharge#post', // 充值
	continueRecharge: '/api/mobile/continueRecharge#postQuery', // 继续充值
	continueRechargeByOrderNo: '/api/mobile/continueRechargeByOrderNo#postQuery', // 继续支付
	queryRecordInfo: '/api/mobile/queryRecordInfoByOrderNo#postQuery#false', // 查询充值状态
	queryStatistics: '/api/mobile/queryStatisticsByUserCode#postQuery', // 月消费统计
}

for (let val in consumeApi) {
  consumeApi[val] = `${hostEnv.protal_api_11031}${consumeApi[val]}`
}

export default consumeApi
