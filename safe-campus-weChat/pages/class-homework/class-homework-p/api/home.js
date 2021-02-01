/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let showApi = {
	getHomeworkList: '/homework/findChildrenHomework#post', // 作业列表
	getHomeworkDetail: '/homework/findChildrenHomeworkDetails#post', // 每日作业
	getDetail: '/homework/detail#getUrl', // 作业详情
	getHomeworkStatistics: '/homework/findChildrenHomeworkCount#post', //学生作业统计
	getUnSubmitList: '/homework/findUnsubmitHomeworkCountDetails#post', //学生未交作业详情列表
}

for (let val in showApi) {
  showApi[val] = `${hostEnv.protal_api_11009}${showApi[val]}`
}


export default {
  ...showApi
}