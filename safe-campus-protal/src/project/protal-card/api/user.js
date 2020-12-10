/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const userApi = {
  getStudentSum: '/student/class/getStudentCountByCode#post', // 查询班级和年级总人数
  getTeacherSum: '/userinfo/paltform/user/getTeacherCountByOrgCode#post' // 通过机构编码获取教职工总数
}
for (const val in userApi) {
  userApi[val] = `${hostEnv.protal_api_11002}${userApi[val]}`
}
export default userApi
