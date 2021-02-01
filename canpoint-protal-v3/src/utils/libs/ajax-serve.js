/**
 * @description 封装http请求功能
 * @author 张立
 */

import axios from 'axios'
import qs from 'qs'
import { Modal, message } from 'ant-design-vue'
import Vue from 'vue'
let loading
message.config({
  maxCount: 1,
  top: '25px',
  duration: 2
})
const vm = new Vue()

// 请求超时时间
axios.defaults.timeout = 15000
axios.defaults.withCredentials = true // 让ajax携带cookie
axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token') || ''
// 设置公用请求头
// 拦截请求
axios.interceptors.request.use(
  function(config) {
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

// 拦截响应
axios.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    return Promise.reject(error)
  }
)

const showToast = (tip = '') => {
  loading = vm.$message.loading('加载中...', 0)
}

// 处理响应结果
function responseRes(res, obj, isTip) {
  // 清除加载
  setTimeout(loading, 0)
  return new Promise((resolve, reject) => {
    if (res.code === 200 || res.status === true || res.status === 200) {
      resolve(res)
    } else if (res.code === 401) {
      Modal.warning({
        title: '提示',
        okText: '确定',
        content: '认证过期，请重新登录',
        onOk: function() {
          window.sessionStorage.clear()
          if (process.env.NODE_ENV === 'production') {
            if (window.parent) {
              window.parent.location.href = '/login-v3'
            } else {
              window.location.href = '/login-v3'
            }
          } else {
            if (window.parent) {
              window.parent.location.href = '/protal-login.html'
            } else {
              window.location.href = '/protal-login.html'
            }
          }
        }
      })
    } else {
      if (isTip) {
        Modal.warning({
          title: '提示',
          content: res.message || res.msg || '数据请求失败, 请联系管理员',
          onOk: function() {}
        })
      }
      try {
        reject(res.message)
      } catch (err) {}
      if (process.env.NODE_ENV === 'production') {
        sendError({
          message: res.message,
          url: obj.url,
          params: obj.params
        })
      }
    }
  })
}

/**
 * 服务器返回异常处理
 */
const errorTip = err => {
  setTimeout(loading, 0)
  let msg = '服务异常'
  return new Promise((resolve, reject) => {
    if (err.response) {
      if (err.response.status === 401) {
        msg = '认证过期，请重新登录'
        Modal.warning({
          title: '提示',
          okText: '确定',
          content: msg,
          onOk: function() {
            window.sessionStorage.clear()
            if (process.env.NODE_ENV === 'production') {
              if (window.parent) {
                window.parent.location.href = '/login-v3'
              } else {
                window.location.href = '/login-v3'
              }
            } else {
              if (window.parent) {
                window.parent.location.href = '/protal-login.html'
              } else {
                window.location.href = '/protal-login.html'
              }
            }
          }
        })
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('error')
        return
      } else {
        msg = err.response.data.message || '服务异常，请重新尝试'
      }
    } else {
      msg = '服务异常，请重新尝试'
    }
    Modal.warning({
      title: '提示',
      okText: '确定',
      content: msg,
      onOk: function() {}
    })
    // eslint-disable-next-line prefer-promise-reject-errors
    reject('error')
  })
}

const $http = {
  async get(obj, tag = true, isTip = true) {
    if (tag) showToast()
    try {
      let res = await axios.get(obj.url, {
        params: obj.params || ''
      })
      res = res.data
      return responseRes(res, obj, isTip)
    } catch (err) {
      return errorTip(err)
    }
  },
  async getUrl(obj, tag = true, isTip = true) {
    if (tag) showToast()
    try {
      let res = await axios.get(obj.url, {})
      res = res.data
      return responseRes(res, obj, isTip)
    } catch (err) {
      return errorTip(err)
    }
  },
  async getQuery(obj, tag = true, isTip = true) {
    if (tag) showToast()
    let url = obj.url + '?'
    for (const key in obj.params) {
      url += key + '=' + obj.params[key] + '&'
    }
    try {
      let res = await axios.get(url, qs.stringify({}))
      res = res.data
      return responseRes(res, obj, isTip)
    } catch (err) {
      return errorTip(err)
    }
  },
  async postForm(obj, tag = true, isTip = true) {
    if (tag) showToast()
    try {
      let res = await axios.post(obj.url, qs.stringify(obj.params))
      res = res.data
      return responseRes(res, obj, isTip)
    } catch (err) {
      return errorTip(err)
    }
  },
  async post(obj, tag = true, isTip = true) {
    if (tag) showToast()
    try {
      let res = await axios({
        url: obj.url,
        method: 'post',
        data: obj.params,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      res = res.data
      return responseRes(res, obj, isTip)
    } catch (err) {
      return errorTip(err)
    }
  },
  async postJsonQuery(obj, tag = true, isTip = true) {
    if (tag) showToast()
    let url = obj.url + '?'
    for (const key in obj.params) {
      url += key + '=' + obj.params[key] + '&'
    }
    try {
      let res = await axios({
        url: url,
        method: 'post',
        data: obj.params,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      res = res.data
      return responseRes(res, obj, isTip)
    } catch (err) {
      return errorTip(err)
    }
  },
  async postQuery(obj, tag = true, isTip = true) {
    if (tag) showToast()
    let url = obj.url + '?'
    for (const key in obj.params) {
      url += key + '=' + obj.params[key] + '&'
    }
    try {
      let res = await axios.post(url, qs.stringify({}))
      res = res.data
      return responseRes(res, obj, isTip)
    } catch (err) {
      return errorTip(err)
    }
  },
  async del(obj, tag = true, isTip = true) {
    if (tag) showToast()
    try {
      let res = await axios.delete(obj.url, {
        params: obj.params || ''
      })
      res = res.data
      return responseRes(res, obj, isTip)
    } catch (err) {
      return errorTip(err)
    }
  },
  async delQuery(obj, tag = true, isTip = true) {
    if (tag) showToast()
    let url = obj.url + '?'
    for (const key in obj.params) {
      url += key + '=' + obj.params[key] + '&'
    }
    try {
      let res = await axios.delete(url, {})
      res = res.data
      return responseRes(res, obj, isTip)
    } catch (err) {
      return errorTip(err)
    }
  },
  async delete(obj, tag = true, isTip = true) {
    if (tag) showToast()
    try {
      let res = await axios({
        url: obj.url,
        method: 'delete',
        data: obj.params,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      res = res.data
      return responseRes(res, obj, isTip)
    } catch (err) {
      return errorTip(err)
    }
  },
  async put(obj, tag = true, isTip = true) {
    if (tag) showToast()
    try {
      let res = await axios.put(obj.url, qs.stringify(obj.params))
      res = res.data
      return responseRes(res, obj, isTip)
    } catch (err) {
      return errorTip(err)
    }
  }
}

const sendError = obj => {
  const loginInfo = sessionStorage.getItem('loginInfo')
  if (!loginInfo) return
  const { userName, schoolCode, schoolName } = JSON.parse(loginInfo)
  const { message, url, params } = obj
  axios({
    url: 'http://canpointtest.com:8090/errorApi/addErrorApi',
    method: 'post',
    data: {
      status: 0,
      platform: 2,
      message,
      url,
      params,
      userName,
      schoolCode,
      schoolName,
      createTime: new Date().getTime()
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {})
}

export default $http
