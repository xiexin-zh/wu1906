/**
 * @des 宿舍关联接口
 */

import hostEnv from '@/config/host-env'

const userRelationApi = {
  deleteUserHandle: '/dorm/staff/building/delete/', // 解绑
  addUserHandle: '/dorm/staff/building/relation', // 绑定
  // getRoleList: '/base/user/role/list',
  getStaffBuild: '/dorm/staff/building/list'
}
for (const val in userRelationApi) {
  userRelationApi[val] = `${hostEnv.protal_api_11006}${userRelationApi[val]}`
}
export default userRelationApi
