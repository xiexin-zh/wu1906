/**
 * @des 平台消息接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const holiday = {
  getHolidayList: '/canpointHoliday/list#get', // 获取节假日列表
  modifyHoliday: '/canpointHoliday/modify#post', // 修改节假日
  isHoliday: '/canpointHoliday/todayIsHoliday#post' // 是否节假日
}
for (const val in holiday) {
  holiday[val] = `${hostEnv.protal_v3_11101}${holiday[val]}`
}
export default holiday
