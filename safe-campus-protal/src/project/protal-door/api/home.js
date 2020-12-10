/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const homeApi = {
  getAccessRecord: '/accessRecord#get', // 获取数据列表
  getReasonList: '/reasonList#get', // 来访事由
  getFkControl: '/fkControl#get', // 获取访客控制组配置
  getFkRecord: '/fkRecord#get', // 获取访客记录
  getStudentAccess: '/studentAccess#get', // 学生通行权限
  getTeacherAccess: '/teacherAccess#get' // 教师通行权限
}
for (const val in homeApi) {
  homeApi[val] = `${hostEnv.protal_api_10160}${homeApi[val]}`
}
export default homeApi
