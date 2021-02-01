/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index.js'

let showApi = {
	// 校园概况
	getSchoolShow: '/school/introduction/detail#getUrl', // 校园概况查询
	getSchoolShowFile: '/school/introduction/file/getFileBySchoolCode#getUrl', // 校园概况附件查询
	addSchoolShow: '/school/introduction/add#post', // 校园概况新增
	editSchoolShow: '/school/introduction/update#post', // 校园概况编辑
	delFile: '/school/introduction/file/deleteByUrl#delWithQuery' // 文件删除
}

for (let val in showApi) {
  showApi[val] = `${hostEnv.protal_api_11009}${showApi[val]}`
}

export default {
	...showApi,
}