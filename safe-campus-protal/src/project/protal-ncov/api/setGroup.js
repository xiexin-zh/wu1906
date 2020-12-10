/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@/config/host-env'

const setGroupApi = {
  getAccessList: '/epidemic/group/list#post', // 测温组设置列表
  addAccess: '/epidemic/group/add#post', // 新增测温组
  updateAccess: '/epidemic/group/update#post', // 修改测温组
  delAccess: '/epidemic/group/delete#del', // 删除测温组
  bindAccessUser: '/epidemic/group/bind/user#post', // 测温组添加人员
  getAccessDetail: '/epidemic/group/detail/#get' // 考勤组详情
}
for (const val in setGroupApi) {
  setGroupApi[val] = `${hostEnv.protal_api_11005}${setGroupApi[val]}`
}
export default setGroupApi
