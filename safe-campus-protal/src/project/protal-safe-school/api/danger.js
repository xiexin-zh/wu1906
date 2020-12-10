/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const dangerApi = {
  // 隐患小组
  addDangerGroup: '/danger/group/add#post', // 隐患小组新增/修改
  getGroupDetail: '/danger/group/info#get', // 隐患小组详情
  // 隐患分类
  addGroupClass: '/dangerCategory/add#get', // 隐患分类新增
  modifyGroupClass: '/dangerCategory/modify#get', // 隐患分类修改
  getGroupClass: '/dangerCategory/page#post', // 隐患分类列表
  delGroupClass: '/dangerCategory/remove#getUrl', // 隐患分类根据id删除
  delsGroupClass: '/dangerCategory/removes#post', // 隐患分类根据id批量删除
  // 隐患发现
  reportDanger: '/dangerTask/add#post', // 校端/局端上报隐患
  createDanger: '/dangerTask/add/daily#post', // 校端-安全档案-生成隐患
  assignDanger: '/dangerTask/assign#post', // 隐患指派
  delDanger: '/dangerTask/cancel#post', // 隐患撤销
  checkDanger: '/dangerTask/check#post', // 隐患验收
  exportDanger: '/dangerTask/export#post', // 导出隐患详情
  dealDanger: '/dangerTask/handle#post', // 隐患处理
  dangerDetail: '/dangerTask/info#getUrl', // 隐患详情
  getDanger: '/dangerTask/page#post', // 隐患列表
  superviseDanger: '/dangerTask/supervise#post', // 隐患督办
  transferDanger: '/dangerTask/transfer#post', // 隐患转派
  getDangerInfo: '/dangerTask/info#getUrl'
}
for (const val in dangerApi) {
  dangerApi[val] = `${hostEnv.protal_api_8091}${dangerApi[val]}`
}
export default dangerApi
