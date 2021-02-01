import uniRequest from 'uni-request'
import qs from 'qs'

// 请求超时时间
uniRequest.defaults.timeout = 15000
uniRequest.defaults.withCredentials = true // 让ajax携带cookie

// 设置公用请求头
const protal = uni.getStorageSync('protal')
if (protal) {
	const globalInfo = JSON.parse(uni.getStorageSync('protal'))
	if (globalInfo.userInfo) {
		uniRequest.defaults.headers.userCode = globalInfo.userInfo.userCode
		uniRequest.defaults.headers.schoolCode = globalInfo.userInfo.schoolCode
		uniRequest.defaults.headers.openId = globalInfo.openid
		uniRequest.defaults.headers.operator = 'admin'
		uniRequest.defaults.headers.channelId = 'WXPAY_NATIVE'
	}
}
// 请求拦截
uniRequest.interceptors.request.use(
  request => {
    return request;
  },
  err => {
    return Promise.reject(err);
  });

// 响应拦截
uniRequest.interceptors.response.use(function (response) {
  return Promise.resolve(response);
}, function (error) {
  return Promise.reject(error);
});

const showToast = (tip = '') => {
  uni.showLoading({
    title: tip
  });
}

function responseRes(res, obj) {
  // 清除加载
  uni.hideLoading()
  return new Promise((resolve, reject) => {
		// console.log(typeof(res))
		if(typeof(res) === 'string'){
			res = JSON.parse(JSON.stringify(res))
			console.log(res)
		}
    if (res.code === 200 || res.status === true) {
      resolve(res)
    } else if (res.code === 401) {} else {
      uni.showToast({
        title: res.message || '请求服务失败~',
        icon: 'none'
      });
      reject(res)
      sendError(obj)
    }
  })
}
/**
 * @des 收集请求信息
 */
const sendError = obj => {
  const protal = uni.getStorageSync('protal')
  if (!protal) return
  const {
    userName,
    schoolCode,
    schoolName
  } = JSON.parse(protal).userInfo
  const {
    message = '请求错误', url, params = ''
  } = obj
  uni.request({
    url: 'http://canpointtest.com:8090/errorApi/addErrorApi',
    data: JSON.stringify({
      status: 0,
      platform: 1,
      message,
      url,
      params,
      userName,
      schoolCode,
      schoolName,
      createTime: new Date().getTime()
    }),
    header: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    success: (data) => {}
  })
}
// postJSON请求
const post = (obj) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: obj.url,
      data: JSON.stringify(obj.params),
      header: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      success: (data) => {
        const res = data.data
        if (res.code === 200) {
          resolve(res)
        } else {
          responseRes(res, obj)
        }
      },
    })
  })
}
// putJSON请求
const putJson = (obj) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: obj.url,
      data: JSON.stringify(obj.params),
      header: {
        'Content-Type': 'application/json',
      },
      method: 'put',
      success: (data) => {
        const res = data.data
        if (res.code === 200) {
          resolve(res)
        } else {
          responseRes(res, obj)
        }
      },
    })
  })
}
// deleteJSON请求
const deleteJSON = (obj) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: obj.url,
      method: 'delete',
      data: obj.params,
      headers: {
        'Content-Type': 'application/json'
      },
      success: (data) => {
        const res = data.data
        if (res.code === 200) {
          resolve(res)
        } else {
          responseRes(res, obj)
        }
      },
    })
  })
}
const errMsg = {
  code: -1,
  message: '服务器异常'
}

const $ajax = {
  async get(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await uniRequest.get(obj.url, {
        params: obj.params || ''
      })
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async getUrl(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await uniRequest.get(obj.url)
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async postForm(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await uniRequest.post(obj.url, obj.params)
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async postQuery(obj, tag = true) {
    if (tag) showToast()
    let url = obj.url + '?'
    for (const key in obj.params) {
      url += key + '=' + obj.params[key] + '&'
    }
    try {
      let res = await uniRequest.post(url)
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async post(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await post(obj)
      return responseRes(res)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
	async postJson(obj, tag = true) {
	  if (tag) showToast()
	  try {
	    let res = await post(obj)
	    return responseRes(res)
	  } catch (err) {
	    return responseRes(errMsg, obj)
	  }
	},
  async del(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await uniRequest.delete(obj.url, {})
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async putUrl(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await uniRequest.put(obj.url)
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async put(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await uniRequest.put(obj.url, qs.stringify(obj.params))
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async putForm(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await uniRequest.put(obj.url, obj.params)
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async putJson(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await putJson(obj)
      return responseRes(res)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async getWithPara(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await axios({
        url: obj.url + obj.params,
        method: 'get'
      })
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async putParam(obj, tag = true) {
    if (tag) showToast()
    let url = obj.url + '?'
    for (const key in obj.params) {
      url += key + '=' + obj.params[key] + '&'
    }
    try {
      let res = await uniRequest.put(url)
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async delQuery(obj, tag = true) {
    if (tag) showToast()
    let url = obj.url + '?'
    for (const key in obj.params) {
      url += key + '=' + obj.params[key] + '&'
    }
    try {
      let res = await uniRequest.delete(url, {})
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
	async delWithQuery(obj, tag = true) {
	  if (tag) showToast()
	  const url = obj.url + '/' + obj.params
	  try {
	    let res = await uniRequest.delete(url, qs.stringify(obj.params))
	    res = res.data
	    return responseRes(res, obj)
	  } catch (err) {
	    return responseRes(errMsg, obj)
	  }
	},
  async get(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await uniRequest.get(obj.url, {
        params: obj.params || ''
      })
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async getUrl(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await uniRequest.get(obj.url)
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async postForm(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await uniRequest.post(obj.url, obj.params)
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async postQuery(obj, tag = true) {
    if (tag) showToast()
    let url = obj.url + '?'
    for (const key in obj.params) {
      url += key + '=' + obj.params[key] + '&'
    }
    try {
      let res = await uniRequest.post(url)
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async post(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await post(obj)
      return responseRes(res)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async postWithQueryAndBody(obj, tag = true) {
    if (tag) showToast()
    try {
      const url = obj.url + '/' + obj.params.query
      let res = await post({
        url,
        params: obj.params.data
      })
      return responseRes(res)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async putWithQueryAndBody(obj, tag = true) {
    if (tag) showToast()
    try {
      const url = obj.url + '/' + obj.params.query
      let res = await putJson({
        url,
        params: obj.params.data
      })
      return responseRes(res)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async putQuery(obj, tag = true) {
    if (tag) showToast()
    try {
      const url = obj.url + '/' + obj.params.query
      let res = await uniRequest.put({
        url
      })
      return responseRes(res)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async postWithQuery(obj, tag = true) {
    if (tag) showToast()
    let url = obj.url + '/' + obj.params.query + '?'
    for (const key in obj.params) {
      url += key + '=' + obj.params[key] + '&'
    }
    try {
      let res = await uniRequest.post(url, qs.stringify({}))
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(err.response.data, obj)
    }
  },
  async del(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await uniRequest.delete(obj.url, {})
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async getWithPara(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await axios({
        url: obj.url + obj.params,
        method: 'get'
      })
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async delele(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await deleteJSON(obj)
      return responseRes(res)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async delQuery(obj, tag = true) {
    if (tag) showToast()
    let url = obj.url + '?'
    for (const key in obj.params) {
      url += key + '=' + obj.params[key] + '&'
    }
    try {
      let res = await uniRequest.delete(url, {})
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  }
}

export default $ajax