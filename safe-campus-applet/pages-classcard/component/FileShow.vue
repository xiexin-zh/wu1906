<template>
	<view class="">
		<view class="file-show u-auto">
			<view class="file-list" v-for="(file, index) in fileList" :key="file.annexUrl">
				<video v-if="file.annexType === '2'" class="file-img" :src="file.annexUrl"></video>
				<image v-if="file.annexType === '1'" @click="viewFile(file.annexType, file.annexUrl)" :src="file.annexUrl" class="file-img" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			fileList: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data () {
			return {
			}
		},
		methods: {
			viewFile (type, url) {
				if (type === '1') {
					uni.previewImage({
							urls: [url],
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.file-show {
		.file-list {
			width: 20%;
			margin: 20rpx 0;
			margin-left: 4%;
			height: 150rpx;
			position: relative;
			float: left;
			.file-img {
				width: 150rpx;
				height: 150rpx;
				display: block;
			}
		}
	}
</style>
