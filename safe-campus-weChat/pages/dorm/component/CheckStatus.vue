<template>
  <view class="u-fx-je check-status">
    <view class="daka-icon type-icon"></view>
    <view>打卡</view>
    <view class="sl-icon type-icon"></view>
    <view>刷脸</view>
    <view class="dksl-icon type-icon"></view>
    <view>刷脸打卡</view>
    <view class="buka-icon type-icon"></view>
    <view>补卡</view>
    <view class="bzq-icon type-icon"></view>
    <view>不在寝</view>
  </view>
</template>

<script>
export default {
  name: 'CheckStatus'
}
</script>

<style lang="scss" scoped>
  .check-status {
    color:#444;
    padding: 20rpx 15rpx 10rpx;
  }
 .type-icon {
   margin: 0 4rpx 0 10rpx;
   width: 45rpx;
   color:#666;
   height: 45rpx;
   border-radius: 6rpx;
   background-size: 45rpx;
   font-size: 20rpx
 }
 .bzq-icon {
	width: 28rpx;
	height: 28rpx;
	margin-top: 6rpx;
	background-color:$u-type-error;
}

</style>
