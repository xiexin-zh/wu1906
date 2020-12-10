/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  getApp: '/role/manage/menu/multiple/tree/list#get' // 根据用户id获取菜单权限
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_10060}${homeApi[val]}`
}
export default homeApi
