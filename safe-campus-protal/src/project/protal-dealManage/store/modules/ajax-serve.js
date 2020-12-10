/**
 * @description 封装http请求功能
 * @author zhangli
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

// 设置公用请求头
axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('Authorization')

// 拦截请求
axios.interceptors.request.use(
  function(config) {
    return new Promise(resolve => {
      if (config.url.indexOf('token') !== -1) {
        resolve(config)
      } else {
        if (!window.localStorage.getItem('Authorization')) {
          if (isRefreshing) {
            refreshTokenRequst()
          }
          isRefreshing = false
        }
        resolve(config)
      }
    })
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

// 刷新tooken
let isRefreshing = true
function refreshTokenRequst() {
  axios
    .request({
      url: `/protal_api_11022/oauth/token?client_id=trade-web&client_secret=secret&grant_type=client_credentials`,
      method: 'post'
    })
    .then(response => {
      const Authorization = response.data.tokenType + ' ' + response.data.value
      console.log(Authorization)
      window.localStorage.setItem('Authorization', Authorization)
      window.location.reload()
      isRefreshing = true
    })
}

// 处理响应结果
function responseRes(res, obj) {
  // 清除加载
  setTimeout(loading, 0)
  return new Promise((resolve, reject) => {
    if (res.code === 200 || res.status === true || res.status === 200) {
      resolve(res)
    } else if (res.code === 0) {
    } else if (res.code === 401) {
      Modal.warning({
        title: '提示',
        okText: '确定',
        content: '认证过期，请重新登录',
        onOk: function() {}
      })
    } else {
      Modal.warning({
        title: '提示',
        content: res.message || res.msg || '数据请求失败, 请联系管理员',
        onOk: function() {}
      })
      reject(res.message)
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

const errMsg = {
  code: -1,
  message: '服务器异常...'
}

const $ajax = {
  async get(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await axios.get(obj.url, {
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
      let res = await axios.get(obj.url, {})
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async postForm(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await axios.post(obj.url, qs.stringify(obj.params))
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async post(obj, tag = true) {
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
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async delForm(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await axios({
        url: obj.url,
        method: 'DELETE',
        data: obj.params,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async postJsonQuery(obj, tag = true) {
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
      let res = await axios.post(url, qs.stringify({}))
      res = res.data
      return responseRes(res, obj)
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
      let res = await axios.post(url, qs.stringify({}))
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(err.response.data, obj)
    }
  },
  async postWithQueryAndBody(obj, tag = true) {
    if (tag) showToast()
    try {
      const url = obj.url + '/' + obj.params.query
      let res = await axios({
        url: url,
        method: 'post',
        data: obj.params.data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(err.response.data, obj)
    }
  },
  async del(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await axios.delete(obj.url, {
        params: obj.params || ''
      })
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
      let res = await axios.delete(url, {})
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async putUrl(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await axios.put(obj.url)
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async put(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await axios.put(obj.url, qs.stringify(obj.params))
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async putJson(obj, tag = true) {
    if (tag) showToast()
    try {
      let res = await axios({
        url: obj.url,
        method: 'put',
        data: obj.params,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async putWithQueryAndBody(obj, tag = true) {
    if (tag) showToast()
    try {
      const url = obj.url + '/' + obj.params.query
      let res = await axios({
        url: url,
        method: 'put',
        data: obj.params.data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(err.response.data, obj)
    }
  },
  async putWithQuery(obj, tag = true) {
    if (tag) showToast()
    try {
      const url = obj.url + '/' + obj.params.query
      let res = await axios.put(url, qs.stringify(obj.params))
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(err.response.data, obj)
    }
  },
  async putQuery(obj, tag = true) {
    if (tag) showToast()
    let url = obj.url + '/' + '?'
    for (const key in obj.params) {
      url += key + '=' + obj.params[key] + '&'
    }
    try {
      let res = await axios.put(url, qs.stringify({}))
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(err.response.data, obj)
    }
  },
  async delWithQuery(obj, tag = true) {
    if (tag) showToast()
    try {
      const url = obj.url + '/' + obj.params
      let res = await axios.delete(url, qs.stringify(obj.params))
      res = res.data
      return responseRes(res, obj)
    } catch (err) {
      return responseRes(err.response.data, obj)
    }
  },
  async delete(obj, tag = true) {
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
  async export(obj, tag = true) {
    if (tag) showToast()
    try {
      axios
        .request({
          url: obj.url,
          method: 'post',
          data: obj.params,
          responseType: 'blob'
        })
        .then(res => {
          // Blob 对象表示一个不可变、原始数据的类文件对象（File 接口都是基于Blob）
          console.log(res)
          const BLOB = res.data
          // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件的内容
          const fileReader = new FileReader()
          // 开始读取指定的Blob中的内容。读取完成result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容
          fileReader.readAsDataURL(BLOB)
          // 处理load事件，该事件在读取操作完成时触发
          fileReader.onload = event => {
            console.log(event)
            const a = document.createElement('a')
            a.download = `${obj.params.name || '文件'}.xls`
            a.href = event.target.result
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            responseRes(res, obj)
          }
        })
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async exportWithQuery(obj, tag = true) {
    if (tag) showToast()
    try {
      let url = obj.url + '?'
      for (const key in obj.params) {
        url += key + '=' + obj.params[key] + '&'
      }
      axios
        .request({
          url: url,
          method: 'post',
          responseType: 'blob'
        })
        .then(res => {
          console.log(res)
          const BLOB = res.data
          const fileReader = new FileReader()
          fileReader.readAsDataURL(BLOB)
          fileReader.onload = event => {
            console.log(event)
            const a = document.createElement('a')
            a.download = `${obj.params.name || '课程表'}.xls`
            a.href = event.target.result
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            responseRes(res, obj)
          }
        })
    } catch (err) {
      return responseRes(errMsg, obj)
    }
  },
  async zipExport(obj, tag = true) {
    if (tag) showToast()
    try {
      axios
        .request({
          url: obj.url,
          method: 'post',
          data: obj.params,
          responseType: 'arraybuffer'
        })
        .then(res => {
          console.log(res)
          const data = res.data
          const blob = new Blob([data], {
            type: 'application/zip;charset=UTF-8'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', `${obj.params.name || '课程表'}.zip`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          responseRes(res, obj)
        })
    } catch (err) {
      return responseRes(errMsg, obj)
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

export default $ajax
