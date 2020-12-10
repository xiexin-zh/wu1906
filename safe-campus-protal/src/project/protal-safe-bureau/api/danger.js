/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const dangerApi = {
  // 隐患管理
  addDangerTask: '/dangerTask/add#post', // 上报隐患
  getDangerList: '/dangerTask/edu/page#post', // 发现隐患列表
  getDangerInfo: '/dangerTask/info#getUrl', // 发现隐患列表
  getCode: '/dangerTask/notification/code#get', // 发现隐患列表
  notification: '/dangerTask/notification#putJson', // 确定并下发通知

  // 隐患小组
  getGroupDetail: '/danger/group/info#get', // 隐患小组详情
  exportDanger: '/dangerTask/export#post', // 导出隐患详情
  superviseDanger: '/dangerTask/supervise#post' // 隐患督办
}
for (const val in dangerApi) {
  dangerApi[val] = `${hostEnv.protal_api_8091}${dangerApi[val]}`
}
export default dangerApi
