/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const controlApi = {
  getDeviceList: '/device/info/queryDeviceInfos#post' // 获取设备列表
}
for (const val in controlApi) {
  controlApi[val] = `${hostEnv.protal_api_10090}${controlApi[val]}`
}
export default controlApi
