/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let gradeApi = {
	getGradeList: '/grade/manage/list#postForm', //
	getClassList: '/classManage/list#post', // 获取班级
}
let showApi = {
	addHomework: '/homework/add#post', // 发布作业
	getHomeworkList: '/homework/list#post', // 作业列表
	getHomeworkDetail: '/homework/detail#getUrl', // 作业详情
	addUnSubmit: '/homework/addHomeworkUnSubmit#post', //标注未交学生
	getUnSubmitStatistics: '/homework/findHomeworkUnsubmitCount#post', //班级作业统计
	getUnSubmitList: '/homework/findHomeworkUnsubmit#post', //学生未交作业列表
}

for (let val in gradeApi) {
	gradeApi[val] = `${hostEnv.protal_api_11002}${gradeApi[val]}`
}
for (let val in showApi) {
	showApi[val] = `${hostEnv.protal_api_11009}${showApi[val]}`
}

export default {
	...gradeApi,
	...showApi
}
