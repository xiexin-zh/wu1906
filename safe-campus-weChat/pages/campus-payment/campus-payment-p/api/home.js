/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'
const baseData1Api = {
  // 场地管理
  getbillInfo: '/billInfo/page#post', // 账单列表
  getbillDetail: '/billInfo/info#getUrl', //  获取账单详细
  getchargeTaskList: '/chargeTaskInfo/page#post', // 收费任务列表
  getCharge: '/taskItemRelation/getChargeItemByCode#getUrl', // 收费项列表
  addOrder: '/order/create_order#post' //支付

}

for (const val in baseData1Api) {
  baseData1Api[val] = `${hostEnv.protal_api_10097}${baseData1Api[val]}`
}

export default {
  ...baseData1Api,
}