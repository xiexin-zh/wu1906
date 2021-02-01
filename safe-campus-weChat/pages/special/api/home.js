/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index'

let homeApi = {
  getSpecialList: '/specialTask/page/mobile#post', // 移动端分页条件查询任务列表
  getSpecialDetail: '/specialTask/info#getUrl', // 局端/校端查看任务详情
  getGroupDetail: '/danger/group/info#get', // 隐患小组详情
  reportDanger: '/dangerTask/add/special/mobile#post', // 专项检查-移动端上报隐患
  checkSpecial: '/specialTask/modify#post' // 校端/局端自查/审核/督察
  
}
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_8091}${homeApi[val]}`
}
export default homeApi
