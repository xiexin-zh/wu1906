import hostEnv from '@config/host-env'

const yearApi = {
  getYearId: `${hostEnv.protal_api_11002}/schoolYearSemester/list#postForm` // 查询学年
}
export default yearApi
