import homeApi from './home'
import baseData from './baseData'
import postApi from './post'
import athority from './athority'
import undeOrganizationMge from './undeOrganizationMge'

const apiList = {
  ...homeApi,
  ...baseData,
  ...postApi,
  ...athority,
  ...undeOrganizationMge
}
export default apiList
