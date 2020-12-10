/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const baseData2Api = {
  // 收费管理
  getchargeTaskList: '/chargeTaskInfo/page#post', // 收费任务列表
  addChargetask: '/chargeTaskInfo/add#post', // 新增收费任务
  getchargeTaskInfo: '/chargeTaskInfo/info#getUrl', // 查看收费任务详情
  getCharge: '/taskItemRelation/getChargeItemByCode#getUrl', // 收费项列表
  addtaskItem: '/taskItemRelation/add#post', // 已有收费项
  addRelationItem: '/taskItemRelation/addRelationItem#post', // 新增收费项
  // 账单列表
  getbillInfo: '/billInfo/page#post', // 账单列表
  addBillInfo: '/billInfo/addBillInfo#post', //新增账单
  downBillExcelData: '/billInfo/getBillExcelData#export', //账单导出
  // 系统设置-收费项
  getSelect: '/chargeItemInfo/page#post', // 收费项下拉列表
  addSelect: '/chargeItemInfo/add#post', // 新增收费项
  delSelect: '/chargeItemInfo/remove#getUrl', // 删除收费项
  updateSelect: '/chargeItemInfo/modify#post', // 更新收费项
  getInfoSelect: '/chargeItemInfo/info#getUrl', // 收费项详细
  // 报表统计-班级汇总统计
  downClassList: '/classCollectStat/getClassStatExcel#export', // 导出
  getclassCollectList: '/classCollectStat/page#post', // 班级汇总统计列表
  // 报表统计-收费日统计
  downdayBillList: '/dayBillStat/getDayBillStatExcel#export', // 导出
  getdayBillList: '/dayBillStat/page#post', // 收费日统计列表
  // 报表统计-收费预警统计
  downoverdueBillInfo: '/overdueBillInfo/getOverdueBillExcel#export', // 导出
  getoverdueBillInfo: '/overdueBillInfo/listOverdueBillInfo#postQuery', // 收费预警统计列表
  // 首页
  getChargeBasic: '/index/getChargeBasicStatInfo#getUrl', // 收费基本统计
  getChargeCurve: '/index/getChargeCurve#getUrl', // 图表数据
  getChargeMoney: '/index/getChargeMoneyStatInfo#get', // 总收费统计统计
  //任务详情操作
  delayTaskTime: '/chargeTaskInfo/delayTaskTime#postQuery', // 收费任务延期
  callBill: '/billInfo/callBill#post', // 账单催缴
  shutDownBill: '/billInfo/shutDownBill#post', // 账单关闭
  //账单详情操作接口
  getOpeListByBillNum: '/billOpeInfo/getOpeListByBillNum#getUrl', //  获取账单操作信息
  confirmPayBill: '/billInfo/confirmPayBill#post', //  确认收款
  getbillDetail: '/billInfo/info#getUrl', //  获取账单详细
  // 消息设置
  getMsgSet: '/msgTypeSetting/getMsgSet#getUrl', //  获取消息设置
  addMessageSet: '/msgTypeSetting/addMessageSet#post' //  保存消息设置
}
const baseData1Api = {
  getSchoolYear: '/schoolYearSemester/list#postForm', // 查询学年列表
  // 年级管理
  getGradeList: '/grade/manage/list#postForm', // 查询年级列表

  // 班级管理
  getClassList: '/classManage/list#post', // 查询班级列表
  getStudentList: '/userinfo/student/user/queryStudentInfoList#post' // 获取所有学生
}
const userApi = {
  getStudentSum: '/student/class/getStudentCountByCode#post' // 查询班级和年级总人数
}
for (const val in userApi) {
  userApi[val] = `${hostEnv.protal_api_11002}${userApi[val]}`
}
for (const val in baseData2Api) {
  baseData2Api[val] = `${hostEnv.protal_api_10097}${baseData2Api[val]}`
}
for (const val in baseData1Api) {
  baseData1Api[val] = `${hostEnv.protal_api_11002}${baseData1Api[val]}`
}
const baseDataApi = {
  ...baseData1Api,
  ...baseData2Api,
  ...userApi
}
export default baseDataApi
