/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const libraryApi = {
  // 参数微信配置
  addWechat: '/wechatConfig/add#post', // 添加微信参数配置
  pageWechat: '/wechatConfig/page#post', // 微信参数配置查询列表
  removeWechat: '/wechatConfig/remove/#getUrl', // 根据ID删除微信参数配置
  removeWechats: '/wechatConfig/removes#post', // 批量删除微信参数配置
  updateWechats: '/wechatConfig/update#post', // 编辑微信参数配置
  sendNote: '/wechatMessage/send#post', // 发送微信消息
  // 参数短信配置
  addmsgConfig: '/msgConfig/add#post', // 添加短信参数配置
  pagemsgConfig: '/msgConfig/page#post', // 短信参数配置查询列表
  removemsgConfig: '/msgConfig/remove/#getUrl', // 根据ID删除短信参数配置
  removemsgConfigs: '/msgConfig/removes#post', // 批量删除短信参数配置
  updatemsgConfig: '/msgConfig/update#post', // 编辑短信参数配置
  // 模板类型
  addTempType: '/messageTemplateType/add#post', // 添加消息模板类型
  pageTempType: '/messageTemplateType/page#post', // 模板配置查询列表
  removeTempType: '/messageTemplateType/remove#getUrl', // 根据ID删除消息模板类型
  removeTempTypes: '/messageTemplateType/removes#post', // 批量删除消息模板类型
  TempTypeBymsg: '/messageTemplateType/getList/#getUrl', // 根据消息类型获取模板类型集合

  // 模板参数配置'1'-短信消息 '2'-微信消息
  addTemplate: '/messageTemplateConfig/add#post', // 添加模板配置
  pageTemplate: '/messageTemplateConfig/page#post', // 模板配置查询列表
  removeTemplate: '/messageTemplateConfig/remove#getUrl', // 根据ID删除模板配置
  removeTemplates: '/messageTemplateConfig/removes#post', // 批量删除模板配置
  updateTemplate: '/messageTemplateConfig/update#post', // 编辑模板配置

  // 使用关系'1'-短信消息 '2'-微信消息
  addUse: '/messageUsedRelationship/add#post', // 添加使用关系
  pageUse: '/messageUsedRelationship/page#post', // 使用关系查询列表
  removeUse: '/messageUsedRelationship/remove#getUrl', // 根据ID删除使用关系
  removeUses: '/messageUsedRelationship/removes#post' // 批量删除消息模板类型

}
for (const val in libraryApi) {
  libraryApi[val] = `${hostEnv.protal_api_10086}${libraryApi[val]}`
}
export default libraryApi
