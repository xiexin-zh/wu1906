/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from './host-env.js'
let noticeApi = {
	replyNoticeStatus: '/noticeConfirmInfo/submitReceiptMsg#postForm#false', // 反馈通知状态
	getNoticeStatusUser: '/noticeConfirmInfo/getNoticeUserStatusInfo#postForm', // 获取已读未读，已回执为回执
	getTemplateInfo: '/noticeTemplateInfo/info#getUrl#false', // 获取模板信息
	delNoticeTem: '/noticeTemplateInfo/remove#getUrl#false', // 删除模板
	addNoticeTem: '/noticeTemplateInfo/add#post#false', // 保存我的模板
	createNotice: '/noticeInfo/addNoticeInfo#post#false', // 发布通知公告
	delNotice: '/noticeInfo/remove#getUrl#false', // 删除通知
	getNoticeList: '/noticeInfo/page#post#false', // 获取通知列表
	getNoticeDetail: '/noticeInfo/getNoticeInfo#get', // 获取通知明细
	getClassSpace: '/classSpaceInfo/page#postForm#false', // 获取班级空间
	getNoticeTem: '/noticeTemplateInfo/page#post#false' // 获取通知模板
}
for (let val in noticeApi) {
	noticeApi[val] = `${hostEnv.protal_api_18090}${noticeApi[val]}`
}
export default noticeApi
