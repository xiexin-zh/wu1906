/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const Api = {}
for (const val in Api) {
  Api[val] = `${hostEnv.protal_api_11014}${Api[val]}`
}
export default Api
