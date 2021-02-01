/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let showApi = {
	sendMessage: '/chat/record/sendTextMess#post', // 发送消息
	sendVideo: '/chat/record/sendMediaFilesMess#post', // 发送视频
	getMessageList: '/chat/record/getUnreadByUserCode#get' // 聊天记录
}

for (let val in showApi) {
  showApi[val] = `${hostEnv.protal_api_11009}${showApi[val]}`
}


export default {
  ...showApi
}