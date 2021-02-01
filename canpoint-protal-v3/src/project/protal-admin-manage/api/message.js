/**
 * @des 平台消息接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const message = {
  getMessageList: '/canpointPlatformMessage/page#post', // 消息列表
  addMessage: '/canpointPlatformMessage/add#post', // 新增消息列表
  modifyMessage: '/canpointPlatformMessage/modify#post', // 更新消息列表
  delMessage: '/canpointPlatformMessage/remove#get' // 删除消息列表
}
for (const val in message) {
  message[val] = `${hostEnv.protal_v3_11101}${message[val]}`
}
export default message
