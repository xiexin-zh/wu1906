import hostEnv from '@config/host-env'

const baseApi1 = {
  // 学科管理-预设学科
  getSubjectPage: '/canpointSubject/page#post', // 获取学科列表
  addSubject: '/canpointSubject/add#post', // 添加学科
  editSubject: '/canpointSubject/modify#post', // 编辑学科
  delSubject: '/canpointSubject/remove#delQuery', // 删除学科
  getSubjectInfo: '/canpointSubject/info#getUrl' // 获取学科详情
}
for (const val in baseApi1) {
  baseApi1[val] = `${hostEnv.protal_v3_11101}${baseApi1[val]}`
}
const baseApi = {
  ...baseApi1
}
export default baseApi
