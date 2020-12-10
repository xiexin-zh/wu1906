<template>
	<view class="menu-list">
		<view class="mine-list">
			<view class="mine-item u-fx-ac" @tap="goHtml('/common/helpDetail')">
				<u-image width="48rpx" height="48rpx" src="http://canpointtest.com/mini-img/lp-icon.png"></u-image>
				<view class="u-fx-f1 u-mar-l30">积分兑礼品</view>
				<view class="u-tips-color u-font-01"></view>
				<view class="rit-arrow"></view>
			</view>
			<view class="mine-item u-fx-ac" @tap="goHtml('/common/helpDetail')">
				<u-image width="48rpx" height="48rpx" src="http://canpointtest.com/mini-img/yq-icon.png"></u-image>
				<view class="u-fx-f1 u-mar-l30">邀请班级成员加入</view>
				<view class="rit-arrow"></view>
			</view>
		</view>
		<view class="u-mar-t mine-item u-fx-ac" @tap="goHtml('/common/help')">
			<u-image width="48rpx" height="48rpx" src="http://canpointtest.com/mini-img/bz-icon.png"></u-image>
			<view class="u-fx-f1 u-mar-l30">客服&帮助</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="mine-item u-fx-ac" @tap="goHtml('/common/helpDetail')">
			<u-image width="48rpx" height="48rpx" src="http://canpointtest.com/mini-img/sc-icon.png"></u-image>
			<view class="u-fx-f1 u-mar-l30">收藏小程序/添加至桌面</view>
			<view class="rit-arrow"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {}
		},
		methods: {
			goHtml (path) {
				uni.setStorageSync('helpIndex', 0)
				this.$tools.navTo({
					url: `/pages-basedata${path}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.mine-list {
	background-color: #fff;
	padding-top: 100rpx;
}
.mine-item {
	background-color: #fff;
	padding: 0 30rpx;
	height: 100rpx;
	color: $u-content-color;
	border-bottom: 2rpx $u-border-color solid;
	.icon-img {
		width: 48rpx;
		height: 48rpx;
		display: block;
	}
}
</style>
