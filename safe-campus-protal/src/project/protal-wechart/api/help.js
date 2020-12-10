/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const helpApi = {
  getHelpList: '/getHelpList#get', // 获取帮助列表
  delHelp: '/delHelp#post', // 删除帮助列表
  addHelp: '/addHelp#post', // 添加帮助列表
  updateHelp: '/updateHelp#post' // 修改帮助列表
}
for (const val in helpApi) {
  helpApi[val] = `http://canpointtest.com:8090/miniHelp${helpApi[val]}`
}
export default helpApi
