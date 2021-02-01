/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index.js'

let gradeApi = {
  getClassListByTeacher: '/userinfo/teacher/user/classinfo#get', // 获取班级
}
let showApi = {
	addNewMoment: '/moments/add#post', // 发布动态
	getMomentList: '/moments/list#post', //获取班级动态
	deleteMoment: '/moments/delete#delWithQuery', //删除动态
	addLike: '/moments/addMomentsLike#post', //点赞
	deleteLike: '/moments/deleteMomentsLike#delWithQuery', //取消点赞
	addComment: '/moments/addMomentsComment#post', //评论
	deleteComment: '/moments/deleteMomentsComment#delWithQuery', //删除评论
	getUnReadList: '/moments/findUnReadList#post', //未读评论消息列表
	getMomentDetail: '/moments/detail#getUrl', //动态详情
}

for (let val in gradeApi) {
  gradeApi[val] = `${hostEnv.protal_api_11002}${gradeApi[val]}`
}
for (let val in showApi) {
  showApi[val] = `${hostEnv.protal_api_11009}${showApi[val]}`
}

export default {
  ...gradeApi,
	...showApi,
	delFile: `${hostEnv.protal_api_11009}/study/theme/file/delete#delWithQuery` // 文件删除
}