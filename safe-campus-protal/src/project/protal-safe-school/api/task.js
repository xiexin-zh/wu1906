/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const taskApi = {
  getMySafeTask: '/safeTask/page#post', // 我的任务列表
  getSafeTask: '/safeTaskTemplate/page#post', // 校端任务下发列表
  delSafeTask: '/safeTaskTemplate/remove#getUrl', // 删除任务
  delSafeTasks: '/safeTaskTemplate/removes#post', // 批量删除任务
  submitMyTask: '/safeTask/submit#putQuery', // 提交或补交
  myTaskDetail: '/safeTask/info#get', // 根据id查询我的任务
  addSchoolTask: '/safeTaskTemplate/school/saveData#post', // 校端新增任务
  getTaskDetail: '/safeTaskTemplate/info#getUrl', // 查看任务详情
  modifySchoolTask: '/safeTaskTemplate/modify#post', // 修改任务
  // reportTaskDetail: '/userAnswers/report/result#get', // 上报结果查看
  reportTaskDetail: '/safeTaskTemplate/report/result#get', // 上报结果查看
  postSchoolTask: '/safeTaskTemplate/school/publish#post', // 校端任务发布
  previewTask: '/safeTaskTemplate/preview#postWithQueryAndBody', // 任务预览
  answerTask: '/safeTask/add/answer#post', // 任务填报
  previewMyTask: '/safeTask/preview#postWithQueryAndBody', // 任务预览
  answerTaskDetail: '/safeTaskQuestion/query/by/taskcode#postQuery', // 安全任务上报内容
  answersTaskStatistics: '/safeTaskTemplate/statistics/by/answers#post', // 查看统计根据答案
  userTaskStatistics: '/safeTaskTemplate/statistics/by/user#post', // 查看统计根据用户
  // schTaskCompleted: '/safeTaskTemplate/query/completed/status/school#post', // 校端查询已完成情况
  schTaskCompleted: '/safeTaskTemplate/school/complete/static#post', // 校端按照完成情况统计
  wechatNotice: '/safeTask/wechat/notice#post', // 微信消息通知  先查人了再调
  planLists: '/safeTask/safetasktime/query/by/code#get' // 查询任务周期
}
for (const val in taskApi) {
  taskApi[val] = `${hostEnv.protal_api_8091}${taskApi[val]}`
}
export default taskApi
