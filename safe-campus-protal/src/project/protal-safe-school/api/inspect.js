/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const inspectApi = {
  // 安全巡检
  getInspectList: '/inspectionArea/page#post', // 巡检区域列表
  addInspect: '/inspectionArea/add#post', // 保存巡检区域
  updateInspect: '/inspectionArea/modify#post', // 修改巡查区域
  getItemTree: '/item/tree#get', // 获取预设项树
  delInspect: '/inspectionArea/remove#getUrl', // 根据id删除巡查区域
  delInspects: '/inspectionArea/removes#post', // 根据id集合批量删除巡查区域
  inspectDetail: '/inspectionArea/info#getUrl', // 巡查区域详情
  // 日常巡检 设备巡检 安全护导
  addDailyTask: '/taskTemplate/add#post', // 新增日常巡查
  addDeviceTask: '/taskTemplate/add/device/check#post', // 新增设备巡查
  addSafeTask: '/taskTemplate/add/safe/check#post', // 新增安全护导
  changeTask: '/taskTemplate/changestate#get', // 日常巡查/设备巡查/安全护导-启用/禁用
  getAllTaskDetail: '/taskTemplate/info#getUrl', // 日常巡查/设备巡查/安全护导详情
  updateDailyTask: '/taskTemplate/modify#post', // 修改日常巡查
  updateDeviceTask: '/taskTemplate/modify/device#post', // 修改设备巡检
  updateSafeTask: '/taskTemplate/modify/safe#post', // 修改安全护导
  getTaskList: '/taskTemplate/page#post', // 日常巡查/设备巡查/安全护导列表
  delTask: '/taskTemplate/remove#getUrl', // 删除日常巡查/设备巡查/安全护导
  delTasks: '/taskTemplate/removes#post', // 批量删除日常巡查/设备巡查/安全护导
  getInspectionArea: '/inspectionArea/query/by/tasktypecode#postForm', // 根据任务类型编码查询区域信息
  getTaskRecord: '/taskTemplate/task/list#post', // 巡检记录
  changeTasks: '/taskTemplate/bat/changestate#post', // 日常巡查/设备巡查/安全护导-批量启用/禁用
  taskResultDetail: '/userTask/resultdetail#getUrl', // 任务结果详情
  // 规避时间设置
  getHoliday: '/holiday/list#post', // 法定节假日列表
  extraDateList: '/dateExclude/list#get', // 例外时间列表
  addExtraDate: '/dateExclude/add#post', // 例外时间新增
  delExtraDate: '/dateExclude/remove#getUrl', // 例外时间删除
  holidayBindTask: '/holidayTask/add#post', // 假日绑定任务
  weekBindTask: '/weekTask/add#post', // 星期绑定任务
  getWeekTask: '/weekTask/task#get', // 查询绑定任务的星期
  getHolidayTask: '/holiday/task#get', // 查询绑定任务的法定节假日
  getBindTask: '/holidayTask/query#postForm', // 查询绑定的任务
  delHolidayTask: '/holiday/remove#postForm', // remove假期
  delWeekTask: '/weekTask/remove#get', // remove星期
  getWeekBind: '/weekTask/query#get', // 查询星期绑定的任务
  allWeekBind: '/weekTask/adds#post', // 星期绑定任务
  allHolidayBind: '/holidayTask/adds#post', // 节假日全选
  // 巡查值班
  getDuty: '/patrol/page#post', // 校端巡查值班分页条件查询
  getDutyDetail: '/patrol/info#getUrl', // 校端根据id查询巡查详情
  getDutyPoint: '/patrol/result#getUrl', // 获取巡查点
  delDutyPoint: '/patrol/remove#getUrl', // 根据id删除巡查记录
  delsDutyPoint: '/patrol/remove/batch#post' // 批量删除巡查记录
}
for (const val in inspectApi) {
  inspectApi[val] = `${hostEnv.protal_api_8091}${inspectApi[val]}`
}
export default inspectApi
