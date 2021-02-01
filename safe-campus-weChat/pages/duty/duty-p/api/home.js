/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let homeApi = {
  addDuty: '/on/duty/add#post', // 新增值日信息
  getdutyList: '/on/duty/list#get', // 用户值日列表信息
  updateDuty: '/on/duty/update#putJson', // 更新值日信息
  getParenttdutyList: '/on/duty/list/parent#get', // 家长查看值日信息

}

for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11009}${homeApi[val]}`
}


export default homeApi