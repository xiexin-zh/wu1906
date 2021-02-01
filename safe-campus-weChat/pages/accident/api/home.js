/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index'

let homeApi = {
  getAccidentList: '/accident/page/mobile#post', // 移动端分页条件查询事故列表
  getAccidentDetail: '/accident/info/mobile#getUrl', // 移动端根据id查询事故详情
  addAccident: '/accident/add#post', // 添加事故
  reportAccident: '/instructReport/add#post', // 添加批示或续报
  finishAccident: '/accident/finish#post' // 结案

}
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_8091}${homeApi[val]}`
}
export default homeApi