/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const setApi = {
  // 系统设置
  getTmpInfo: '/temperature/base/detail#getUrl', // 获取体温设置列表
  updateTmp: '/temperature/base/add#post', // update体温设置
  getDocInfo: '/school/doctor/detail#getUrl', // 获取校医列表
  addDoc: '/school/doctor/add#post', // 批量设置校医
  unBindDoc: '/school/schooldoctorinfo/deleteById#delete', // 通过id删除校医设置信息
  getNoticerInfo: '/noticer/list#postJsonQuery', // 发热通知列表
  updateNoticer: '/noticer/save/data#post', // 发热通知更新
  // 测温计划
  updateTmpPlan: '/thermometry/plan/saveorupdate#post', // 更新保存测温计划
  getTmpPlan: '/thermometry/plan/queryplan#get', // 查询测温计划列表
  // gettimeList: '/thermometry/plan/queryTimeByCode#getWithPara', // 测温计划时间段
  // getqueryList: '/plan/record/query/By/SchoolCodeAndDate#get', // 测温计划
  getTmpEquip: '/device/management/list#postQuery', // 测温设备列表
  unBindTmpEquip: '/device/management/delete#delQuery', // 解绑设备
  bindTmpEquip: '/device/management/save/and/update#post' // 绑定设备

}
for (const val in setApi) {
  setApi[val] = `${hostEnv.protal_v3_11005}${setApi[val]}`
}
export default setApi
