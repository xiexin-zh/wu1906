import wx from "weixin-js-sdk";
import config from "@config";
import $tools from "./tools";
import uniRequest from "uni-request";
const wxApi = {
	/**
	 * @description 通过微信公众号配置的域名获取学校code
	 * @param {Object} callback
	 */
	getConfigSchoolCode(callback) {
		try {
			uniRequest
			.get('/getSchoolCode', {
				params: {
					path: window.location.href.split('#')[0]
				}
			})
			.then(response => {
				uni.setStorageSync('_schoolCode', response.data.data)
				callback(response.data.data)
			})
		} catch(err) {
			callback('CANPOINT')
		}
	},
	/**
	 * @description js-sdk签名认证
	 */
	getConfig(type) {
		if (window.sessionStorage.getItem(type)) return
		const url = '/getTicket';
		uniRequest
			.get(url, {
				params: {
					path: window.location.href.split('#')[0],
					schoolCode: uni.getStorageSync('_schoolCode') || 'CANPOINT'
				}
			}) 
			.then(response => {
				const res = response.data;
				uni.setStorageSync('access_token', res.access_token)
				wx.config({
					// debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: res.appId, // 必填，公众号的唯一标识
					timestamp: res.timestamp, // 必填，生成签名的时间戳
					nonceStr: res.nonceStr, // 必填，生成签名的随机串
					signature: res.signature, // 必填，签名
					jsApiList: ['uploadVoice', 'onVoicePlayEnd', 'stopVoice', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'openLocation', 'getLocation', 'scanQRCode', 'chooseImage', 'getLocalImgData', 'updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
				});
				wx.error(function(res) {});
				wx.ready(function() {
					window.sessionStorage.setItem(type, 'ok')
				});
			})
			.catch(error => {
				console.log(error); //异常
			});
	},
	/**
	 * @description 拍照上传
	 * @param {object} callback 上传后的回调函数，返回图片的url
	 * @param {boolean} type 是否人脸上传，true为是，false为否，默认为false
	 */
	wxChoosePhoto(callback, type = false, backUrl) {
		var ua = navigator.userAgent.toLowerCase();
		var isWeixin = ua.indexOf('micromessenger') != -1;
		if (isWeixin) {
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: res => {
					// 人脸上传
					wx.getLocalImgData({
						localId: res.localIds[0],
						success: base => {
							let { localData } = base; // localData是图片的base64数据，可以用img标签显示
							if (localData.indexOf('data:image') === -1) {
								//判断是否有这样的头部
								// 没有则加上头部
								localData = 'data:image/jpeg;base64,' + localData
							}
							// 去掉所以换行符
							localData = localData.replace(/\r|\n/g, '')
							if (type) {
								this.fixPhoto(localData, backUrl)
							} else {
								const schoolCode = JSON.parse(uni.getStorageSync('protal')).userInfo.schoolCode
								$tools.ossUpload(schoolCode, localData, 'jpg', (data) => {
									callback(data.data)
								})
							}
						},
						fail: (err) => {
							uni.showModal({
								title: '温馨提示',
								content: '照片获取失败，请重新拍照',
								showCancel: false,
								success: (res) => {
									this.h5ChoosePhoto(callback, type, backUrl)
								}
							})
						}
					});
				}
			});
		} else {
			this.h5ChoosePhoto(callback, type, backUrl)
		}
	},
	/**
	 * @description 调用手机自带相机拍照
	 * @param {Object} callback
	 * @param {Object} type 是否校验人脸 true为是 false为否
	 */
	h5ChoosePhoto (callback, type =  false, backUrl) {
		uni.chooseImage({
			sourceType: ['album', 'camera'],
			success: chooseImageRes => {
				for (let i = 0; i < chooseImageRes.tempFilePaths.length; i++) {
					const file = chooseImageRes.tempFilePaths[i];
					if (type) {
						// 人脸上传
						this.fixPhoto(file, backUrl)
					} else {
						// 图片上传
						const schoolCode = JSON.parse(uni.getStorageSync('protal')).userInfo.schoolCode
						$tools.ossUpload(schoolCode, file, 'jpg', (data) => {
							callback(data.data)
						})
					}
				}
			}
		});
	},
	/**
	 * @description 调用图片裁剪功能
	 * @param {Object} url 图片路径
	 */
	fixPhoto (url, backUrl) {
		uni.$off('uAvatarCropper')
		uni.$on('uAvatarCropper', path => {
			$tools.checkPhoto(path, url => {
				this.baseImg = url
				backUrl(url)
			})
		})
		uni.setStorageSync('cropperInfo', {
			destWidth: 360,
			rectWidth: 360,
			fileType: 'jpg',
		})
		uni.setStorageSync('imgId', url)
		uni.navigateTo({
			url: '/uview/components/u-avatar-cropper/u-avatar-cropper',
		})
	}
}
export default wxApi
