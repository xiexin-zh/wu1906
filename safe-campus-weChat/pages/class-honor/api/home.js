/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index.js'

let showApi = {
  getClassHonorList: '/class/honor/list#post', // 查询班级荣誉列表
	getClassHonorDetail: '/class/honor/detail#getUrl', // 查询班级荣誉详情
	addClassHonor: '/class/honor/add#post', // 添加班级荣誉
	editClassHonor: '/class/honor/update#putJson' // 修改班级荣誉
}

for (let val in showApi) {
  showApi[val] = `${hostEnv.protal_api_11009}${showApi[val]}`
}

export default {
  ...showApi,
	delFile: `${hostEnv.protal_api_11009}/study/theme/file/delete#delWithQuery` // 文件删除
}