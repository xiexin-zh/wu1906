/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const specialApi = {
  // 专项检查
  addSpecialTask: '/specialTask/add#post', // 局端添加专项检查任务
  specialTaskDetail: '/specialTask/info#getUrl', // 局端/校端查看任务详情
  modifySpecial: '/specialTask/modify#post', // 校端/局端自查/审核/督察
  specialPage: '/specialTask/page#post', // 局端分页条件查询任务列表
  seeReport: '/specialTask/report#getUrl', // 局端查看检查报告
  getStreetStatus: '/specialTask/template/info#getUrl', // 局端查看各街道任务状态
  // 项目检查
  addItem: '/specialItem/add#post', // 添加检查项
  itemDetail: '/specialItem/info/#getUrl', // 专检项目详情查看 /specialItem/info/{id}
  getItemAll: '/specialItem/list/#getUrl', // 查询所有检查项目 /specialItem/list/{schoolCode}
  eidtModity: '/specialItem/modify#post', // 修改检查项  /specialItem/modify
  getItemPageList: '/specialItem/page#post', // 专检项目分页条件查询 /specialItem/page
  delItem: '/specialItem/remove#getUrl' // 删除检查项 /specialItem/remove/{id}
}
for (const val in specialApi) {
  specialApi[val] = `${hostEnv.protal_api_8091}${specialApi[val]}`
}
export default specialApi
