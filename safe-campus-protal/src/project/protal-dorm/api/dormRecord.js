/**
 * @des 宿舍档案
 * @author zhangli
 */

import hostEnv from '@/config/host-env'

const historyApi = {
  getHistoryList: '/dorm/in/history/list#postJsonQuery'
}
for (const val in historyApi) {
  historyApi[val] = `${hostEnv.protal_api_11006}${historyApi[val]}`
}
export default historyApi
