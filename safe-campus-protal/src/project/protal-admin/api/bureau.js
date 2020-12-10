/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const bureauApi = {
  getEdu: '/school/info/edu/list/info#post', // 教育局列表
  delEdu: '/school/info/delete/edu/info#get', // 删除教育局信息
  addEdu: '/school/info/add/edu/info#post', // 新增教育局
  eduDetail: '/school/info/edu/info#get', // 教育局详情
  updateEdu: '/school/info/update/edu/info#post', // 更新教育局信息
  bindEdu: '/school/info/bind/edu/info#get', // 绑定
  getBindEdu: '/school/info/edu/bindschool/info#get', // 下属学校列表
  getUnbindEdu: '/school/info/edu/list/bylevel#post' // 下属学校列表
  // getProvinces: '/provinces/getProvinces#get', // 查询省份列表
  // getSubNodes: '/provinces/getSubNodes/#getWithPara' // 查询子节点列表
}
for (const val in bureauApi) {
  bureauApi[val] = `${hostEnv.protal_api_10050}${bureauApi[val]}`
}
export default bureauApi
