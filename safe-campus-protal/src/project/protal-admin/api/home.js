/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  getMenuList: '/menu/manage/list#post', // 菜单库列表查询
  delMenu: '/menu/manage/delete/#get', // 菜单库菜单删除
  addMenu: '/menu/manage/add#post', // 菜单库添加菜单
  updateMenu: '/menu/manage/update#post', // 菜单库菜单编辑
  getMenuNode: '/menu/manage/node/list#get', // 查询当前节点的子节点
  // getMenuList: '/menu/list#get', // 菜单库列表
  // delMenu: '/menu/delete#get', // 菜单库删除
  // addMenu: '/menu/addOrUpdate#post', // 菜单库添加
  getApply: '/app/manage/list#post', // 应用库列表
  delApply: '/app/manage/delete/#getWithPara', // 应用库删除
  addApply: '/app/manage/add#post', // 应用库添加
  updateApply: '/app/manage/update#post', // 应用库修改
  applyDetail: '/app/manage/detail/#getWithPara', // 应用库详情
  getApplySchool: '/app/manage/school/list#get', // 查询应用已关联的学校
  getApplyMenu: '/app/manage/menu/list#get', // 查询应用已关联的菜单(逐级查询)
  addApplyMenu: '/app/manage/menu/add#post', // 添加应用关联的菜单
  delApplyMenu: '/app/manage/menu/delete#post', // 删除应用已关联的菜单
  addSysMenu: '/app/manage/sys/menu/add#post', // 添加应用菜单节点
  bindApply: '/app/manage/school/add#post', // 学校关联应用
  queryApply: '/app/manage/query/app#get', // 根据学校查询应用
  unbindApply: '/app/manage/school/delete#get', // 删除学校已关联的应用
  definitionApply: '/app/manage/sys/menu/definition/add#post', // 添加应用菜单节点至自定义模块下面
  getBindMenu: '/app/manage/menu/tree/list#get', // 查询应用已关联的菜单(树形数据)
  roleBindMenu: '/role/manage/menu/tree/list#get', // 查询角色所拥有的菜单(树形数据 keyWord只对应用进行筛选)
  updateBindMenu: '/app/manage/menu/update#post', // 修改应用已关联的菜单

  getRole: '/role/manage/list#post', // 角色列表
  delRole: '/role/manage/delete/#getWithPara', // 角色删除
  addRole: '/role/manage/add#post', // 角色添加
  updateRole: '/role/manage/update#post', // 角色添加
  userRole: '/role/manage/user/list#post', // 根据角色查询关联的人员列表
  userBindMenu: '/role/manage/menu/add#post', // 添加角色菜单关系

  getServer: '/server/list#get', // 服务器列表

  getVideo: '/video/list#get', // 摄像机列表

  getPanel: '/panel/list#get' // 面板机列表
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_10060}${homeApi[val]}`
  // homeApi[val] = `${hostEnv.protal_api_10060}${homeApi[val]}`
}
export default homeApi
