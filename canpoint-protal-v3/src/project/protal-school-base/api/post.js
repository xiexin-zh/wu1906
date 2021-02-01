import hostEnv from '@config/host-env'

const postApi = {
  // 职务管理
  getPostPage: '/canpointStation/page#post', // 获取职务列表
  getAllPost: '/canpointStation/allList#get', // 获取所有职务
  addPost: '/canpointStation/add#post', // 添加职务
  editPost: '/canpointStation/modify#post', // 编辑职务
  delPost: '/canpointStation/delete#delQuery', // 删除职务

  // 职务成员管理
  getPostUser: '/canpointStationUser/list#post', // 获取职务成员列表
  addPostUser: '/canpointStationUser/save/and/update#post', // 添加职务成员

  // 员工管理
  getStaffPage: '/canpointUserInfo/teacher/queryTeacherList#post', // 查询员工列表
  addStaff: '/canpointUserInfo/teacher/addTeacher#post', // 添加员工
  editStaff: '/canpointUserInfo/teacher/updateTeacher#post', // 编辑员工
  delStaffSingle: '/canpointUserInfo/teacher/remove#post', // 删除员工
  delStaffBatch: '/canpointUserInfo/teacher/removeList#post' // 批量删除员工
}
for (const val in postApi) {
  postApi[val] = `${hostEnv.protal_v3_11101}${postApi[val]}`
}
export default postApi
