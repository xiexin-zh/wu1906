/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const schoolApi = {
  getSchool: '/school/info/getSchoolInfoListPage#post', // 页面分页查询学校列表
  delSchool: '/school/info/delSchoolInfo/#del', // 删除学校信息
  addSchool: '/school/info/add#post', // 新增学校信息
  schoolDetail: '/school/info/getSchoolById/#getWithPara', // 根据id查询学校信息
  updateSchool: '/school/info/update#post', // 更新学校信息
  getProvinces: '/provinces/getProvinces#get', // 查询省份列表
  getSubNodes: '/provinces/getSubNodes/#getWithPara' // 查询子节点列表
}
for (const val in schoolApi) {
  schoolApi[val] = `${hostEnv.protal_api_10050}${schoolApi[val]}`
  // schoolApi[val] = `${hostEnv.protal_api_10050}${schoolApi[val]}`
}
export default schoolApi
