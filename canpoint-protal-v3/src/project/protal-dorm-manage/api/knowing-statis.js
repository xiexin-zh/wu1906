/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const dormManage = {
  checkStatiList: '/canpointCheckStatic/list#post', // 查寝统计列表
  statiDetail: '/canpointCheckStatic/detail/list#post', // 统计详情
  exportStatiList: '/canpointCheckStatic/list/export#post', // 查寝统计导出

  personList: '/canpointCheckStatic/person/list#post', // 个人统计
  personDetail: '/canpointCheckStatic/person/detail/list#post', // 统计详情
  exportpersonList: '/canpointCheckStatic/person/list/export#post', // 查寝统计导出

  outInList: '/canpointDormAccess/record/page#post', // 出入记录
  invade: '/canpointDormAccess/intrusion/page#post' // 入侵记录
}
for (const val in dormManage) {
  dormManage[val] = `${hostEnv.protal_v3_11102}${dormManage[val]}`
}
export default dormManage
