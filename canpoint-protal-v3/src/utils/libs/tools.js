/**
 * @deprecated 云平台基础函数库
 * @author 谢新
 */
import axios from 'axios'
import { message as $message } from 'ant-design-vue'
import Vue from 'vue'
const vm = new Vue({})
const tools = {
  /**
   * @description 根据时间戳格式化时间
   * @param { number || string } t 时间戳
   * @param { number } type 需要的时间类型
   * @param { string } dataType 时间戳类型(单位)
   * @returns { string } 返回时间字符串
   */
  getDate(t, type, dataType = 'ms') {
    if (dataType === 's') {
      t = t * 1000
    }
    const d = new Date(t || new Date().getTime())
    const time =
      d.getFullYear() +
      '-' +
      (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
      '-' +
      (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
      ' ' +
      (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
      ':' +
      (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
      ':' +
      (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
    if (type === 1) {
      return time.substring(0, 10)
    } else if (type === 2) {
      return time.substring(11, 19)
    } else if (type === 3) {
      return time.substring(0, 7)
    } else if (type === 4) {
      return time.substr(11, 5)
    } else if (type === 5) {
      return time.substr(0, 19)
    } else if (type === 6) {
      return time.substr(0, 16)
    } else if (type === 7) {
      return time.substring(11, 16)
    } else {
      return time
    }
  },
  /**
   * @description 表单回填
   * @param { array } autoForm 待回填表单
   * @param { object } record 待回填数据
   */
  fillForm(autoForm, record) {
    return autoForm.map(item => {
      var initValue
      initValue = record[item.value] || ''
      if (parseInt(record[item.value]) === 0) {
        initValue = 0
      }
      if (item.type === 'rangeTime') {
        initValue = [record.startTime, record.endTime]
      }
      if (item.type === 'checkbox') {
        initValue = Array.isArray(initValue) ? initValue : initValue.split(',')
      }
      return {
        ...item,
        initValue: initValue
      }
    })
  },
  /**
   * @description 阿里云图片上传
   * @param { string } code 学校code
   * @param { binary } file 文件对象
   * @param { string } fileType 文件类型
   * @param { function } callback 回调函数
   * @param { function } callbackProgress 上传进度回调
   * @returns { undefined }
   */
  ossUpload(code, file, fileType = 'jpg', callback, callbackProgress) {
    const _self = this
    axios.get(`http://canpointtest.com:8090/ossApi/oss-policy?schoolCode=${code}&fileType=${fileType}`).then(res => {
      const aliyunOssToken = res.data.data
      var formData = new FormData()
      // 注意formData里append添加的键的大小写
      formData.append('key', aliyunOssToken.startsWith) // 存储在oss的文件路径
      formData.append('OSSAccessKeyId', aliyunOssToken.OSSAccessKeyId) // accessKeyId
      formData.append('policy', aliyunOssToken.policy) // policy
      formData.append('callback', aliyunOssToken.callback)
      formData.append('Signature', aliyunOssToken.signature) // 签名
      const _file = typeof file === 'object' ? file : _self.dataURLToBlob(file)
      // console.log(typeof file)
      formData.append('file', _file)
      formData.append('success_action_status', 200) // 成功后返回的操作码
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
      _self.source = axios.CancelToken.source()
      axios({
        method: 'post',
        url: '/oss_upload',
        data: formData,
        cancelToken: this.source.token,
        timeout: 300000,
        onUploadProgress(progressEvent) {
          // 上传进度条事件
          if (progressEvent.lengthComputable) {
            const loaded = progressEvent.loaded
            const total = progressEvent.total
            callbackProgress &&
              callbackProgress(Math.floor((loaded / total) * 100) > 1 ? Math.floor((loaded / total) * 100) : 1)
          }
        }
      }).then(
        res => {
          const result = {
            code: 200,
            msg: '上传成功',
            data: res.data.data
          }
          callback(result)
        },
        rej => {
          // 上传失败
          const result = {
            code: 400,
            msg: '上传失败',
            data: rej.message
          }
          callback(result)
        }
      )
    })
  },

  /**
   * @description 延迟处理方法
   * @param { function } fn 待延迟执行的方法
   * @returns { undefined }
   */
  goNext: fn => {
    setTimeout(() => {
      fn()
    }, 1200)
  },

  /**
   * 操作提示
   * @param { string } type  提示类型（success，error，info，warning，warn，loading）
   * @param { string } msg 提示内容
   * @param { number } time 提示关闭时间
   * @returns { undefined }
   */
  message: (type, msg, time) => {
    if ($message.hasOwnProperty(type)) {
      $message[type](msg || '', time || 1500)
    } else {
      $message.info(msg || '', time || 1500)
    }
  },
  /**
   * 删除提示
   * @param { string } title  提示内容
   * @param { function } callback 回调函数
   */
  delTip(title = '确定删除吗?', fn) {
    vm.$Modal.confirm({
      title,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        fn()
      }
    })
  }
}

export default tools
