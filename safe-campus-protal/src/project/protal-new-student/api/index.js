import homeApi from './home'
import baseDataApi from './baseData'
import attractApi from './attract'

const apiList = {
  ...homeApi,
  ...baseDataApi,
  ...attractApi
}
export default apiList
