<template>
	<view class="upload-file">
		<view class="file-show u-auto">
			<view class="file-list" v-for="(file, index) in newFileList" :key="file.annexUrl">
				<view v-if="file.annexType == 1" class="close-img" @tap="delImg(index)"></view>
				<u-image width="100%" height="150rpx" v-if="file.annexType == 1" @click="viewFile(file.annexType, file.annexUrl)" :src="file.annexUrl" mode=""></u-image>
				<video v-if="file.annexType == 2" class="file-video" :src="file.annexUrl" controls enable-play-gesture enable-auto-rotation object-fit="contain">
					<cover-image class="close-img" src="http://canpointtest.com/mini-img/close-img.png" @tap="delImg(index)"></cover-image>
				</video>
			</view>
		</view>
		<view class="notice-flie u-fx-ac u-bd-t" v-if="newFileList.length < max">
			<view :class="type === 'image' ? 'u-fx-f1' : 'u-fx-f1 u-fx-jc u-bd-r'" @tap="chooseFile(1)" v-if="type !== 'video'">
				<u-image width="60rpx" height="60rpx" src="http://canpointtest.com/mini-img/pic-icon.png"></u-image>
			</view>
			<view :class="type === 'video' ? 'u-fx-f1' : 'u-fx-f1 u-fx-jc'" @tap="chooseFile(2)" v-if="type !== 'image'">
				<u-image width="60rpx" height="60rpx" src="http://canpointtest.com/mini-img/video-icon.png"></u-image>
			</view>
		</view>
	</view>
</template>

<script>
	import wxConfig from '@u/wx-config'
	export default {
		props: {
			type: {   // ''：图片视频 'image':图片 'video':视频
				type: String,
				default: ''
			},
			max: {   // 上传最大数量
				type: Number,
				default: 500
			},
			fileList: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data () {
			return {
				newFileList: JSON.parse(JSON.stringify(this.fileList)) 
			}
		},
		mounted () {
			console.log(this.fileList)
		},
		methods: {
			getFileType(url) {
				let fileType = url.split('.')[url.split('.').length - 1];
				if (fileType && 'mp4|ogg|webm'.toLowerCase().indexOf(fileType.toLowerCase()) !== -1) {
					return 'video';
				} else if ('jpeg|gif|jpg|png|bmp|pic|svg|'.toLowerCase().indexOf(fileType.toLowerCase()) !== -1) {
					return 'image';
				}
			},
			chooseFile (type) {
				this.$emit('upLoadOK', false)
				wxConfig.chooseFile(type, (res) => {
					this.$emit('upLoadOK', true)
					if(!res){
						return
					}
					this.newFileList = this.newFileList.concat(res)
				})
			},
			delImg (index) {
				this.newFileList.splice(index, 1)
			},
			viewFile (type, url) {
				if (type == 1) {
					uni.previewImage({
							urls: [url],
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.upload-file {
		.notice-flie {
			padding: 40rpx;
			.file-img {
				height: 60rpx;
				width: 60rpx;
				display: block;
			}
		}
		.file-list {
			width: 20%;
			margin: 20rpx 0;
			margin-left: 4%;
			height: 150rpx;
			background-color: $u-bg-color;
			position: relative;
			float: left;
			.close-img {
				width: 60rpx;
				height: 60rpx;
				position: absolute;
				z-index: 99;
				top: 0rpx;
				right: 0rpx;
				background: url(http://canpointtest.com/mini-img/close-img.png) no-repeat center;
				background-size: 48rpx 48rpx;
			}
			.file-video {
				height: 100%;
				width: 100%;
				.close-img{
					width: 48rpx;
					height: 48rpx;
					top: 6rpx;
					right: 6rpx;
				}
			}
		}
	}
</style>
