/**
 * @des 家长端模块
 */

import hostEnv from '@config'

let parentApi = {
  childException: '/exception/count/usercode/statist#post', // 家长查看学生异常情况
  childExceptionDetail: '/exception/count/usercode/statist/detail#post', // 学生异常详情
  childRecord: '/accessrecord/child/list#post', // 家长端查看出入记录
  getRealCheck: '/real/check/dorm/user/state/detail#post' // 家长对学生实时查寝
}

for (let val in parentApi) {
  parentApi[val] = `${hostEnv.protal_api_11006}${parentApi[val]}`
}

export default parentApi
