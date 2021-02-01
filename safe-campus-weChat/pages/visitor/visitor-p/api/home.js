/**
 * @description 接口列表主模块
 * @params get, getUrl(参数直接拼接在url斜杠后面), post(JSON数据提交), postForm(表单数据提交)
 * @params false: 请求没有加载提示，默认有
 */
import hostEnv from '../../../../config/index.js'

let homeApi = {
  getSchoolList: '/visitor/info/schoolinfo/list#get', // 获取家长绑定学校列表
  verifUser: '/visitor/info/rescode#get', // 验证被访用户
  getCauseList: '/cause/info/list#post', // 获取事由列表
  getComeLogList: '/invite/appoint/mobile/visit/list#post', // 获取拜访记录列表
  getComeLogDetail: '/invite/appoint/mobile/visit/detail#getUrl', // 获取拜访记录详情
  getInviteList: '/invite/appoint/mobile/appoints#post', // 获取邀预约记录列表
  getInviteDetail: '/invite/appoint/mobile/appoints#getUrl', // 获取邀预约记录详情
  addInviteInfo: '/invite/appoint/mobile/add#post', // 添加修改邀预约信息
  approval: '/invite/appoint/update#post', // 审批邀预约信息
  cancelAppoint: '/invite/appoint/mobile/appoints/cancel#get', // 邀预约撤回
}

for (let val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_10160}${homeApi[val]}`
}

export default homeApi