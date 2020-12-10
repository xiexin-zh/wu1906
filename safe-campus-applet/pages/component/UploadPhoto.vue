<template>
	<view class="upload-photo">
		<view class="file-list" v-for="(file, index) in fileList" :key="file">
			<view class="close-img" @tap="delImg(index)"></view>
			<image @tap="viewFile(file)" class="file-img" :src="file"></image>
		</view>
		<view v-if="fileList.length < max" class="file-list file-add u-fx-ac-jc" @tap="chooseFile(1)">
		</view>
	</view>
</template>

<script>
	import wxConfig from '@u/wx-config'
	export default {
		props: {
			max: {
				type: Number,
				default: 1
			},
			value: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		computed: {
			fileList: {
				get () {
					return this.value
				},
				set (val) {
					console.log(val)
					this.$emit('input', val)
				}
			}
		},
		data () {
			return {
			}
		},
		methods: {
			chooseFile (type) {
				wxConfig.chooseFile(type, (res) => {
					console.log('bind')
					console.log(res)
					this.fileList = [res]
				}, true)
			},
			delImg (index) {
				this.fileList.splice(index, 1)
			},
			viewFile (url) {
				uni.previewImage({
						urls: [url],
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.upload-photo {
		.file-add {
			background: url(http://canpointtest.com/mini-img/add-icon.png) no-repeat center;
			background-size: 48rpx 48rpx;
		}
		.file-list {
			width: 20%;
			margin: 20rpx 0;
			margin-left: 4%;
			height: 120rpx;
			background-color: $u-bg-color;
			position: relative;
			float: left;
			.close-img {
				width: 60rpx;
				height: 60rpx;
				position: absolute;
				z-index: 99;
				top: -20rpx;
				right: -20rpx;
				background: url(http://canpointtest.com/mini-img/close-img.png) no-repeat center;
				background-size: 48rpx 48rpx;
			}
			.file-img {
				width: 120rpx;
				height: 120rpx;
				display: block;
			}
		}
	}
</style>
