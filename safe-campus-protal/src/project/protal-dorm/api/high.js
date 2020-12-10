/**
 * @des 宿舍关联接口
 */

import hostEnv from '@/config/host-env'

const highApi = {
  getHighNode: '/class/manage/node'
}
for (const val in highApi) {
  highApi[val] = `${hostEnv.protal_api_8092}${highApi[val]}`
}
export default highApi
