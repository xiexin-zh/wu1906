/**
 * @description 公共函数模块
 */
import wx from 'weixin-js-sdk'
import axios from 'axios'
import $ajax from '@u/request.js'
import EXIF from 'exif-js'
import hostEnv from '../config/index.js'
function resultBack(res) {
	return new Promise((resolve) => {
		resolve(res)
	})
}
const tools = {
	/**
	 * @description 路由跳转
	 */
	navTo({
		url,
		title = '智慧校园'
	}) {
		uni.navigateTo({
			url
		})
		setTimeout(() => {
			document.title = title.split('-')[0] || '智慧校园'
		})
	},
	/**
	 * @description 路由跳转关闭当前页面
	 */
	redirectTo({
		url,
		title = '智慧校园'
	} = params) {
		uni.redirectTo({
			url
		})
		setTimeout(() => {
			document.title = title.split('-')[0] || '智慧校园'
		})
	},
	/**
	 * @description 路由返回
	 */
	goBack(delta = 1) {
		uni.navigateBack({
			delta
		})
	},
	/**
	 * @description 函数节流
	 */
	throttle(func, wait) {
		let previous = 0
		return function() {
			let now = Date.now()
			let context = this
			let args = arguments
			if (now - previous > wait) {
				func.apply(context, args)
				previous = now
			}
		}
	},
	/**
	 * @description 获取url传递的参数
	 */
	getQuery() {
		const url = window.location.href
		const params = url.substr(url.lastIndexOf('?')).replace('#/', '')
		return new URLSearchParams(params)
	},
	/**
	 * @description 审批状态
	 * @param {Object} val 状态类型
	 */
	approveState(val) {
		if (val === '0') {
			return '待审批'
		} else if (val === '1') {
			return '同意'
		} else if (val === '2') {
			return '不同意'
		} else if (val === '3') {
			return '撤销'
		} else if (val === '4') {
			return '失效'
		}
	},
	/**
	 * @description 删除操作提示确认框
	 * @param {string} msg 提示语
	 * @param {object} obj 点击确认回调函数
	 */
	delTip(msg = '确认进行此操作吗?', cb) {
		uni.showModal({
			title: '温馨提示',
			content: msg,
			success: function(res) {
				if (res.confirm) {
					cb()
				}
			}
		})
	},
	/**
	 * @description 延迟执行
	 * @param {object} fn 回调函数
	 */
	goNext: (fn) => {
		setTimeout(() => {
			fn()
		}, 1200)
	},
	/**
	 * @description 时间转化
	 * @param {number} t 时间戳
	 * @param {string} type 转换时间的类型
	 */
	getDateTime(t = new Date().getTime(), type = 'dateTime', dataType = 'ms') {
		if(dataType === 's'){
			t = t*1000
		}
		let d = new Date(t)
		const date =
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

		if (type === 'dateTime') {
			return date
		} else if (type === 'dateTimeWithOutSecond') {
			return date.substring(0, 16)
		} else if (type === 'date') {
			return date.substring(0, 10)
		} else if (type === 'time') {
			return date.substring(11, 16)
		} else if (type === 'noSecond') {
			return date.substring(0, 16)
		} else if (type === 'second') {
			return date.substring(11, 19)
		} else if (type === 'month') {
			return date.substring(0, 7)
		} else if (type === 'day') {
			return date.substring(5, 10)
		}
	},
	/**
	 * @description 时间转化
	 * @param {number} t 时间戳
	 * @param {string} type 转换时间的类型
	 */
	getPhoneTime(t = new Date().getTime(), type = 'dateTime') {
		let d = new Date(t)
		const date =
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

		if (type === 'dateTime') {
			return date
		} else if (type === 'dateTimeWithOutSecond') {
			return date.substring(0, 16)
		} else if (type === 'date') {
			return date.substring(0, 10)
		} else if (type === 'time') {
			return date.substring(11, 16)
		} else if (type === 'noSecond') {
			return date.substring(0, 16)
		}
	},
	// 弹出确认框
	/**
	 * @description 弹出确认框
	 * @param {string} content 提示语  
	 * @param {string} cb 回调函数
	 * @param {boolean} isCancle 是否显示取消按钮 默认为true
	 */
	confirm(content, cb, isCancle = true) {
		uni.showModal({
			title: '提示',
			content: content,
			showCancel: isCancle,
			success: function(res) {
				if (res.confirm) {
					if (cb) cb()
				}
			}
		})
	},
	/**
	 * @description toast提示框
	 * param {string} icon 是否有成功提示图标，默认为无（none），如果需要则传1即可 
	 */
	toast(title, icon = 'none') {
		uni.showToast({
			title: title,
			icon
		})
	},
	/**
	 * @description 底部弹出菜单
	 * param {array} arr 菜单数组列表 
	 * param {cb} 点击菜单项的回调函数，参数为点击的索引
	 */
	actionsheet(arr, cb) {
		if (arr.length === 0) return
		let newArr
		if (typeof arr[0] === 'object') {
			newArr = arr.map((item) => {
				return item.label
			})
		} else {
			newArr = arr
		}
		uni.showActionSheet({
			itemList: newArr,
			success: function(res) {
				if (typeof arr[0] === 'object') {
					cb(arr[res.tapIndex])
				} else {
					cb(res.tapIndex)
				}
			},
			fail: function(res) {}
		})
	},
	/**
	 * @description oss图片上传功能
	 * @param {string} code 学校code
	 * @param {object} file 上传的文件，推荐使用文件类型上传
	 * @param {string} fileType 上传文件的类型后缀(png,mp4,docx等)
	 * @param {object} callback 上传成功的回调函数，返回阿里云图片地址
	 */
	ossUpload(code, file, fileType = 'jpg', callback, callbackProgress = ()=>{}, tag = false) {                          
		const _self = this
		axios.get(`http://canpointlive.com:8090/ossApi/oss-policy?schoolCode=${code}&fileType=${fileType}`).then(async res => {
			const aliyunOssToken = res.data.data
			var formData = new FormData()
			// 注意formData里append添加的键的大小写
			formData.append('key', aliyunOssToken.startsWith) // 存储在oss的文件路径
			formData.append('OSSAccessKeyId', aliyunOssToken.OSSAccessKeyId) // accessKeyId
			formData.append('policy', aliyunOssToken.policy) // policy
			formData.append('callback', aliyunOssToken.callback)
			formData.append('Signature', aliyunOssToken.signature) // 签名
			let _file
			if (file.indexOf('blob') > -1) {
				_file = await this.boldToFile(file)
			} else {
				_file = typeof file === 'object' ? file : _self.dataURLToBlob(file)
			}
			formData.append('file', _file)
			formData.append('success_action_status', 200) // 成功后返回的操作码
			_self.source = axios.CancelToken.source()
			uni.showLoading({
				title: '上传中...'
			})
			axios({
				method: 'post',
				url: '/oss_upload',
				data: formData,
				cancelToken: _self.source.token,
				timeout: 300000,
				onUploadProgress(progressEvent) {
					// 上传进度条事件
					if (progressEvent.lengthComputable) {
						const loaded = progressEvent.loaded
						const total = progressEvent.total
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
					uni.hideLoading()
					callback(result)
				},
				rej => {
					// 上传失败
					const result = {
						code: 400,
						msg: '上传失败',
						data: rej.message
					}
					uni.hideLoading()
					callback(result)
				}
			)
		})
	},
	/**
	 * @description 本地blob路径转file文件
	 */
	boldToFile (src) {
		return new Promise((resolve, reject) => {
		    let xhr = new XMLHttpRequest();
		    xhr.open('GET',src,true);
		    xhr.responseType = 'blob';
		    xhr.onload = function(e) {
		      if (this.status == 200) {
		        let myBlob = this.response;
		        let files = new window.File([myBlob], myBlob.type, {type:myBlob.type})  // myBlob.type 自定义文件名
		        resolve(files)
		      }else{
		        reject(false)
		      }
		    };
		  xhr.send();
		})
	},
	// 取消上传
	closeUpload() {
		if (this.source) {
			this.source.cancel('取消上传')
		}
	},
	/**
	 * @description 判断微信还是普通浏览器
	 */
	isWx() {
		var ua = navigator.userAgent.toLowerCase()
		var isWeixin = ua.indexOf('micromessenger') != -1
		if (isWeixin) {
			return true
		} else {
			return false
		}
	},
	/**
	 * @description 判断客户端
	 */
	getClient() {
		let client = ''
		if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
			//判断iPhone|iPad|iPod|iOS
			client = 'IOS'
		} else if (/(Android)/i.test(navigator.userAgent)) {
			//判断Android
			client = 'Android'
		} else {
			client = 'PC'
		}
		return client
	},
	/**
	 * @description 获取url文件名 后缀 类型
	 */
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
	/**
	 * @description 根据url下载文件
	 */
  downloadFile(url) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function(e) {
      if (e.target.readyState === 4 && e.target.status === 200) {
        const blob = this.response
        // 转换一个blob链接
        const a = document.createElement('a')
        a.href = window.URL.createObjectURL(new Blob([blob], { type: tools.getFileTypeByPath(url).fileType }))
        a.download = tools.getFileTypeByPath(url).fileName
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    }
    xhr.send()
  },
	/**
	 * @description 人脸验证
	 * @param {string} base64 照片base64字符串
	 * @param {Object} callback 成功回调函数返回图片url地址
	 */
	async checkPhoto(base64, callback) {
		uni.showLoading({
			title: '上传中...'
		})
		try {
			const res = await $ajax.postForm({
				url: `${hostEnv.hpb_face}/facePhoto`,
				params: {
					userCode: Math.floor(Math.random() * 100000),
					file: base64.split(',')[1]
				}
			})
			if (res.data.result) {
				callback(res.data.url)
			} else {
				this.confirm('人脸照片不符合规范，请重新上传', null, false)
			}
		} catch (err) {}
	},
	// 人脸图片校验
	async checkUserPhoto(baseImg, cb) {
		const _self = this
		var source_img_obj = new Image();
		source_img_obj.src = baseImg;
		source_img_obj.onload = async function() {
			var cvs = document.createElement('canvas');
			var scale = this.height / this.width;
			cvs.width = 500;
			cvs.height = 500 * scale;
			var ctx = cvs.getContext("2d");
			ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
			var newImageData = cvs.toDataURL('image/jpeg', 0.6);
			try {
				const res = await $ajax.postForm({
					url: `${hostEnv.hpb_face}/facePhoto`,
					params: {
						userCode: Math.floor(Math.random() * 100000),
						file: newImageData.split(',')[1]
					}
				})
				if (res.data.result) {
					cb(res.data.url)
				} else {
					_self.confirm('人脸照片不符合规范，请重新上传', null, false)
				}
			} catch (err) {}
		}
	},
	/**
	 * @description 查询学年信息
	 * @param {Object} userInfo 用户信息
	 * @param {Object} callBack 回调函数
	 */
	async getSchoolYear(userInfo, callBack) {
		let schoolYearInfo = {}
		if (userInfo.schoolType === '8' || userInfo.schoolType === '9') {
			let res = await $ajax.post({
				url: `${hostEnv.protal_api_8092}/school/year/manage/list`,
				params: {
					schoolCode: userInfo.schoolCode,
					page: 1,
					size: 999
				}
			}, false)
			if (res.data.records && res.data.records.length > 0) {
				const index = res.data.records.findIndex(list => list.state === '2')
				schoolYearInfo.schoolYear = res.data.records[index].schoolYearName
				schoolYearInfo.schoolYearCode = res.data.records[index].schoolYearCode
				schoolYearInfo.schoolYearId = res.data.records[index].schoolYearName.substring(0, 4)
			} else {
				schoolYearInfo = null
			}
			if (callBack) callBack(schoolYearInfo)
			return schoolYearInfo
		} else {
			let res = await $ajax.postForm({
				url: `${hostEnv.protal_api_11002}/schoolYearSemester/list`,
				params: {
					schoolCode: userInfo.schoolCode
				}
			},false)
			if (res.data) {
				schoolYearInfo.schoolYear = res.data.list[0].schoolYear
				schoolYearInfo.schoolYearId = res.data.list[0].id
			} else {
				schoolYearInfo = null
			}
			if (callBack) callBack(schoolYearInfo)
			return schoolYearInfo
		}
	},
	/**
	 * @description 检验是否是校医
	 * @param {Object} userInfo 用户信息
	 */
	async isDoctor(userInfo) {
		let userDetail = {}
		let res = await $ajax.get({
			url: `${hostEnv.protal_api_11005}/mobile/day/report/getSchoolDoctor`,
			params: {
				userCode: userInfo.userCode,
				schoolCode: userInfo.schoolCode
			}
		})
		userDetail.isDoctor = res.data
		return userDetail
	},
	/**
	 * @description 检验是否是校医
	 * @param {Object} userInfo 用户信息
	 * @param {object} callback 回调函数 
	 */
	async isBZR(userInfo, callBack) {
		let userDetail = {}
		let res = await $ajax.get({
			url: `${hostEnv.protal_api_10166}/mobile/user/info/bind/clazz/info`,
			params: {
				schoolCode: userInfo.schoolCode,
				userType: userInfo.typeCode,
				userCode: userInfo.userCode
			}
		})
		if (res.data.classInfos) {
			userDetail = res.data.classInfos
		} else {
			userDetail = null
		}
		if (callBack) callBack(userDetail)
		return userDetail
	},
	/**
	 * @description base64转化为blob格式
	 * @param {Object} dataurl 图片字符串
	 */
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
	/**
	 * @description 验证是否是宿管
	 * @param {Object} userInfo 用户信息
	 */
	async isDormMamage(userInfo) {
		let userDetail = {}
		let res = await $ajax.get({
			url: `${hostEnv.protal_api_11006}/role/dorm/get`,
			params: {
				schoolCode: userInfo.schoolCode,
				staffCode: userInfo.userCode
			}
		})
		if (res.data) {
			userDetail.buildingCode = res.data.buildingCode
			userDetail.buildingName = res.data.buildingName
		} else {
			userDetail = null
		}
		return userDetail
	},
	/**
	 * @description 获取家长类型
	 * @param {Object} type 家属类型
	 */
	getParentType(type) {
		let msg = ''
		switch (parseInt(type)) {
			case 1:
				msg = '爸爸'
				break
			case 2:
				msg = '妈妈'
				break
			case 3:
				msg = '爷爷'
				break
			case 4:
				msg = '奶奶'
				break
			case 5:
				msg = '其他'
				break
			default:
				msg = '其他'
				break
		}
		return msg
	},
	/**
	 * @description 获取考勤类型
	 * @param {Object} value 考勤类型
	 */
	getState(value) {
		if (value === 1) {
			return '迟到'
		} else if (value === 2) {
			return '早退'
		} else if (value === 3 || value === 6) {
			return '缺卡'
		} else if (value === 4) {
			return '请假'
		} else if (value === 5) {
			return '正常'
		} else if (value === 7) {
			return '缺勤'
		}
	},
	/**
	 * @description 解决input框失去焦点后界面错位问题
	 */
	inputScroll() {
		document.body.addEventListener('focusin', () => {
			this.isReset = false
		})
		document.body.addEventListener('focusout', () => {
			this.isReset = true
			setTimeout(() => {
				if (this.isReset) {
					window.scrollTo(0, 0)
				}
			}, 100)
		})
	},
	/**
	 * @description 判断性别
	 * @param {Object} type 性别类型
	 */
	getSex(type) {
		let msg = ''
		switch (parseInt(type)) {
			case 1:
				msg = '男'
				break
			case 2:
				msg = '女'
				break
			default:
				msg = '未知'
				break
		}
		return msg
	},
	/**
	 * @description base64截取
	 * @param {Object} photoUrls base64数组
	 */
	splitBase64(photoUrls) {
		return photoUrls.map((el) => {
			return el.split(',')[1]
		})
	},
	/**
	 * @description 获取事故等级
	 * @param {Object} text 等级类型
	 */
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
	/**
	 * @description 获取事故性质
	 * @param {Object} text 事故性质类型
	 */
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
	/**
	 * @description 获取事故类型
	 * @param {Object} text 事故类型
	 */
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
	/**
	 * @description 获取事故状态
	 * @param {Object} text 故状态
	 */
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
	/**
	 * @description 获取政治面貌
	 * @param {String} state 
	 */
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
    if (state === 4) {
      return '其他'
    }
    return ''
  },
}

export default tools
