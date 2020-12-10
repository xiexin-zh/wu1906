/**
 * @description  微信小程序相关信息
 */
import $ajax from './ajax-serve'
import $tools from './tools.js'
import hostEnv from '@api/host-env'
import { store } from '@store'
const wxConfig = {
	// 用户默认登录获取code
	getOpenId (callBack) {
		uni.login({
			provider: 'weixin',
			success (loginRes) {
				$ajax
					.get({
						url: `${hostEnv.host}/getSmallOpenid`,
						params: {
							code: loginRes.code
						}
					})
					.then(res => {
						console.log(res)
						callBack(res)
					});
			}
		});
	},
	// 从手机上传视频或图片
	chooseFile (type = 1, callBack, tag = false) {
		const _self = this
		uni.showActionSheet({
		    itemList: ['拍摄', '从手机相册选择', '从微信聊天会话中选择图片'],
		    success: (action) => {
					// 从微信中选择
					if (action.tapIndex === 2) {
						wx.chooseMessageFile({
							count: 9,
							success (res) {
								$tools.toast(res.tempFiles.length)
							}
						})
						return
					}
					// 拍摄或从相机选择
					let mediaType
					const sourceType = action.tapIndex === 0 ? ['camera'] : ['album']
					if (type === 1) {
						uni.chooseImage({
						    count: 1, //默认9
						    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						    sourceType: sourceType, //从相册选择
						    success: function (res) {
									_self.uploadFile(res, callBack, tag, type)
						    }
						});
					} else if (type === 2) {
						uni.chooseVideo({
						    count: 1, //默认9
						    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						    sourceType: sourceType, //从相册选择
						    success: function (res) {
									_self.uploadFile(res, callBack, tag, type)
						    }
						});
					}
		    },
		    fail: function (res) {
					callBack(null)
		    }
		});
	},
	// 上传附件
	uploadFile (res, callBack, tag, type) {
		console.log(res)
		let filePath,fileType
		if (type === 1) {
			//#ifdef MP-WEIXIN
			filePath = res.tempFilePaths[0]
			//#endif 
			//#ifdef H5
			filePath = res.tempFiles[0].path
			//#endif
			if (res.tempFiles[0].name) {
				fileType = res.tempFiles[0].name.split('.')[1]
			} else {
				const arr = res.tempFiles[0].path.split('.')
				fileType = arr[arr.length - 1]
			}
		} else {
			filePath = res.tempFilePath
			if (res.name) {
				fileType = res.name.split('.')[1]
			} else {
				const arr = res.tempFilePath.split('.')
				fileType = arr[arr.length - 1]
			}
		}
		$tools.ossUpload(store.userInfo.schoolCode, filePath, fileType, (url) => {
			if (tag) {
				callBack(url)
				return
			}
			const fileList = {
				annexType: type,
				annexName: Math.floor(Math.random() * 1000000) + '.' + fileType,
				annexUrl: url
			}
			callBack(fileList)
		})
	}
}
export default wxConfig