import homeApi from './home'
import cardApi from './card'
import consumeApi from './consume'
import baseDataApi from './baseData'
import userApi from './user'
const apiList = {
  ...homeApi,
  ...cardApi,
  ...consumeApi,
  ...baseDataApi,
  ...userApi
}
export default apiList
