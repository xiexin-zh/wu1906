/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let showApi = {
	// 课表管理
	getClassNum: '/class/set/list#get', // 获取课节时段或课节数
	getClassList: '/class/schedule/list#post', // 获取班级的课表

	// 课时管理
	getCourseList: '/class/hour/list#get', // 学校课时上下课时间查询
}

for (let val in showApi) {
  showApi[val] = `${hostEnv.protal_api_11014}${showApi[val]}`
}

export default {
	...showApi
}