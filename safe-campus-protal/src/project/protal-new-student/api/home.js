/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const viewApi = {
  // 首页数据
  getPlanList: '/place/reserve/summary/detail#getUrl', // 招生数据
  getProjectList: '/place/reserve/summary/detail#getUrl' // 招生专业
}

for (const val in viewApi) {
  viewApi[val] = `${hostEnv.protal_api_8095}${viewApi[val]}`
}
export default {
  ...viewApi
}
