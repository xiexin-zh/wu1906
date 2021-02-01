import hostEnv from '@config/host-env'

const baseApi1 = {
  // 角色管理
  getRolePage: '/canpointRole/list#post', // 获取角色列表
  addRole: '/canpointRole/add#post', // 添加角色
  editRole: '/canpointRole/update#post', // 编辑角色
  delRole: '/canpointRole/delete#delQuery', // 删除角色

  // 角色成员管理
  getRoleUser: '/canpointUserRole/page#post', // 获取角色成员列表
  addRoleUser: '/canpointUserRole/save/and/update#post', // 添加角色成员

  // 角色授权管理
  getRoleMenu: '/canpointRoleMenu/list#post', // 菜单列表
  getMenuList: '/canpointRoleMenu/query/menu#post' // 菜单列表
}
for (const val in baseApi1) {
  baseApi1[val] = `${hostEnv.protal_v3_11101}${baseApi1[val]}`
}
const baseApi = {
  ...baseApi1
}
export default baseApi
