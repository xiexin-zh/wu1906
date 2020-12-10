/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const deviceApi = {
  getWarnList: '/warn/record/info/queryWarnRecordInfos#post', // 获取系统警告
  addDeviceList: '/device/info/addDeviceInfo#post', // 新增设备
  getDeviceList: '/device/info/queryDeviceInfos#post', // 获取设备列表
  updateDeviceList: '/device/info/updateDeviceInfo#post', // 更新设备列表
  getDeviceGroupList: '/device/group/info/queryDeviceGroupInfos#post', // 获取设备组列表
  addDeviceGroup: '/device/group/info/addDeviceGroupInfo#post', // 新增设备组
  delDevice: '/device/info/delDeviceInfo#postJsonQuery', // 删除设备
  deviceGroupDetail: '/device/group/info/detailDeviceGroupInfo#get', // 获取设备组详情
  updateDeviceGroup: '/device/group/info/updateDeviceGroupInfo#post', // 更新设备组
  delDeviceGroup: '/device/group/info/delDeviceGroupInfo#del', // 删除设备组
  bindDevice: '/device/group/relation/addDeviceGroupBatchRelation#post', // 给设备组绑定设备
  unBindDevice: '/device/group/relation/delDeviceGroupRelation#postQuery', // 解绑设备组关联的设备
  getDeviceListByDeviceGroup: '/device/group/relation/queryDeviceGroupRelationDevices#postQuery', // 通过设备组查询设备列表
  getUnbindDeviceGroupList: '/device/group/info/queryNoRelationDeviceGroupInfos#postQuery', // 查询未绑定的设备组列表
  getControlInfoByCode: '/control/group/info/queryBindControlGroupInfos#postQuery', // 通过设备组编码查询关联的控制组
  getControlGroupList: '/control/group/info/queryControlGroupInfos#post', // 获取控制组列表
  addContrlGroup: '/control/group/info/addControlGroup#post', // 新增控制组
  updateControlGroup: '/control/group/info/updateControlGroup#post', // 更新控制组
  delControlGroup: '/control/group/info/delControlGroup#postQuery', // 删除控制组
  controlGroupDetail: '/control/group/info/detailControlGroup#postQuery', // 控制组详情
  controlGroupRelations: '/control/group/relation/queryControlGroupRelations#post', // 查询控制组绑定的设备组1，识别服务2，业务规则3
  controlGroupBind: '/control/group/relation/addControlGroupBatchRelation#post', // 控制组绑定设备组，识别服务，业务规则
  getUnBindBusList: '/sys/buss/info/queryNoRelationSysBussInfos#postQuery', // 获取系统未关联的业务信息
  unBindControlInfo: '/control/group/relation/delControlGroupRelation#post', // 解绑控制组绑定的信息
  getUnBindIdent: '/ident/server/info/queryNoRelationIdentServerInfos#postQuery' // 获取控制组未绑定的识别服务
}
for (const val in deviceApi) {
  deviceApi[val] = `${hostEnv.protal_api_10090}${deviceApi[val]}`
}
export default deviceApi
