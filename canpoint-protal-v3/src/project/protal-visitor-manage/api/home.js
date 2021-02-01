/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const Api = {
  visitorRecord: `/invite/appoint/list#post`, // 访客记录
  initCause: `/cause/info/init#post`, // 初始化来访事由
  getCauseList: `/cause/info/list#post`, // 查询来访事由
  addCause: `/cause/info/add#post`, // 添加来访事由
  deletaCause: `/cause/info/delete#get`, // 删除来访事由
  getCurrentList: `/setting/device/info/query#post`, // 获取通行设备
  bindCurrentDevice: `/setting/device/info/add#post`, // 绑定通行设备
  delCurrentDevice: `/setting/device/info/del#delete`, // 删除设备
  getSetList: `/respondentinfo/list#post`, // 被访权限
  bindSet: `/respondentinfo/manage/batchAdd#post`, // 绑定权限
  deleteSetUser: `/respondentinfo/manage/delete#get`, // 删除被访权限
  visitorUser: `/invite/appoint/list#post`, // 访客列表
  appointToday: `/invite/appoint/visitor/appoint/count#get`, // 进入预约列表
  visitorToday: `/invite/appoint/visitor/count#get`, // 今日访客
  getLast30: `/signboard/appoints/nearly30days/count#get` // 获取近30天的访客
}
for (const val in Api) {
  Api[val] = `${hostEnv.protal_v3_10160}${Api[val]}`
}
export default Api
