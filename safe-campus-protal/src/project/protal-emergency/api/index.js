import homeApi from './home'
import userApi from './user'
import controlApi from './control'

const apiList = {
  ...homeApi,
  ...userApi,
  ...controlApi
}
export default apiList
