import hostEnv from '@config/host-env'
import homeApi from './home'
import noticeApi from './notice'

const apiList = {
  ...homeApi,
  ...noticeApi,
  getRecord: `${hostEnv.protal_api_11002}/change/record/query/by/userCode#get`,
  getHighSchoolYear: `${hostEnv.protal_api_8092}/school/year/manage/list#post#false`,
  getSchoolYear: `${hostEnv.protal_api_11002}/schoolYearSemester/list#postForm#false`,
  getHelpList: 'http://canpointtest.com:8090/protalHelp/getProtalHelp#get' // 获取帮助指引
}

export default apiList
