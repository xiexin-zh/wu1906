/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const consumeApi = {
  getCountList: '/business/count/businessCountList#post', // 营业统计
  getConsumeDetail: '/consume/record/consumeDetail#post', // 消费明细
  userRefund: '/user/info/userRefund#post', // 退款
  getRechargeDetail: '/consume/record/rechargeDetail#post', // 充值明细
  getSubsidyDetail: '/consume/record/subsidyDetail#post', // 补助明细
  getDeducDetail: '/consume/record/deducDetail#post', // 扣款明细
  getRefundDetail: '/consume/record/refundDetail#post', // 退款明细
  getCount: '/consume/record/overviewDetail#post', // 系统概览
  getDeviceList: '/device/bind/deviceInfoList#post', // 消费机列表
  getUserInfoList: '/user/info/userInfoList#post', // 账户列表
  getDealRecordList: '/consume/record/rechargeDetail#post', // 账户交易记录
  recharge: '/user/info/recharge#post', // 充值
  charge: '/user/info/userDeduction#post', // 扣款
  subsidy: '/user/info/userInfoManage#post', // 补助
  getSubsidy: '/subsidy/manage/grantInfoList#post', // 补助名称列表（补助管理）
  getConsumeRule: '/rule/set/cardTypeList#post', // 获取所有消费规则
  updateRule: '/rule/set/update#post', // 编辑更新规则
  getLineStatus: '/rule/set/offLine#postJsonQuery', // 是否离线
  initSend: '/subsidy/manage/instantGrant#post', // 立即发放
  subsidyInfoList: '/subsidy/record/subsidyInfoList#post', // 补助发放人员名单
  delSubsidy: '/subsidy/manage/detailSubsidy#post', // 删除补助
  addSubsidy: '/subsidy/manage/addSubsidy#post', // 添加补助
  addAuthor: '/device/bind/authorization#post' // 授权

}

for (const val in consumeApi) {
  consumeApi[val] = `${hostEnv.hpb_card}${consumeApi[val]}`
}
export default consumeApi
