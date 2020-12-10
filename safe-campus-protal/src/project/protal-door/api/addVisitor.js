/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const addVisitorApi = {
  addDeviceGroup: '/setting/device/group/add#post', // 添加设备分组
  delDeviceGroup: '/setting/device/group/delete#delQuery', // 删除设备分组列表
  groupList: '/setting/device/group/list#postQuery', // 设备分组列表
  updateDeviceGroup: '/setting/device/group/update#post' // 更新设备分组
}
for (const val in addVisitorApi) {
  addVisitorApi[val] = `${hostEnv.protal_api_10162}${addVisitorApi[val]}`
}
export default addVisitorApi
