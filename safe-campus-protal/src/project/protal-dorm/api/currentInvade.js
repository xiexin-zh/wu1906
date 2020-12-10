/**
 * @des 入侵记录
 * @author zhangli
 */

import hostEnv from '@/config/host-env'

const invadeApi = {
  getBuildNode: '/dorm/building/hierarchy/building/node#getUrl', // 查询楼栋
  getFloorNode: '/dorm/building/hierarchy/child/node#post' // 查询楼层
}

for (const val in invadeApi) {
  invadeApi[val] = `${hostEnv.protal_api_11006}${invadeApi[val]}`
}
export default invadeApi
