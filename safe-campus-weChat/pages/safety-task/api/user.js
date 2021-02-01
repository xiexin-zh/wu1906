/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index'
// import hostEnv from '../../../../config/index.js'

let userApi = {
  getSafetask: '/safeTask/query/safetask#post' ,// 学生信息列表查询 
	myTaskDetail: '/safeTask/info#get', // 根据id查询我的任务
	answerTask: '/safeTask/add/answer#post', // 任务填报
	previewMyTask: '/safeTask/preview/#postWithQueryAndBody', //任务预览
	submitMyTask: '/safeTask/submit#putWithQueryAndBody', // 提交或补交
	// getTaskIssued: '/safeTaskTemplate/query/user/publish/safetask#post', // 移动端查看发布的任务列表
	getTaskIssued: '/safeTaskTemplate/page#post', // 移动端查看发布的任务列表
	getTaskDetail: '/safeTaskTemplate/info#getUrl', // 查看任务详情
	postSchoolTask: '/safeTaskTemplate/school/publish#post', // 校端任务发布
	planLists: '/safeTask/safetasktime/query/by/code#get', // 查询任务周期
	schTaskCompleted: '/safeTaskTemplate/school/complete/static#post', // 校端按照完成情况统计
	reportTaskDetail: '/safeTaskTemplate/report/result#get', // 上报结果查看
	wechatNotice: '/safeTask/wechat/notice#post', // 微信消息通知  先查人了再调
}
const teachersApi = {
  getTeachers: '/userinfo/teacher/user/batch/query/usertype#post' // 获取教职工信息列表  确定要通知该学校相关负责人去处理该任务？
}
for (const val in teachersApi) {
  teachersApi[val] = `${hostEnv.protal_api_11002}${teachersApi[val]}`
}
for (let val in userApi) {
  userApi[val] = `${hostEnv.protal_api_8091}${userApi[val]}`
}
const taskApi = {
  ...userApi,
  ...teachersApi
}
export default taskApi
