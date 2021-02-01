/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index.js'

const parentApi = {
	getParentList: '/parent/children/queryMainParent#get', // 查询主要家长
	highSchoolStudentList: '/student/manage/list#post', // 高校学生列表
}

for (const val in parentApi) {
	parentApi[val] = `${hostEnv.protal_api_11002}${parentApi[val]}`
}

export default {
	...parentApi,
	getStudentList: `${hostEnv.protal_api_11002}/student/class/list#post`, // 获取班级学生列表
}
