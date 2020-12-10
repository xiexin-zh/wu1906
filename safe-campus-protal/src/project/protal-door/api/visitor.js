/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const visitorApi = {
  getappointList: '/invite/appoint/list#post', // 访客记录
  getappointDetail: '/invite/appoint/detail#get', // 详细访问记录
  addcause: '/cause/info/add#post', // 事由添加
  delcause: '/cause/info/delete#get', // 事由删除
  getcauseList: '/cause/info/list#post', // 事由列表
  addcontrolgroup: '/setting/device/info/add#post', // 添加访客控制组
  delcontrolgroup: '/setting/device/info/del#delete', // 删除访客控制组
  getcontrolgroupsList: '/setting/device/info/query#post' // 访客控制组查询列表
}
for (const val in visitorApi) {
  visitorApi[val] = `${hostEnv.protal_api_10160}${visitorApi[val]}`
}
export default visitorApi
