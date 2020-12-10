/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from './host-env.js'
let taskApi = {
	addTaskApprais: '/homeworkAppraisInfo/addAndUpdate#post', // 新增作业评优
	getTaskList: '/homeworkInfo/getPageList#post#false', // 获取作业列表
	addUpdateTask: '/homeworkInfo/addAndUpdateHomework#post#false', // 新增更新作业
	getTaskDetail: '/homeworkInfo/getHomeworkIfoByCode#get', // 获取作业详情
	delTask: '/homeworkInfo/remove#getUrl#false', // 删除作业
	submitTask: '/studentHomeworkInfo/submitHomework#post#false', // 提交作业
	reviewTask: '/homeworkReviewInfo/add#post#false', // 点评作业
	delReviewTask: '/homeworkReviewInfo/remove#getUrl', // 删除点评信息
	getTaskTotal: '/studentHomeworkInfo/getHomeworkStatInfo#postForm', // 作业统计
	seeTaskTotal: '/studentHomeworkInfo/getHomeworkStudentInfo#postForm', // 查看作业是否已看或提交数据
}
for (let val in taskApi) {
	taskApi[val] = `${hostEnv.protal_api_18090}${taskApi[val]}`
}
export default taskApi
