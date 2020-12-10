import homeApi from './home'
import doorApi from './door'
import visitorApi from './visitor'
import baseApi from './base'
import recordApi from './record'
import addVisitorApi from './addVisitor'
import dataViewApi from './dataView'
import hostEnv from '@config/host-env'
const apiList = {
  ...homeApi,
  ...visitorApi,
  ...doorApi,
  ...baseApi,
  ...recordApi,
  ...addVisitorApi,
  ...dataViewApi,
  downRecord: `${hostEnv.protal_api_10162}/record/access/record/list/export#export`, // 导出出入记录
  getRespondentinfo: `${hostEnv.protal_api_10160}/respondentinfo/list#post`, // 受访人信息列表
  addRespondentinfo: `${hostEnv.protal_api_10160}/respondentinfo/manage/batchAdd#post`, // 添加
  delrespondentinfo: `${hostEnv.protal_api_10160}/respondentinfo/manage/delete#get`, // 删除
  getrespondentinfoDetail: `${hostEnv.protal_api_10160}/respondentinfo/queryByNameAndPhone#get`, // 详细信息
  downAppoint: `${hostEnv.protal_api_10160}/invite/appoint/access/downloadExcel#export` // 访客记录导出
}
export default apiList