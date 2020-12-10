/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const recordApi = {
  addDeviceInfo: '/setting/device/info/add#post', // 添加编辑设备
  deleteDeviceInfo: '/setting/device/info/del#delete', // 删除设备
  getDeviceList: '/setting/device/info/query#post', // 获取设备列表
  getrecordList: '/record/access/list#post', // 出入记录列表
  addRecord: '/record/access/add#post' // 添加出入记录
}
for (const val in recordApi) {
  recordApi[val] = `${hostEnv.protal_api_10162}${recordApi[val]}`
}
export default recordApi
