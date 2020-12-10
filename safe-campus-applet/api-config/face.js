
/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from './host-env.js'
let faceApi = {
	updatePhoto: '/userinfo/update/photo#post#false' ,// 更新人脸
}
for (let val in faceApi) {
	faceApi[val] = `${hostEnv.protal_api_11002}${faceApi[val]}`
}
export default faceApi

