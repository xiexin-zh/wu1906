import homeApi from './home'
import baseDataApi from './baseData'
import courseApi from './course'

const apiList = {
  ...homeApi,
  ...baseDataApi,
  ...courseApi
}
export default apiList
