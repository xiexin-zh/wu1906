import baseDataApi from './baseData'
import homeApi from './home'
const apiList = {
  ...baseDataApi,
  ...homeApi
}
export default apiList