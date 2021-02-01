import homeApi from './home'
import baseData from './baseData'
import athority from './athority'
import postApi from './post'
import classApi from './class-manage'
import majorApi from './major'

const apiList = {
  ...homeApi,
  ...baseData,
  ...athority,
  ...postApi,
  ...classApi,
  ...majorApi
}
export default apiList
