/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const countApi = {
  addCount: '/count/down/add#post', // 创建倒数日
  delCount: '/count/down/delete#del', // 删除倒数日
  getcountDetail: '/count/down/detail/#getWithPara', // 倒数日详情
  getcountList: '/count/down/list#post', // 倒数日列表
  updateCount: '/count/down/update#putJson', // 更新倒数日
  addonDuty: '/on/duty/add#post', // 新增值日信息
  getdutyList: '/on/duty/list#get', // 用户值日列表信息
  updateDuty: '/on/duty/update#putWithQueryAndBody', // 更新值日信息
  delDuty: '/on/duty/delete/#del' // 删除值日信息
}
for (const val in countApi) {
  countApi[val] = `${hostEnv.protal_api_11009}${countApi[val]}`
}

export default countApi
