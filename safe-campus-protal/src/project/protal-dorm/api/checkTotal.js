/**
 * @des 查寝统计接口
 */

import hostEnv from '@/config/host-env'

const checkTotalApi = {
  getTaskInfoList: '/dorm/signin/task/info/enable/list',
  getCheckStatisticsList: '/dorm/check/statistics/list', // 查寝统计列表
  getCheckStatisticsDetail: '/dorm/check/statistics/detail', // 查寝统计详情
  getExcList: '/dorm/check/statistics/exc/list', // 获取异常统计列表
  getExcListDetail: '/dorm/check/statistics/exc/detail' // 获取异常统计列表详情
}

for (const val in checkTotalApi) {
  checkTotalApi[val] = `${hostEnv.protal_api_11006}${checkTotalApi[val]}`
}
export default checkTotalApi
