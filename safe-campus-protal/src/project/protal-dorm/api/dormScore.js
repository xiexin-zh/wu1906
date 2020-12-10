/**
 * @des 宿舍评分
 * @author zhangli
 */

import hostEnv from '@/config/host-env'

const scoreApi = {
  getScoreList: '/dorm/attend/info/score/list#postJsonQuery'
}

for (const val in scoreApi) {
  scoreApi[val] = `${hostEnv.protal_api_11006}${scoreApi[val]}`
}
export default scoreApi
