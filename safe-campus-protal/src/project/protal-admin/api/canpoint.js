/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const canpointApi = {
  addStaff: '/userinfo/paltform/user/add#post', // 平台用户新增
  delStaff: '/userinfo/paltform/user/delete#postQuery', // 平台用户删除
  getStaff: '/userinfo/paltform/user/query#post', // 平台用户查询
  updateStaff: '/userinfo/paltform/user/update#post', // 平台用户修改
  addAdmin: '/userinfo/paltform/user/school/manage/add#post', // 管理员新增
  getAdmin: '/userinfo/paltform/user/school/manage/info#get', // 管理员查询
  updateAdmin: '/userinfo/paltform/user/school/manage/update#post' // 管理员修改
}
for (const val in canpointApi) {
  canpointApi[val] = `${hostEnv.protal_api_11002}${canpointApi[val]}`
}
export default canpointApi
