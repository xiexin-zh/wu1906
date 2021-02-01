/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const set = {
  // 查寝班次
  getCheckClass: '/canpointDormOrder/page#post', // 分页查询
  addCheckClass: '/canpointDormOrder/add#post', // 新增
  checkClassDetail: '/canpointDormOrder/info#get', // 详情
  updateCheckClass: '/canpointDormOrder/modify#post', // 编辑
  delCheckClass: '/canpointDormOrder/remove#delQuery', // 删除
  // 设备管理
  getDormEquip: '/canpointDeviceManage/page#post', // 设备查询
  delDormEquip: '/canpointDeviceManage/remove#delQuery', // 删除
  updateDormEquip: '/canpointDeviceManage/save/and/update#post', // 保存更新
  // 预警设置
  getWarnList: '/canpointWarningSetting/list#postForm', // 列表
  updateWarn: '/canpointWarningSetting/save/and/update#post', // 保存更新
  getWarnUser: '/canpointExtraNoticer/list#postForm', // 额外通知对象列表查询
  updateWarnUser: '/canpointExtraNoticer/save/and/update#post', // 保存更新
  // 查寝设置
  getCheckGroup: '/canpointDormGroup/list#postForm', // 查询
  addCheckGroup: '/canpointDormGroup/add#post', // 添加
  checkGroupDetail: '/canpointDormGroup/info#get', // 详情
  updateCheckGroup: '/canpointDormGroup/modify#post', // 修改
  delCheckGroup: '/canpointDormGroup/remove#delQuery', // 删除
  updateClassCheck: '/canpointGroupGrade/save#post' // 考勤年级关联更新保存
}
for (const val in set) {
  set[val] = `${hostEnv.protal_v3_11102}${set[val]}`
}
export default set
