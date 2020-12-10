import specialApi from './special'
import dangerApi from './danger'
import uploadPdfApi from './uploadPdf'
import streetApi from './street'
import accidentApi from './accident'
import taskApi from './task'
import baseApi from './base'
const apiList = {
  ...specialApi,
  ...dangerApi,
  ...uploadPdfApi,
  ...streetApi,
  ...accidentApi,
  ...taskApi,
  ...baseApi
}
export default apiList
