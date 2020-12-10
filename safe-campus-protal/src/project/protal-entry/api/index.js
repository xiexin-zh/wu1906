import hostEnv from '@config/host-env'
import homeApi from './home'
import noticeApi from './notice'

const apiList = {
  ...homeApi,
  ...noticeApi,
  getSchoolInfo: `${hostEnv.protal_api_10050}/school/info/getSchoolByCode#getUrl`, // 获取学校信息
  getRecord: `${hostEnv.protal_api_11002}/change/record/query/by/userCode#get`,
  getSchoolYear: `${hostEnv.protal_api_8092}/school/year/manage/list#post#false`,
  getHelpList: 'http://canpointtest.com:8090/protalHelp/getProtalHelp#get' // 获取帮助指引
}

export default apiList
