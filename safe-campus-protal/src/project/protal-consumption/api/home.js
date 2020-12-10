/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  getCount: '/homeStatistics/tradeTypeStatistics#postQuery', // 首页数据统计
  getDynamic: '/homeStatistics/queryStatisticsByOneMouth#postQuery', // 首页消费动态图

  getDictList: '/dict/data/list#get', // 数据字典

  getMachineList: '/consumerMachine/list#get', // 消费机设备列表查询
  editMachine: '/consumerMachine#putJson', // 修改消费机
  editMachineIsOpen: '/consumerMachine/editIsOpen#postQuery', // 启动关闭消费机
  getDetailMachine: '/consumerMachine#getUrl', // 消费机详情

  getStallList: '/windowManage/list#get', // 档口列表查询
  addNewStall: '/windowManage#post', // 新增档口
  editStall: '/windowManage#putJson', // 修改档口
  deleStall: '/windowManage#delWithQuery', // 删除档口

  getBlackList: '/FaceBlacklist/list#get', // 黑名单列表查询
  addNewBlack: '/FaceBlacklist/batchAdd#post', // 添加黑名单
  deleBlack: '/FaceBlacklist#delWithQuery', // 删除黑名单

  addRule: '/consumeRule#post', // 新增消费规则
  getRuleList: '/consumeRule/list#get', // 消费规则列表查询
  editRule: '/consumeRule#putJson', // 修改消费规则
  delRule: '/consumeRule#delWithQuery', // 删除消费规则

  getDayStatistics: '/businessdayStatistics/list#get', // 营业日统计
  exportDayStatistics: '/businessdayStatistics/export#export', // 营业日统计导出
  getMonthStatistics: '/businessdayStatistics/listByMouth#get', // 营业月统计
  exportMonthStatistics: '/businessdayStatistics/exportByMouth#export', // 营业月统计导出
  getStallStatistics: '/deviceStatistics/list#get', // 档口营业统计
  exportStallStatistics: '/deviceStatistics/export#export' // 档口营业统计导出
}
const baseDataApi = {
  // 场地管理
  getSiteList: '/place/manage/getFirstStagePlaceList#get', // 查询场地信息列表
  getSiteById: '/place/manage/getPlaceManageById#getUrl', // 根据id获取场地信息
  getChildSite: '/place/manage/getPlaceManageList#post' // 查询场地子节点列表
}
const schoolApi = {
  // 组织机构
  getOrgBySchool: '/school/org/getSchoolRoot#getUrl', // 查询组织机构
  getOrgList: '/school/org/detail#getUrl', // 通过组织结构Id查询组织结构

  // 年级管理
  getGradeList: '/grade/manage/list#postForm', // 查询年级列表

  // 班级管理
  getClassList: '/classManage/list#post', // 查询班级列表
  getStudentList: '/userinfo/student/user/queryStudentInfoList#post', // 获取所有学生
  getSchoolYear: '/schoolYearSemester/list#postForm' // 查询学年列表
}
const userApi = {
  getStudentSum: '/student/class/getStudentCountByCode#post', // 查询班级和年级总人数
  getTeacherSum: '/userinfo/paltform/user/getTeacherCountByOrgCode#post' // 通过机构编码获取教职工总数
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_11031}${homeApi[val]}`
}

for (const val in baseDataApi) {
  baseDataApi[val] = `${hostEnv.protal_api_10050}${baseDataApi[val]}`
}
for (const val in schoolApi) {
  schoolApi[val] = `${hostEnv.protal_api_11002}${schoolApi[val]}`
}
for (const val in userApi) {
  userApi[val] = `${hostEnv.protal_api_11002}${userApi[val]}`
}
export default {
  ...homeApi,
  ...baseDataApi,
  ...schoolApi,
  ...userApi
}
