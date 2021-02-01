/**
 * @des 接口配置列表
 */

import home from './home'
import message from './message'
import hostEnv from '@config/index.js'

let apiList = {
  ...home,
	...message,
	unbindChild: `${hostEnv.protal_api_11002}/parent/children/unbind/by/childcode/and/parentcode#get`
}

export default apiList
