import homeApi from './home'
import accountManage from './accountManage'
import cardManage from './cardManage'
import billRecord from './billRecord'
const apiList = {
  ...homeApi,
  ...accountManage,
  ...cardManage,
  ...billRecord
}

export default apiList
