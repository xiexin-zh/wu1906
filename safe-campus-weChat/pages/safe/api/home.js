/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index'

let homeApi = {
  getSafeIndex: '/mobile/index#get', // 手机端首页统计待完成，已完成，待完成的数量
  getStaticArea: '/mobile/task/static/area#get', // 按区域统计
  getStaticUser: '/mobile/task/static/user#get', // 按人员统计
  getAreaList: '/mobile/task/static/area/task/list#post', // 按区域统计任务列表
  getUserList: '/mobile/task/static/user/task/list#post', // 按人员统计任务列表
  getCompleteTask: '/mobile/task/complete#post', // 任务巡查
  getMyTask: '/mobile/my/task#getUrl', // 任务详情
  getTaskResult: '/mobile/my/task/result#getUrl', // 任务结果详情
  getAllSchedule: '/mobile/scheduling#get', // 巡检排班
  getMySchedule: '/mobile/my/scheduling#get', // 我的巡查排班
  getMyTaskStatic: '/mobile/my/task/static#get', // 我的任务
  getScanTask: '/mobile/my/scheduling/scancode#get' // 扫码巡检
  
}
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_8091}${homeApi[val]}`
}
export default homeApi
