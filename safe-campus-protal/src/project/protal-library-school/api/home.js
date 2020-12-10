/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  getEduCode: '/school/info/edu/info/by/childnode#get' // 获取学校所绑定的机构
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_10050}${homeApi[val]}`
}
export default homeApi
