<template>
	<view class="warn-info">
		<view class="u-type-error u-bold">注意事项</view>
		<view>1. 请确保照片是所需登记人照片</view>
		<view>2. 请确保露出清晰完整的人脸部位</view>
		<view>3. 拍照过程中请避免摇晃，保持充足的光线</view>
		<view class="u-fx-ac u-fx-jsb">
			<view class="warn-box u-fx-ac-jc">
				<u-image src="http://canpointtest.com/mini-img/phone-tips.png" width="60rpx" height="60rpx"></u-image>
				<text class="u-padd-t10">正对手机</text>
			</view>
			<view class="warn-box u-fx-ac-jc">
				<u-image src="http://canpointtest.com/mini-img/deng-tips.png" width="60rpx" height="60rpx"></u-image>
				<text class="u-padd-t10">光线充足</text>
			</view>
			<view class="warn-box u-fx-ac-jc">
				<u-image src="http://canpointtest.com/mini-img/face-tips.png" width="60rpx" height="60rpx"></u-image>
				<text class="u-padd-t10">清晰人脸</text>
			</view>
		</view>
	</view>
	
</template>

<script>
	
</script>

<style scoped lang="scss">
	.warn-info {
		line-height: 50rpx;
		font-size: 24rpx;
		margin-top: 20rpx;
		background-color: #fff;
		padding: 40rpx;
		color: $u-content-color;
		.warn-box {
			margin-top: 30rpx;
			background-color: $u-type-primary-light;
			height: 160rpx;
			width: 160rpx;
			color:$u-type-primary;
			border-radius: 2px;
		}
	}
</style>
