import homeApi from './home'
import archiveApi from './archive'
import inspectApi from './inspect'
import dangerApi from './danger'
import specialApi from './special'
import accdientApi from './accident'
import taskApi from './task'
import baseApi from './base'

const apiList = {
  ...homeApi,
  ...archiveApi,
  ...inspectApi,
  ...dangerApi,
  ...specialApi,
  ...taskApi,
  ...accdientApi,
  ...baseApi

}
export default apiList
