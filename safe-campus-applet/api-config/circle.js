/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from './host-env.js'
let circleApi = {
	addNewMoment: '/moments/add#post', // 发布动态
	getMomentList: '/moments/list#post', //获取班级动态
	deleteMoment: '/moments/delete#del', //删除动态
	addLike: '/moments/addMomentsLike#post', //点赞
	deleteLike: '/moments/deleteMomentsLike#del', //取消点赞
	addComment: '/moments/addMomentsComment#post', //评论
	deleteComment: '/moments/deleteMomentsComment#del', //删除评论
	getUnReadList: '/moments/findUnReadList#post', //未读评论消息列表
	getMomentDetail: '/moments/detail#getUrl', //动态详情
}

for (let val in circleApi) {
  circleApi[val] = `${hostEnv.protal_api_11009}${circleApi[val]}`
}

export default circleApi
