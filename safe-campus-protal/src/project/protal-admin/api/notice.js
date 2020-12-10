/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const noticeApi = {
  addNotice: '/noticeInfo/platform/add#post', // 添加公告
  delNotice: '/noticeInfo/platform/delete/by/id#delQuery', // 删除公告
  searchNotice: '/noticeInfo/platform/list/by/condition#post', // 查询公告
  updateNotice: '/noticeInfo/platform/update#post' // 更新公告
}
for (const val in noticeApi) {
  noticeApi[val] = `${hostEnv.protal_api_10054}${noticeApi[val]}`
}
export default noticeApi
