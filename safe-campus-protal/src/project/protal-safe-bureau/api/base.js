/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const searchPeopleApi = {
  schoolorJobSearchPeople: '/userjob/query/by/schoolcodes/and/jobnames#post' // 根据机构编码查询岗位获取预设岗位  限定职务基础数据
}
const teachersApi = {
  getTeachers: '/userinfo/teacher/user/batch/query/usertype#post' // 获取教职工信息列表  确定要通知该学校相关负责人去处理该任务？
}
for (const val in searchPeopleApi) {
  searchPeopleApi[val] = `${hostEnv.protal_api_11002}${searchPeopleApi[val]}`
}
for (const val in teachersApi) {
  teachersApi[val] = `${hostEnv.protal_api_11002}${teachersApi[val]}`
}
const baseApi = {
  ...searchPeopleApi,
  ...teachersApi
}
export default baseApi
