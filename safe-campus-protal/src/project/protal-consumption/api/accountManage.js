/**
 * @des 账户管理模块接口
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const accountApi = {
  getUserInfoByCard: '/accountInfo/checkCardAccount#getUrl', // 通过卡id查询人员信息
  getAccountList: '/accountInfo/list#get', // 账户列表
  getTeacherAccountList: '/accountInfo/listTeacher#get', // 已开户教职工列表
  getStudentAccountList: '/accountInfo/listStudent#get', // 已开户学生列表
  getRechargeList: '/recharge/list#get', // 查询充值记录
  addRecharge: '/accountInfo/accountRecharge#post', // 新增充值记录
  getSubsidyList: '/subsidyManage/list#get', // 补助管理
  getSubsidyDetail: '/subsidyManage#getUrl', // 补助详情
  subsidyInfoList: '/subsidyPeople/list#get', // 补助发放名单
  getSubsidyPerNum: '/subsidyManage/getSubsidyPerNum#post', // 获取选择班级/机构+人员的账户人数
  getOpenAccount: '/accountInfo/isOpenAccount#getUrl', // 查询学生开户信息
  getTeaOpenAccount: '/accountInfo/isTeacherOpenAccount#getUrl', // 查询教职工开户信息
  addOpenAccount: '/accountInfo/openAccount#post', // 开户
  grantSubsidy: '/subsidyManage/grantSubsidy#post', // 发放补助
  saveSubsidy: '/subsidyManage/saveSubsidy#post', // 延期发放补助
  immedGrantSubsidy: '/subsidyManage/immedGrant#postWithQueryAndBody', // 立即发放补助
  deleteSubsidy: '/subsidyManage#delWithQuery', // 删除补助管理
  getAccountRecord: '/accountRecords/list#get', // 查询账户操作记录
  exportAccountRecord: '/accountRecords/export#export', // 导出操作记录
  importTemplate: '/accountInfo/importTemplate#export', // 下载开户模板

  editAccount: '/accountInfo#putJson', // 修改账户信息
  getAccountDetail: '/accountInfo#getUrl', // 获取账户信息详细信息
  getReturnBalance: '/accountInfo/queryReturnBalance#getUrl', // 获取账户可退余额
  accountSubsidy: '/accountInfo/accountSubsidy#post', // 账户发放补助
  accountFrozen: '/accountInfo/accountFrozen#post', // 账户冻结
  accountThaw: '/accountInfo/accountThaw#post', // 账户解冻
  accountClear: '/accountInfo/accountClear#post', // 账户余额清零
  accountCancel: '/accountInfo/accountCancel#post' // 账户销户
}
for (const val in accountApi) {
  accountApi[val] = `${hostEnv.protal_api_11031}${accountApi[val]}`
}
export default accountApi
