/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  getSchoolInfo: '/canpointSchool/query/schoolinfo#get', // 获取用户相关的学校信息
  getAppList: '/canpointApp/app/list#get', // 获取用户应用列表
  getMenuList: '/canpointMenu/menu/list#get', // 获取应用菜单权限
  getApp: '/role/manage/menu/multiple/tree/list#get' // 根据用户id获取菜单权限
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_v3_11101}${homeApi[val]}`
}
export default homeApi
