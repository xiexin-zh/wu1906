<template>
	<view class="">
		<u-upload   max-count="1"  width='130' @on-success='success' @on-remove ='removeUrl'  :action="action" :file-list="fileList" ></u-upload>
	</view>
</template>

<script>
export default {
	name: 'AnUploadImg',
	components: {},
	props: {
		total: {
			type: Number | String,  
			default: 3
		},
		value: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	computed: {
		imgBase64List: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		}
	},
	mounted () {
		// if()
	},
	data() {
		return {
			action:	`http://canpointtest.com:8090/ossApi/upload-oss-file`,
			fileList: [
					
				]
		};
	},
	methods: {
		success(data, index, lists, name){
			this.imgBase64List.push(data.data)
		},
		removeUrl(res, index, lists, name){
			this.imgBase64List.splice(index,1)
		},
		chooseImage() {
			uni.chooseImage({
				success: chooseImageRes => {
					for (let i = 0; i < chooseImageRes.tempFilePaths.length; i++) {
						const file = chooseImageRes.tempFilePaths[i];
						const newImg = new Image();
						newImg.src = file;
						newImg.onload = () => {
							var canvas = document.createElement('canvas');
							var scale = newImg.height / newImg.width;
							if (newImg.width > 640) {
								canvas.width = 640
								canvas.height = 640 * scale
							} else {
								canvas.width = 120
								canvas.height = 120 * scale
							}
							const context = canvas.getContext('2d');
							context.drawImage(newImg, 0, 0, canvas.width, canvas.height)
							const base64 = canvas.toDataURL('image/png',0.8)
							this.imgBase64List.push(base64);
						};
					}
				}
			});
		},
		perviewImg(index) {
			let urls = this.imgBase64List[index];
			uni.previewImage({
				urls: [urls]
			});
		},
		handleRemove(index) {
			this.imgBase64List.splice(index, 1)
		}
	}
};
</script>

<style lang="scss">
.an-uploadImg-group {
	overflow: auto;
	height: 100%;
}
.an-img {
	float: left;
	margin: 0 40rpx 20rpx 0;
	position: relative;
}
.an-img-add {
	float: left;
	font-size: 50rpx;
	margin-right: 10rpx;
	height: 100rpx;
	width: 100rpx;
	color:#666;
	text-align: center;
	line-height: 100rpx;
}
.upload-icon {
	height: 100rpx;
	width: 100rpx;
	display: block;
}
.an-icon-close {
	width: 30rpx;
	height: 30rpx;
	position: absolute;
	right: 0rpx;
	top: 5rpx;
	.del {
		color: #fff;
		height: 30rpx;
		width: 30rpx;
		font-weight: blod;
		line-height: 26rpx;
		text-align: center;
		border-radius: 100%;
		background-color: #555555;
	}
}
</style>
