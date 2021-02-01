/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from "../../../config/index.js";

let showApi = {
	// 信息变更
	getChangeListPage: '/changeApplication/page#post', // 获取列表
  getInfoDetail: '/changeApplication/detail#get', // 获取详情
  addChangeData: '/changeApplication/add#post' // 提交申请

};

let highApi = {
	getHighClass: '/class/manage/list#post',
}

let baseApi = {
	getSchoolYear: '/schoolYearSemester/list#postForm',
	getStudentInfo: '/student/manage/detail#get',
	getStudentInfoByCode: '/student/manage/queryStudentInfoByUserCode#get'
}

for (let val in showApi) {
	showApi[val] = `${hostEnv.protal_api_8093}${showApi[val]}`;
}
for (let val in highApi) {
	highApi[val] = `${hostEnv.protal_api_8092}${highApi[val]}`;
}
for (let val in baseApi) {
	baseApi[val] = `${hostEnv.protal_api_11002}${baseApi[val]}`;
}

export default {
	...showApi,
	...highApi,
	...baseApi
};
