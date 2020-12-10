/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const appApi = {
  addLevelType: '/menu/manage/module/menu/add#post', // 新增编辑一级分类
  updateLevel: '/menu/manage/module/menu/update#post', // 一级分类修改
  getLevelList: '/menu/manage/module/menu/list#get', // 获取一级分类类别
  delLevelList: '/menu/manage/module/menu/delete#get', // 一级分类删除
  getLevelMenuList: '/menu/manage/menu/level/list#post', // 获取分类菜单类列表
  addLevelMenuList: '/menu/manage/menu/level/add#post', // 新增分类菜单列表
  updateLevelMenuList: '/menu/manage/menu/level/update#post', // 更新菜单类列表
  delLevelMenuList: '/menu/manage/menu/level/delete#postJsonQuery', // 删除分类菜单列表
  addAppList: '/app/manage/add#post', // 新增系统
  searchAppList: '/app/manage/list#post', // 查询应用库
  delAppList: '/app/manage/delete#get', // 查询应用库
  updateAppList: '/app/manage/update#post', // 查询应用库
  appDetail: '/app/manage/detail#get', // 应用库详情
  bindTopMenu: '/app/manage/bind/menu#post', // 应用绑定一级菜单
  bindLevelMenu: '/app/manage/add/leve/menu#post', // 应用绑定一级菜单子集
  getBindMenu: '/app/manage/bind/tree/menu#get', // 查询绑定的菜单
  delAppMenu: '/app/manage/delete/menu#get', // 删除菜单
  searchBindApp: '/app/manage/query/app#get', // 查询学校绑定的app
  schoolBindApp: '/app/manage/school/add#post', // 学校绑定app
  delBindApp: '/app/manage/school/delete#get', // 删除绑定的应用
  sortMenu: '/app/manage/menu/update/order#post', // 菜单排序
  appSort: '/app/manage/order#post' // 应用排序
}
for (const val in appApi) {
  appApi[val] = `${hostEnv.protal_api_10060}${appApi[val]}`
}
export default appApi
