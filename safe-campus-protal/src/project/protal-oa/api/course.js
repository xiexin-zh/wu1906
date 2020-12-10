/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'
const clApi = {
  getsubstituteList: '/substitute/form/findSubstituteList#post', // 调课列表
  getsubstituteDetail: '/substitute/form/detail/#getUrl' // 调课列表
}
for (const val in clApi) {
  clApi[val] = `${hostEnv.protal_api_11014}${clApi[val]}`
}
export default {
  ...clApi
}
