/**
 * @des 宿舍管理相关接口
 */

import hostEnv from '@/config/host-env'

const roomManageApi = {
  addBuildSubmit: '/dorm/building/hierarchy/add', // 添加楼栋
  editBuild: '/dorm/building/hierarchy/update', // 编辑楼栋
  deleteBuild: '/dorm/building/hierarchy/delete/', // 删除楼栋
  getAssignRoomSubmit: '/dorm/in/record/list', // 获取已经分配的人员
  assignStudent: '/dorm/in/record/add', // 分配学生宿舍
  allRetireRoomSubmit: '/dorm/in/record/leave/dorm', // 批量退宿
  changeRoom: '/dorm/in/record/adjust/dorm', // 宿舍对调
  retireRoomSubmit: '/dorm/in/record/leave/dorm/single', // 个人退宿
  remainRoomSubmit: '/dorm/building/hierarchy/remain/room/list',
  changeRoomSubmit: '/dorm/in/record/adjust/dorm/single', // 个人调宿
  addRoomSubmit: '/dorm/building/hierarchy/node/add', // 添加房间
  loadTemplate: '/dorm/in/record/download/excel', // 模板下载
  importExcel: '/dorm/in/record/import/excel' // 导入
}

for (const val in roomManageApi) {
  roomManageApi[val] = `${hostEnv.protal_api_11006}${roomManageApi[val]}`
}
export default roomManageApi
