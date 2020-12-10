/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const specialApi = {
  getSpecialTask: '/specialTask/page/school#post', // 校端分页条件查询任务列表
  specialTaskDetail: '/specialTask/info#getUrl', // 局端/校端查看任务详情
  addSpeDanger: '/dangerTask/add/special#post', // 专项检查-校端上报隐患
  modifySpecial: '/specialTask/modify#post' // 校端/局端自查/审核/督察
}
for (const val in specialApi) {
  specialApi[val] = `${hostEnv.protal_api_8091}${specialApi[val]}`
}
export default specialApi
