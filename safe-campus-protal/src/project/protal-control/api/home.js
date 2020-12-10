/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  getIdentify: '/record/info/queryIdentRecordInfos#post', // 获取识别记录信息列表
  getServerInfo: '/ident/server/info/queryIdentServerInfos#post', // 获取识别服务列表
  getAllBusiness: '/record/info/queryBussRecordInfos#post', // 获取业务信息列表
  getBussList: '/sys/buss/info/querySysBussInfos#postQuery', // 通过条件查询业务系统业务信息列表
  addIdentServerInfo: '/ident/server/info/addIdentServerInfo#post', // 新增识别服务
  updateIdentServerInfo: '/ident/server/info/updateIdentServerInfo#post', // 更新识别服务
  delIdentServerInfo: '/ident/server/info/delIdentServerInfo#postQuery', // 删除识别服务
  getRelationList: '/queue/relation/info/queryRelationQueues#post', // 获取队列关联信息列表
  updateRelationServerInfo: '/queue/relation/info/updateQueueRelationInfo#post', // 更新队列关联信息
  addRelationServerInfo: '/queue/relation/info/addQueueRelationInfo#post', // 新增队列
  delRelationServerInfo: '/queue/relation/info/delQueueRelationInfo#postQuery', // 删除队列
  resubmitBussRecord: '/record/info/resubmitBussRecordInfo#post', // 重试
  getControlGroupList: '/control/group/info/queryControlGroupInfos#post' // 获取控制组列表
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_10090}${homeApi[val]}`
}
export default homeApi
