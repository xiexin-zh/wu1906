import baseDataApi from './baseData'
import homeApi from './home'
import highApi from './high'
const apiList = {
  ...baseDataApi,
  ...homeApi,
  ...highApi
}
export default apiList
