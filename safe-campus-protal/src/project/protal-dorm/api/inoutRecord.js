/**
 * @des 出入记录
 * @author zhangli
 */

import hostEnv from '@/config/host-env'

const recordApi = {
  getRecordList: '/dorm/access/record/list#postJsonQuery'
}

for (const val in recordApi) {
  recordApi[val] = `${hostEnv.protal_api_11006}${recordApi[val]}`
}
export default recordApi
