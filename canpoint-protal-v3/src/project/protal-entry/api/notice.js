/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const noticeApi = {
  searchPersonNotice: '/notice/user/query/person/plateform/notice#post', // 查询个人接受的消息
  searchNotice: '/noticeInfo/platform/list/by/condition#post', // 查询公告
  readPersonNotice: '/notice/user/read#post'
}
for (const val in noticeApi) {
  noticeApi[val] = `${hostEnv.protal_api_10054}${noticeApi[val]}`
}
export default noticeApi
