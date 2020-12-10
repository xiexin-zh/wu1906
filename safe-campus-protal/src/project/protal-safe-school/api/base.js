/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const teachersApi = {
  getTeachers: '/userinfo/teacher/user/batch/query/usertype#post' // 获取教职工信息列表  确定要通知该学校相关负责人去处理该任务？
}
for (const val in teachersApi) {
  teachersApi[val] = `${hostEnv.protal_api_11002}${teachersApi[val]}`
}
export default teachersApi
