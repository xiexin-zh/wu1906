/**
 * @des 设备关联接口
 */

import hostEnv from '@/config/host-env'

const deviceRelationApi = {
  deleteControlHandle: '/dorm/building/controller/delete/', // 解绑
  bindControlHandle: '/dorm/building/controller/add', // 绑定
  getControlList: '/dorm/building/controller/list',
  getGroupList: '/base/control/group/info/list',
  getNewGroup: '/dorm/building/controller/info/list/'
}

for (const val in deviceRelationApi) {
  deviceRelationApi[val] = `${hostEnv.protal_api_11006}${deviceRelationApi[val]}`
}
export default deviceRelationApi
