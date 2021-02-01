/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const baseData = {
  // 基础数据
  getStudentInfo: '/canpointUserInfo/student/getParentHeadTeacher#post', // 获取学生详细信息
  getClassStudents: '/canpointUserInfo/student/queryStudentList#post', // 获取班级学生
  getOldSchoolYearList: '/canpointClass/menu/first/list#get', // 班级菜单树的一级列表
  getGradeClassList: '/canpointClass/menu/second/third/tree#post' // 班级菜单树的二三级数据
}

const dormManage = {
  // 实时查寝
  getStaticNum: '/canpointRealTimeDorm/getStaticNum#get', // 总人数相关统计
  chooseDormState: '/canpointRealTimeDorm/getConditionBedRoomUsers#post', // 只看在寝/不在寝房间人员
  getRoomUsersByClass: '/canpointRealTimeDorm/getRoomUsersByClass#post', // 按班级查看住宿人员
  repairCard: '/canpointRealTimeDorm/repairCard#post', // 补卡操作

  // 宿舍管理
  getDormTree: '/canpointDormManage/getDormTree#post', // 获取楼栋树
  getBuildingOrFloor: '/canpointDormManage/getBuildingOrFloor#post', // 查询楼栋或楼层
  addBuilding: '/canpointDormManage/addBuilding#post', // 添加楼栋
  addFloor: '/canpointDormManage/addFloor#postJsonQuery', // 添加楼层
  addRoom: '/canpointDormManage/addRoom#post', // 添加房间
  updateBuilding: 'canpointDormManage/updateBuilding#post', // 编辑楼栋
  updateRoom: '/canpointDormManage/updateRoom#post', // 编辑房间
  removeDorm: '/canpointDormManage/remove#getUrl', // 删除楼栋/楼层/房间
  removeRoom: '/canpointDormManage/removeRoom#post', // 批量删除房间
  getRoomUsers: '/canpointDormManage/getRoomUsers#post', // 查询房间及其人员
  batchImport: '/canpointDormManage/batchImport#postForm', // 批量导入学生入住
  leaveDorm: '/canpointDormArchives/leave/dorm/singleUser#post', // 单个人员退宿
  changeDorm: '/canpointDormArchives/adjust/dorm/single#post', // 单个人员调宿
  batchChangeDorm: '/canpointDormArchives/exchange/dorm#post', // 宿舍对调
  archivesStudent: '/canpointDormArchives/add/archivesStudent#post', // 批量分配学生入住
  batchLeaveDorm: '/canpointDormArchives/leave/dorm/room#post', // 宿舍批量退宿
  batchLeaveDormByUserCode: '/canpointDormArchives/leave/dorm/manyUser#post', // 学生批量退宿
  queryUserArchives: '/canpointDormArchives/queryUserArchives#post', // 获取已入住学生
  // 宿管设置
  getDormMaster: '/canpointDormMaster/dormMasterList#postQuery', // 获取宿舍楼及其宿管
  delDormMaster: '/canpointDormMaster/removeMaster#postQuery', // 删除宿舍楼及其宿管
  addDormMaster: '/canpointDormMaster/addMaster#post' // 添加宿管
}
for (const val in baseData) {
  baseData[val] = `${hostEnv.protal_v3_11101}${baseData[val]}`
}
for (const val in dormManage) {
  dormManage[val] = `${hostEnv.protal_v3_11102}${dormManage[val]}`
}

export default {
  ...baseData,
  ...dormManage
}
