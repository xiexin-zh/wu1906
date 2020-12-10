/**
 * @des 请假查询
 * @author zhangli
 */

import hostEnv from '@/config/host-env'

const leaveApi = {
  getLeaveList: '/dorm/dorm/vacate/info/list'
}

for (const val in leaveApi) {
  leaveApi[val] = `${hostEnv}${leaveApi[val]}`
}
export default leaveApi
