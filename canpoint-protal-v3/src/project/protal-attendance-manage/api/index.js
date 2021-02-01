import groupApi from './group'
import homeApi from './home'
import recordApi from './record'
const apiList = {
  ...groupApi,
  ...homeApi,
  ...recordApi
}
export default apiList
