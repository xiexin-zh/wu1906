import homeApi from './home'
import dictionaryApi from './dictionary'
import messageApi from './message'
import userApi from './user'
import holidayApi from './holiday'
const apiList = {
  ...homeApi,
  ...dictionaryApi,
  ...messageApi,
  ...userApi,
  ...holidayApi
}
export default apiList
