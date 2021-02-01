<template>
  <view class="notice-dialog u-fx-ac-jc">
		<view class="notice-center animate__animated animate__backInDown">
			<view class="notice-title"></view>
			<view class="notice-info u-type-white-bg u-scroll-y">
				<view class="u-padd-b u-te u-tx-c u-font-1 u-letter-1 u-bold">{{detail.title}}</view>
				<view v-html="detail.content" class="u-content-color u-mar-b u-padd-l30 u-padd-r30 u-line1">
				</view>
			</view>
			<view class="line-h"></view>
			<view class="u-fx-ac-jc">
				<view class="notice-line"></view>
				<view class="notice-close" @tap="closeDialog"></view>
			</view>
		</view>
  </view>
</template>

<script>
  export default {
    props: {
      detail : {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
		methods: {
			closeDialog () {
				this.$emit('close')
			}
		}
  }
</script>

<style lang="scss" scoped>
  .notice-dialog {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 9999;
		background: rgba(0,0,0,.6);
		.notice-center {
			width: 632rpx;
			.notice-title {
				width: 632px;
				height: 340rpx;
				background: url(/mobile-img/notice-bg.png) no-repeat;
				background-size: 632rpx 340rpx;
			}
			.notice-info {
				height: 500rpx;
			}
			.line-h {
				height: 30rpx;
				background-color: #fff;
				border-bottom-right-radius: 8rpx;
				border-bottom-left-radius: 8rpx;
			}
			.notice-line {
				width: 2rpx;
				height: 50rpx;
				background-color: #fff;
			}
			.notice-close {
				width: 70rpx;
				height: 70rpx;
				background: url(/mobile-img/notice-close.png) no-repeat;
				background-size: 70rpx 70rpx;
			}
		}
  }
</style>
