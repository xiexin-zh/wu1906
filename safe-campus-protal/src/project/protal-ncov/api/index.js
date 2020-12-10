import homeApi from './home'
import reportApi from './report'
import organizeApi from './organize'
import setGroupApi from './setGroup'
import temPlanApi from './temPlan'
const apiList = {
  ...homeApi,
  ...reportApi,
  ...organizeApi,
  ...setGroupApi,
  ...temPlanApi
}
export default apiList