/**
 * @des 宿舍楼相关接口
 */

import hostEnv from '@/config/host-env'

const schoolApi = {
  // buildList: '/dorm/building/hierarchy/list',
  buildList: '/dorm/building/hierarchy/building/node/',
  // floorList: '/dorm/dorm/building/hierarchy/child/node',
  floorList: '/dorm/building/hierarchy/child/node',
  roomList: '/dorm/in/record/room/users',
  getAccessFloor: '/dorm/index/count/accessRecords/floor', // 获取异常楼层
  getAccessUsers: '/dorm/index/accessRecord/state' // 获取学生异常状态
}

for (const val in schoolApi) {
  schoolApi[val] = `${hostEnv.protal_api_11006}${schoolApi[val]}`
  // schoolApi[val] = `/protal_api_11006${schoolApi[val]}`
}
export default schoolApi
