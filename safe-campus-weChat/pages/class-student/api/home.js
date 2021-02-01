/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index.js'

const parentApi = {
	getParentList: '/parent/children/list#get', // 查询学生家长
	getStudentDetail: '/userinfo/student/user/queryStudentInfoByUserCode#get', // 查询学生详情
	getChangeRecord: '/change/record/query/by/userCode#get', // 获取学生异动记录
	highSchoolStudentList: '/student/manage/list#post', // 高校学生列表
	getHighStudentDetail: '/student/manage/queryStudentInfoByUserCode#get', // 高校查询学生详情
}

for (const val in parentApi) {
	parentApi[val] = `${hostEnv.protal_api_11002}${parentApi[val]}`
}

export default {
	...parentApi,
	getStudentList: `${hostEnv.protal_api_11002}/userinfo/student/user/queryStudentInfoList#post`, // 获取班级学生列表
	getDormRecord: `${hostEnv.protal_api_11006}/dorm/in/history/dorm/change/record#postQuery` // 获取住宿历史
}
