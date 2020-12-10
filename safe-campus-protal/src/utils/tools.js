/**
 * @description 全局的功能函数
 */

import Vue from 'vue'
import axios from 'axios'
import baseData from './base-data'
import autoImg from '@a/img/auto_app.png'
import moment from 'moment'
const vm = new Vue({})

const Tools = {
  // 深拷贝数据
  deepClone(data) {
    return JSON.parse(JSON.stringify(data))
  },
  // 根据时间戳获取日期
  getDate(t, type) {
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
  // 根据日期获取时间撮
  getDateTime(date) {
    return new Date(date.replace(/-/g, '/'))
  },
  // html图片转换格式的方法
  dataURLToBlob(dataurl) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {
      type: mime
    })
  },
  // 设置table滚动高度
  setScroll(id) {
    if (document.getElementById(id)) {
      return document.getElementById(id).offsetHeight - 40
    }
  },
  // 设置table滚动高度
  setScrollX(id) {
    if (document.getElementById(id)) {
      return document.getElementById(id).offsetWidth
    }
  },
  // 延迟处理方法
  goNext: fn => {
    setTimeout(() => {
      fn()
    }, 1200)
  },
  // 删除提示
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
  },
  // 时间转化
  gmtToDate(t, type, tag = '/') {
    const d = new Date(t)
    const time =
      d.getFullYear() +
      tag +
      (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
      tag +
      (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
      ' ' +
      (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
      ':' +
      (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes())
    if (type === 1) {
      return time.substring(0, 10)
    } else if (type === 2) {
      return time.substring(11, 19)
    } else if (type === 3) {
      return time.substring(0, 7)
    } else if (type === 4) {
      return time.substr(11, 5)
    } else {
      return time
    }
  },
  // 表单回填
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
  // 加载图片错误处理
  errorImg(event, img) {
    event.target.src = img || autoImg
  },
  // oss图片上传 code:学生code file: 上传文件或base64 fileType: 文件类型，base64时传jpg
  ossUpload(code, file, fileType = 'jpg', callback, callbackProgress) {
    const _self = this
    axios
      .get(`http://canpointlive.com:8090/ossApi/oss-policy?schoolCode=${code}&fileType=${fileType}`)
      .then(res => {
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
                callbackProgress(
                  Math.floor((loaded / total) * 100) > 1 ? Math.floor((loaded / total) * 100) : 1
                )
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
  // 获取url文件名 后缀 类型
  getFileTypeByPath(path) {
    const typeObj = {
      fileName: '',
      fileType: '',
      fileExtension: ''
    }
    var index = path.lastIndexOf('/')
    typeObj.fileName = path.substr(index + 1)
    var index1 = path.lastIndexOf('.')
    typeObj.fileType = path.substr(index1 + 1)
    var index2 = path.length
    typeObj.fileExtension = path.substr(index1, index2)
    return typeObj
  },
  // 根据url下载文件
  downloadFile(url) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function(e) {
      if (e.target.readyState === 4 && e.target.status === 200) {
        const blob = this.response
        // 转换一个blob链接
        const a = document.createElement('a')
        a.href = window.URL.createObjectURL(
          new Blob([blob], {
            type: Tools.getFileTypeByPath(url).fileType
          })
        )
        a.download =
          Tools.getFileTypeByPath(url).fileName + moment(new Date().getTime()).format('YYYY-MM-DD')
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    }
    xhr.send()
  },
  // 取消上传
  closeUpload() {
    if (this.source) {
      this.source.cancel('取消上传')
    }
  },
  color(text) {
    if (text === 1) {
      return '#ff9900'
    } else if (text === 2) {
      return '#fa3534'
    } else if (text === 3 || text === 6) {
      return '#c76c4a'
    } else if (text === 4) {
      return '#a0cfff'
    } else if (text === 5) {
      return '#71d5a1'
    } else if (text === 7) {
      return '#fab6b6'
    }
  },
  userType(text) {
    text = parseInt(text)
    if (text === 1) {
      return '超级管理员'
    } else if (text === 2) {
      return '管理员'
    } else if (text === 4) {
      return '教职工'
    } else if (text === 8) {
      return '学生'
    } else if (text === 16) {
      return '家长'
    } else if (text === 32) {
      return '访客'
    } else {
      return '未知'
    }
  },
  getCardStatus(text) {
    text = parseInt(text)
    if (text === 0) {
      return '正常'
    } else if (text === -1) {
      return '未发卡'
    } else if (text === 1) {
      return '已挂失'
    } else if (text === 2) {
      return '已销卡'
    }
  },
  getApprovalColor(text) {
    if (parseInt(text) === 0 || text === '未开始') {
      return '#87d068'
    } else if (parseInt(text) === 1 || text === '使用中') {
      return '#2db7f5'
    } else if (parseInt(text) === 2) {
      return '#f50'
    } else if (parseInt(text) === 3 || text === '已失效') {
      return '#ccc'
    } else if (parseInt(text) === 4 || text === '审批中') {
      return '#006400'
    }
  },
  relationship(text) {
    text = parseInt(text)
    if (text === 1) {
      return '爸爸'
    } else if (text === 2) {
      return '妈妈'
    } else if (text === 3) {
      return '爷爷'
    } else if (text === 4) {
      return '奶奶'
    } else {
      return '其他'
    }
  },
  stateType(text) {
    text = parseInt(text)
    if (text === 0) {
      return '待处理'
    } else if (text === 1) {
      return '处理中'
    } else if (text === 2) {
      return '未同意'
    } else if (text === 3) {
      return '已修复'
    } else if (text === 4) {
      return '未修复'
    } else if (text === 5) {
      return '已处理'
    } else {
      return '已撤回'
    }
  },
  opeType(text) {
    text = parseInt(text)
    if (text === 1) {
      return '付款'
    } else if (text === 2) {
      return '关闭'
    } else if (text === 3) {
      return '删除'
    } else if (text === 4) {
      return '打印'
    } else if (text === 5) {
      return '创建'
    } else {
      return '催缴'
    }
  },
  billStatu(text) {
    text = parseInt(text)
    if (text === 1) {
      return '待缴费'
    } else if (text === 2) {
      return '已缴费'
    } else if (text === 3) {
      return '账单关闭'
    } else if (text === 4) {
      return '逾时'
    }
  },
  stateTypeColor(text) {
    text = parseInt(text)
    if (parseInt(text) === 0) {
      return '#778899'
    } else if (parseInt(text) === 1) {
      return '#2db7f5'
    } else if (parseInt(text) === 2) {
      return '#A52A2A'
    } else if (parseInt(text) === 3) {
      return '#8FBC8F'
    } else if (parseInt(text) === 4) {
      return '#f50'
    } else if (parseInt(text) === 5) {
      return '#87d068'
    } else {
      return '#A9A9A9'
    }
  },
  getType(text) {
    text = parseInt(text)
    if (text === 0) {
      return '待审批'
    } else if (text === 1) {
      return '待发放'
    } else if (text === 2) {
      return '已退回'
    } else if (text === 3) {
      return '已发放'
    }
  },
  stateColor(text) {
    text = parseInt(text)
    if (parseInt(text) === 0) {
      return '#108ee9'
    } else if (parseInt(text) === 1) {
      return '#2db7f5'
    } else if (parseInt(text) === 2) {
      return '#f50'
    } else if (parseInt(text) === 3) {
      return ' #87d068'
    }
  },
  appStateType(text) {
    text = parseInt(text)
    if (text === 1) {
      return '待审批'
    } else if (text === 2) {
      return '已同意'
    } else if (text === 3) {
      return '未同意'
    } else if (text === 4) {
      return '已撤回'
    }
  },
  appState(text) {
    text = parseInt(text)
    if (parseInt(text) === 1) {
      return '#108ee9'
    } else if (parseInt(text) === 2) {
      return '#87d068'
    } else if (parseInt(text) === 3) {
      return '#2db7f5'
    } else if (parseInt(text) === 4) {
      return ' #f50'
    }
  },
  sourceDanger(text) {
    text = parseInt(text)
    if (parseInt(text) === 1) {
      return '隐患排查'
    } else if (parseInt(text) === 2) {
      return '日常巡查'
    } else if (parseInt(text) === 3) {
      return '专项检查'
    } else if (parseInt(text) === 4) {
      return '社会监督'
    }
  },
  dangerLevel(text) {
    text = parseInt(text)
    if (parseInt(text) === 1) {
      return '低风险'
    } else if (parseInt(text) === 2) {
      return '一般风险'
    } else if (parseInt(text) === 3) {
      return '较大风险'
    } else if (parseInt(text) === 4) {
      return '重大风险'
    }
  },
  dangerState(text) {
    text = parseInt(text)
    if (parseInt(text) === 1) {
      return '已上报'
    } else if (parseInt(text) === 2) {
      return '已指派'
    } else if (parseInt(text) === 3) {
      return '已处理'
    } else if (parseInt(text) === 4) {
      return '已验收'
    } else if (parseInt(text) === 5) {
      return '已撤销'
    }
  },
  stAte(text) {
    text = parseInt(text)
    if (text === 0) {
      return '待审批'
    } else if (text === 1) {
      return '待发放'
    } else if (text === 2) {
      return '已退回'
    } else if (text === 3) {
      return '已发放'
    }
  },
  // 事故等级
  accidentLevel(text) {
    text = parseInt(text)
    if (text === 1) {
      return '特大重大事故'
    } else if (text === 2) {
      return '重大事故'
    } else if (text === 3) {
      return '较大事故'
    } else if (text === 4) {
      return '一般事故'
    }
  },
  // 事故性质
  accidentNature(text) {
    text = parseInt(text)
    if (text === 1) {
      return '责任事故'
    } else if (text === 2) {
      return '自然事故'
    } else if (text === 3) {
      return '技术事故'
    } else if (text === 4) {
      return '其它'
    }
  },
  // 事故类型
  accidentType(text) {
    text = parseInt(text)
    if (text === 1) {
      return '交通事故'
    } else if (text === 2) {
      return '踩踏事故'
    } else if (text === 3) {
      return '溺水事故'
    } else if (text === 4) {
      return '火灾事故'
    } else if (text === 5) {
      return '触电事故'
    } else if (text === 6) {
      return '校园伤害'
    } else if (text === 7) {
      return '其它'
    }
  },
  // 事故状态
  accidentStatus(text) {
    text = parseInt(text)
    if (text === 1) {
      return '新填报'
    } else if (text === 2) {
      return '处理中'
    } else if (text === 3) {
      return '已结案'
    }
  },
  // 任务状态
  taskStatus(text) {
    text = parseInt(text)
    if (text === 1) {
      return '未检查'
    } else if (text === 2) {
      return '检查待审核'
    } else if (text === 3) {
      return '小组已审核'
    } else if (text === 4) {
      return '督查完成'
    }
  },
  // 考勤班次
  classState(text) {
    text = parseInt(text)
    if (text === 1) {
      return '上午上班'
    } else if (text === 2) {
      return '上午下班'
    } else if (text === 3) {
      return '下午上班'
    } else if (text === 4) {
      return '下午下班'
    }
  },
  // 考勤状态
  attendanceState(text, type) {
    if (text === '迟到') {
      return '1'
    } else if (text === '早退') {
      return '2'
    } else if (text === '上午缺卡') {
      return '3'
    } else if (text === '请假') {
      return '4'
    } else if (text === '正常') {
      return '5'
    } else if (text === '下午缺卡') {
      return '6'
    } else if (text === '缺卡' && type === 2) {
      return '3'
    } else if (text === '缺卡' && type === 3) {
      return '6'
    }
  },
  // 获取年级名称
  getGradeName(id, gradeList) {
    if (!id || !gradeList || gradeList.length === 0) {
      return ''
    }
    const list = gradeList.filter(item => {
      return item.id === id
    })
    if (list.length > 0) {
      return list[0].gradeName
    }
    return ''
  },
  // 招生迎新h5线上地址
  getApplyAppLiveUrl() {
    return 'http://canpointlive.com/mobile-protal/apply/index.html#/'
  },
  // 学生状态
  getStudentStatus(state) {
    if (state === '1') {
      return '在读'
    }
    if (state === '2') {
      return '已毕业'
    }
    if (state === '3') {
      return '已转学'
    }
    if (state === '4') {
      return '已休学'
    }
    if (state === '5') {
      return '已辍学'
    }
    return '未知'
  },
  // 获取政治面貌
  getPoliticsStatus(state) {
    state = parseInt(state)
    if (state === 1) {
      return '党员'
    }
    if (state === 2) {
      return '团员'
    }
    if (state === 3) {
      return '群众'
    }
    return '其他'
  },
  // 获取学生奖励类型
  getAwardType(state) {
    if (state === '1') {
      return '市级三好学生'
    }
    if (state === '2') {
      return '市级优秀学生干部'
    }
    if (state === '3') {
      return '县级三好学生'
    }
    if (state === '4') {
      return '校级三好学生'
    }
    if (state === '5') {
      return '校级优秀学生干部'
    }
    if (state === '6') {
      return '校级合格学生'
    }
    if (state === '7') {
      return '校级优秀团员'
    }
    if (state === '8') {
      return '校级进步学生'
    }
    return '其他'
  },
  // 获取学生处分类型
  getPunishmentType(state) {
    if (state === '1') {
      return '批评教育'
    }
    if (state === '2') {
      return '通报批评'
    }
    if (state === '3') {
      return '警告'
    }
    if (state === '4') {
      return '严重警告'
    }
    if (state === '5') {
      return '记过'
    }
    if (state === '6') {
      return '留校察看'
    }
    if (state === '7') {
      return '勒令退学'
    }
    return '其他'
  },
  // 是否绑定家长
  isBindParent(state) {
    if (state === '1') {
      return true
    }
    if (state === '2') {
      return false
    }
    return ''
  },
  // 是否分班
  isReport(state) {
    if (state === '1') {
      return true
    }
    if (state === '2') {
      return false
    }
    return ''
  },
  // 获取大写数字
  getLargeNumber(num) {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    let unit = ['', '十', '百', '千', '万']
    num = parseInt(num)
    let getWan = temp => {
      let strArr = temp
        .toString()
        .split('')
        .reverse()
      let newNum = ''
      for (var i = 0; i < strArr.length; i++) {
        newNum =
          (i == 0 && strArr[i] == 0
            ? ''
            : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
            ? ''
            : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) + newNum
      }
      return newNum
    }
    let overWan = Math.floor(num / 10000)
    let noWan = num % 10000
    if (noWan.toString().length < 4) noWan = '0' + noWan
    return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
  },
  ...baseData
}

export default Tools
