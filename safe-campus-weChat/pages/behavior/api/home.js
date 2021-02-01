/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index'

let homeApi = {
  getBehaviorIndex: '/appraise/item/list#postWithQuery', // 指标列表情口
  addBehavior: '/appraise/add#post', // 新增评价
  getBehaviorDetail: '/appraise/detail#getUrl', // 评价详情
  getBehaviorList: '/appraise/list#post', // 评价列表查询
  getIsAuthorize: '/appraise/item/user/isAuthorize#getUrl', // 查询某人是否又指标授权
  delBehavior: '/appraise/delete#del', // 删除评价
}
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11012}${homeApi[val]}`
}
export default homeApi
