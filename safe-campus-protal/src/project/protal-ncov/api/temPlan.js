/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@/config/host-env'

const temPlanApi = {
  saveorUpdate: '/thermometry/plan/saveorupdate#post', // 更新保存测温计划
  getplanList: '/thermometry/plan/queryplan#get', // 查询测温计划列表
  gettimeList: '/thermometry/plan/queryTimeByCode#getWithPara', // 测温计划时间段
  getqueryList: '/plan/record/query/By/SchoolCodeAndDate#get', // 测温计划
  //设备
  getmanageList: '/device/management/list#postQuery', //列表
  delDevice: '/device/management/delete#delQuery', //删除
  updateDevice: '/device/management/save/and/update#post', //保存
}
for (const val in temPlanApi) {
  temPlanApi[val] = `${hostEnv.protal_api_11005}${temPlanApi[val]}`
}
export default temPlanApi