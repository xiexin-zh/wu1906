/**
 * @des 实时查寝接口
 */

import hostEnv from '@/config/host-env'

const realBedApi = {
  getDormRealTime: '/dorm/index/realTime',
  getPersonInfo: '/dorm/index/userinfo', // 获取个人信息
  addSign: '/dorm/signin/info/add', // 补卡,
  addLeave: '/dorm/dorm/vacate/info/add' // 请假
}

for (const val in realBedApi) {
  realBedApi[val] = `${hostEnv.protal_api_11006}${realBedApi[val]}`
}
export default realBedApi
