/**
 * @des 接口配置列表
 */

import baseApi from './base-data.js'
import noticeApi from './notice.js'
import taskApi from './task.js'
import albumApi from './album'
import circleApi from './circle'
import consumeApi from './consume'
import faceApi from './face.js'

let apiList = {
  ...baseApi,
	...noticeApi,
	...taskApi,
	...albumApi,
	...circleApi,
	...consumeApi,
	...faceApi
}

export default apiList
