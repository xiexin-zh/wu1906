import homeApi from './home'
import deviceApi from './device'

const apiList = {
  ...homeApi,
  ...deviceApi
}
export default apiList
