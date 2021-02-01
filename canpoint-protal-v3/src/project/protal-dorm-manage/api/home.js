/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const home = {
  homeCheckTotal: '/canpointCheckStatic/index#postQuery', // 查寝统计
  outAtNight: '/canpointCheckStatic/query/OutAtNight#postQuery', // 深夜外出
  getBoardList: '/canpointDeviceManage/bulletin/board/list#postQuery' // 看板列表
}
for (const val in home) {
  home[val] = `${hostEnv.protal_v3_11102}${home[val]}`
}
export default home
