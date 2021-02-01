/**
 * @des 接口配置列表
 */

import home from './home'
import base from './base'
import classApi from './class'
let apiList = {
  ...home,
  ...base,
	...classApi
}

export default apiList
