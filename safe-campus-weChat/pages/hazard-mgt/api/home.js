/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../config/index'

let homeApi = {
  getDangerIndex: '/mobile/danger/list#post', // 隐患纪录
  // 隐患小组
  getGroupDetail: '/danger/group/info#get', // 隐患小组详情
  reportDanger: '/mobile/danger/add#post', // 移动端上报隐患

  // 隐患分类
  addGroupClass: '/dangerCategory/add#get', // 隐患分类新增
  modifyGroupClass: '/dangerCategory/modify#get', // 隐患分类修改
  getGroupClass: '/dangerCategory/page#post', // 隐患分类列表
  delGroupClass: '/dangerCategory/remove#getUrl', // 隐患分类根据id删除
  delsGroupClass: '/dangerCategory/removes#post', // 隐患分类根据id批量删除
  // 隐患发现
  
  createDanger: '/dangerTask/add/daily#post', // 校端-安全档案-生成隐患
  assignDanger: '/dangerTask/assign#post', // 隐患指派
  delDanger: '/dangerTask/cancel#post', // 隐患撤销
  checkDanger: '/dangerTask/check#post', // 隐患验收
  exportDanger: '/dangerTask/export#post', // 导出隐患详情
  dealDanger: '/dangerTask/handle#post', // 隐患处理
  dangerDetail: '/dangerTask/info#getUrl', // 隐患详情
  getDanger: '/dangerTask/page#post', // 隐患列表
  superviseDanger: '/dangerTask/supervise#post', // 隐患督办
  transferDanger: '/dangerTask/transfer#post', // 隐患转派
  getDangerInfo: '/dangerTask/info#getUrl'
  
}
for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_8091}${homeApi[val]}`
}
export default homeApi
