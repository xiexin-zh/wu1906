/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const cardApi = {
  getRuleInfo: '/rule/set/getRuleInfo#post' // 根据用户类型获取消费规则
}
for (const val in cardApi) {
  cardApi[val] = `${hostEnv.hpb_card}${cardApi[val]}`
}
export default cardApi
