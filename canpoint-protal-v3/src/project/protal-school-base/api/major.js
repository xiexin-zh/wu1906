import hostEnv from '@config/host-env'

const postApi = {
  // 专业管理
  getMajor: '/canpointSpecializedSubject/page#post', // 分页条件查询
  addMajor: '/canpointSpecializedSubject/add#post', // 添加(单条)
  addMajors: '/canpointSpecializedSubject/add/batch#post', // 添加(批量)
  delMajor: '/canpointSpecializedSubject/delete#get', // 删除（单条）
  delMajors: '/canpointSpecializedSubject/delete/batch#post', // 删除（批量）
  updateMajor: '/canpointSpecializedSubject/modify#post' // 修改
}
for (const val in postApi) {
  postApi[val] = `${hostEnv.protal_v3_11101}${postApi[val]}`
}
export default postApi
