/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const billApi = {
  getConsumeList: '/consumerRecord/list#get', // 消费记录
  userRefund: '/refundRecord#post', // 退款
  exportConsumeList: '/consumerRecord/export#export', // 导出消费记录

  getRechargeList: '/recharge/list#get', // 充值记录
  exportRechargeList: '/recharge/export#export', // 导出充值记录

  getGrantList: '/recharge/listSubsidy#get', // 补助记录
  exportGrantList: '/recharge/export#export', // 导出补助记录

  getRefundList: '/refundRecord/list#get', // 退款记录
  exportRefundList: '/refundRecord/export#export', // 导出补助记录

  getClearList: '/clearRecord/list#get', // 余额清零记录
  exportClearList: '/clearRecord/export#export' // 导出余额清零记录
}
for (const val in billApi) {
  billApi[val] = `${hostEnv.protal_api_11031}${billApi[val]}`
}
export default billApi
