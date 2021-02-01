/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index'

let homeApi = {
  getRiskIdentify: '/riskIdentification/page#post', // 风险辨识分页条件查询
  getRiskAssess: '/riskAssessment/page/mobile#post', // 移动端-风险评估分页条件查询
  riskCategory: '/riskTemplate/category#get', // 风险清单分类列表
  riskModelList: '/riskTemplate/page#post', // 风险清单条件分页查询
  addRiskIdentify: '/riskIdentification/add#post', // 风险辨识新增
  riskIdentifyDetail: '/riskIdentification/info#getUrl', // 根据id查风险辨识详情
  modifyRiskIdentify: '/riskIdentification/modify#post', // 风险辨识修改
  delRiskIdentify: '/riskIdentification/remove#getUrl', // 风险辨识删除
  publishRiskIdentify: '/riskIdentification/publish#getUrl', // 风险辨识发布
}
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_8091}${homeApi[val]}`
}
export default homeApi
