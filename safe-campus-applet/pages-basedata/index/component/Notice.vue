<template>
	<view class="class-notice u-fx-ac u-font-01">
		<view class="u-fx-f1 u-te content u-content-color" @tap="seeHelp">如何发布通知公告，请查看</view>
		<view class="u-tips-color" @tap="goMore">更多</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {
	
		},
		methods: {
			seeHelp () {
				uni.setStorageSync('helpIndex', 1)
				this.$tools.navTo({
					url: '/pages-basedata/common/help'
				})
			},
			goMore () {
				uni.setStorageSync('helpIndex', 0)
				this.$tools.navTo({
					url: '/pages-basedata/common/help'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.class-notice {
		padding: 0 20rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #f3f3f3;
		background: url('http://canpointtest.com/mini-img/notice-icon.png') no-repeat 20rpx 18rpx;
		background-size: 50rpx 50rpx;
		.content {
			margin-left: 70rpx;
		}
	}
</style>
