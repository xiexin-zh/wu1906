/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const taskApi = {
  addTask: '/safeTaskTemplate/edu/saveData#post', // 局端新增任务
  getTaskDetail: '/safeTaskTemplate/info#getUrl', // 查看任务详情
  modifySchoolTask: '/safeTaskTemplate/modify#post', // 修改任务
  getTaskList: '/safeTaskTemplate/edu/list#post', // 局端任务下发列表
  previewTask: '/safeTaskTemplate/preview#postWithQueryAndBody', // 任务预览
  myTaskDetail: '/safeTask/info#get', // 根据id查询我的任务

  // 完成情况

  eduCompleteStatic: '/safeTaskTemplate/edu/complete/static#post', // 局端按照完成情况统计
  eduTaskCompleted: '/safeTaskTemplate/query/completed/status#post', // 局端查询已完成情况
  planLists: '/safeTask/safetasktime/query/by/code#get', // 查询任务周期

  wechatNotice: '/safeTask/wechat/notice#post', // 微信消息通知  先查人了再调
  reportTaskDetail: '/safeTaskTemplate/report/result#get', // 上报结果查看
  repulse: '/safeTask/repulse#post', // 打回
  rewrite: '/safeTask/rewrite#post', // 重填

  // 统计
  seeStatisticsLists: '/safeTaskQuestion/query/by/taskcode#postJsonQuery', // 查看统计所有条数题目
  answersInfo: '/safeTaskTemplate/statistics/by/answers#post', // 查看统计根据答案
  statisticsUserInfo: '/safeTaskTemplate/statistics/by/user#post', // 查看统计根据用户
  // seeStatistics: '/safeTaskTemplate/statistics#post', // 查看统计单条数据
  // 删除
  removeTask: '/safeTaskTemplate/remove/#getUrl', // 删除任务模板
  removeTaskAll: '/safeTaskTemplate/removes#post', // 批量删除任务模板
  // 发布任务
  getJobAll: '/edu/job/manage/queryjob/by/educode/and/definded#get', // 根据机构编码查询岗位获取预设岗位  限定职务基础数据
  taskPublish: '/safeTaskTemplate/edu/publish#post', // 任务发布
  testTask: '/safeTask/test/#getUrl' // 生成任务
  // schoolorJobSearchPeople: '/userjob/query/by/schoolcodes/and/jobnames#post' // 根据机构编码查询岗位获取预设岗位  限定职务基础数据
}

for (const val in taskApi) {
  taskApi[val] = `${hostEnv.protal_api_8091}${taskApi[val]}`
}
export default taskApi
