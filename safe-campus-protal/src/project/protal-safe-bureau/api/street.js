/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'
const streetApi = {
  getStreet: '/subsidiary/street/manage/list#get', // 查询附属街道
  getGroup: '/supervise/group/manage/list#get', // 查询督办小组
  getTreeGroup: '/subsidiary/street/manage/query/street/and/group#get', // GET 根据机构查询督办小组树结构
  underSchoolList: '/school/info/edu/schoolmanage/info#post', // 查询下属学校列表
  getQueryjob: '/edu/job/manage/queryjob/by/educode/and/definded#get' // 判断是否预设 预设小组基础数据
}
for (const val in streetApi) {
  streetApi[val] = `${hostEnv.protal_api_10050}${streetApi[val]}`
}
export default streetApi
