/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */
import hostEnv from '@config/host-env'

const baseData1Api = {
  // 角色管理
  getRoleList: '/role/manage/list#post', // 查询角色列表
  addRoleManage: '/role/manage/add#post', // 添加角色
  editRoleManage: '/role/manage/update#post', // 修改角色
  deleteRoleManage: '/role/manage/delete#getUrl', // 删除角色
  getRoleMenuList: '/role/manage/menu/tree/list#get', // 查询角色菜单关系
  addRoleMenu: '/role/manage/menu/add#post', // 添加角色菜单关系
  addRoleUser: '/role/manage/user/add#post', // 添加人员角色关系
  addAllRoleUser: '/role/manage/add/users#post', // 批量添加角色用户
  getRoleUserList: '/role/manage/user/list#post', // 根据角色查询关联的人员列表
  deleteRoleUser: '/role/manage/user/delete#post', // 删除人员角色关系
  getAppBySchool: '/app/manage/query/app#get', // 根据学校查询应用
  getAppMenu: '/app/manage/menu/tree/list#get' // 查询应用已关联的菜单
}

for (const val in baseData1Api) {
  baseData1Api[val] = `${hostEnv.protal_api_10060}${baseData1Api[val]}`
}
const baseDataApi = {
  ...baseData1Api
}

export default baseDataApi
