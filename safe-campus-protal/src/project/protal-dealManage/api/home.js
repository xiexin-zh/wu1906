/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const dealApi = {
  getOrderList: '/order/page#postQuery', // 查询订单列表
  getDictList: '/dict/data/type#getUrl', // 数据字典
  getOrderDetail: '/order/info#getUrl', // 查询订单详情

  addRule: '/consumeRule/add#post', // 新增消费规则
  getRuleList: '/consumeRule/page#postQuery', // 消费规则列表查询
  editRule: '/consumeRule/modify#post', // 修改消费规则
  delRule: '/consumeRule/remove#getUrl' // 删除消费规则
}
const applyApi = {
  getApplyList: '/oauthClient/page#postQuery', // 查询应用列表
  getApplyDetail: '/oauthClient/info#getUrl', // 查询应用详情
  editApply: '/oauthClient/modify#postQuery' // 编辑应用
}
for (const val in dealApi) {
  dealApi[val] = `${hostEnv.protal_api_11025}${dealApi[val]}`
}
for (const val in applyApi) {
  applyApi[val] = `${hostEnv.protal_api_11022}${applyApi[val]}`
}
export default {
  ...dealApi,
  ...applyApi
}
