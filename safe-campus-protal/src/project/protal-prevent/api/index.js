import homeApi from './home'
import userApi from './user'

const apiList = {
  ...homeApi,
  ...userApi
}
export default apiList
