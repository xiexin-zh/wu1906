/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const userApi = {
  getOrgBySchool: '/school/org/getSchoolRoot#getUrl', // 查询组织机构
  getTeacherList: '/userinfo/teacher/user/queryTeacherInfo#post' // 获取所有老师
}
for (const val in userApi) {
  userApi[val] = `${hostEnv.protal_api_11002}${userApi[val]}`
}
export default userApi
