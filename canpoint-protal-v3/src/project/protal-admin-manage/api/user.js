import hostEnv from '@config/host-env'

const userApi = {
  // 员工管理
  getUserListApi: '/canpointUserRole/page#post', // 获取员工列表
  addUserApi: '/canpointUserRole/add/staff#post', // 添加编辑员工
  editUserApi: '/canpointUserRole/modify/staff#post', // 修改员工信息
  delUserApi: '/canpointUserRole/delete/staff#postJsonQuery', // 删除员工

  // 角色管理
  getRoleListApi: '/canpointRole/list#post', // 获取角色列表
  addRoleApi: '/canpointRole/add#post', // 添加员角色
  editRoleApi: '/canpointRole/update#post', // 编辑角色
  delRoleApi: '/canpointRole/delete#delQuery' // 删除角色
}
for (const val in userApi) {
  userApi[val] = `${hostEnv.protal_v3_11101}${userApi[val]}`
}
export default userApi
