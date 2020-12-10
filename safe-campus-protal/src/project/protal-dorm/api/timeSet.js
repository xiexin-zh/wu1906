/**
 * @des 时间设置页面接口
 */

import hostEnv from '@/config/host-env'

const timeSetApi = {
  getCycleList: '/dorm/stat/cycle/detail',
  // getCycleList: '/dorm/stat/cycle/list',
  getWarningSetDetail: '/dorm/warning/set/detail',
  getSignTaskInfoList: '/dorm/signin/task/info/list',
  updateSignTaskInfo: '/dorm/signin/task/info/update',
  updateWarningSet: '/dorm/warning/set/update',
  updateStatCycle: '/dorm/stat/cycle/update'
}

for (const val in timeSetApi) {
  timeSetApi[val] = `${hostEnv.protal_api_11006}${timeSetApi[val]}`
}
export default timeSetApi
