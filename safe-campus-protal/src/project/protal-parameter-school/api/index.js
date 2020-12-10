
import parameterApi from './parameter'
import homeApi from './home'
const apiList = {
  ...homeApi,
  ...parameterApi
}
export default apiList
