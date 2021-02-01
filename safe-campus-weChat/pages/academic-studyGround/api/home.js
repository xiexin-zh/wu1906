/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from "../../../config/index.js";

let showApi = {
	// 学习园地
	addNewStudy: "/studyGarden/garden/add#post", // 新增资料
	detailStudy: "/studyGarden/garden/info#get", // 资料详情
	getStudyList: "/studyGarden/garden/page/mobile#post", // 资料列表

};

let highApi = {
	getHighClass: '/class/manage/list#post',
}

let baseApi = {
	getSchoolYear: '/schoolYearSemester/list#postForm'
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
