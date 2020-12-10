import attendanceApi from './attendanceApi'
import leaveApi from './leaveApi'
import teacherApi from './teacher'
import classApi from './classApi'

const apiList = {
  ...attendanceApi,
  ...leaveApi,
  ...teacherApi,
  ...classApi
}
export default apiList
