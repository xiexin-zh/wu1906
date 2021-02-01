/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let visitorApi = {
  getInfoDetail: '/respondentinfo/queryByUserCodeAndName#get', // 查询受访人权限
}
for (let val in visitorApi) {
  visitorApi[val] = `${hostEnv.protal_api_10160}${visitorApi[val]}`
}

export default visitorApi