/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let homeApi = {
  getInfoplanList: '/test/plan/getPlanListByCode#post', // 家长考试计划列表
  getInfoList: '/test/info/list#getUrl' ,//详情
  gettestScore:'/test/score/getScoreByUserCode#get'
}
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11012}${homeApi[val]}`
}
export default homeApi