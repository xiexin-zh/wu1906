/**
 * @des 模块接口配置
 * @remak 接口路径后面加#{类型} 如 #post  #get #del
 */

import hostEnv from '@config/host-env'

const subjectApi = {
  getSubject: '/dictionary/info/list#post', // 页面分页查询学科列表
  delSubject: '/dictionary/info/delete#postQuery', // 删除学科
  addSubject: '/dictionary/info/add#post', // 新增学科信息
  subjectDetail: '/dictionary/info/detail#post', // 根据id查询学科信息
  updateSubject: '/dictionary/info/update#post' // 更新学科信息
}
for (const val in subjectApi) {
  subjectApi[val] = `${hostEnv.protal_api_10050}${subjectApi[val]}`
}
export default subjectApi
