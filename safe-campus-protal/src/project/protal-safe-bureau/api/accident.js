/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const accidentApi = {
  addAccident: '/accident/add#post', // 添加事故
  getAccident: '/accident/page#post', // 校端/局端分页条件查询事故列表
  accidentDetail: '/accident/info#getUrl', // 校端/局端根据id查询事故详情
  finishAccident: '/accident/finish#post', // 结案
  reportAccident: '/instructReport/add#post' // 添加批示或续报
}
for (const val in accidentApi) {
  accidentApi[val] = `${hostEnv.protal_api_8091}${accidentApi[val]}`
}
export default accidentApi
