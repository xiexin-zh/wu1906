
import libraryApi from './library'
import homeApi from './home'
const apiList = {
  ...homeApi,
  ...libraryApi
}
export default apiList
