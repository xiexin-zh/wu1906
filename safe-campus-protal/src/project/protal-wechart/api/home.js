/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const noticeApi = {
  getTemplateList: '/noticeTemplateInfo/page#post', // 获取模板列表
  delTemplate: '/noticeTemplateInfo/remove#getUrl', // 删除模板信息
  addTemplate: '/noticeTemplateInfo/add#post', // 添加模板信息
  modifyTemplate: '/noticeTemplateInfo/modify#post' // 修改模板信息
}
for (const val in noticeApi) {
  noticeApi[val] = `${hostEnv.protal_api_18090}${noticeApi[val]}`
}
export default noticeApi
