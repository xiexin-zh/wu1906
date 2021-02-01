<template>
	<view class=" message-detail">
		<view class="message-top"></view>
		<view class="message-img"></view>
		<scroll-view scroll-y="true" class="scroll-h u-bg-fff">
			<view class="u-tx-c u-padd u-font-1 u-bold">{{detail.title}}</view>
			<view class="u-tips-color u-font-01 u-fx-jc">
				<span>发布人：{{detail.publisherName}}</span>
				<span class="u-mar-l30">发布日期：{{ $tools.getDateTime(detail.creatTime).substr(0, 16)}}</span>
			</view>
			<view v-html="detail.content" class="u-content-color u-line2 u-padd">
			</view>
		</scroll-view>
	</view>
	
</template>

<script>
	import eventBus from '@u/eventBus'
	import initData from './assets/js/initData.js'
	export default {
		name: 'DetailMessage',
		computed: {
		},
		data () {
			return {
				detail: JSON.parse(uni.getStorageSync('sysDetail'))
			}
		},
		async mounted () {
			if (!this.detail.readStatus) {
				initData.readNotice(this.detail.noticeCode)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-h {
		width: 90%;
		margin-left: 5%;
		height: calc(100vh - 160rpx);
	}
	.message-top {
		height: 60rpx;
	}
	.message-img {
		padding: 0 10px;
		width: 90%;
		margin-left: 5%;
		height: 75rpx;
		background: url(/mobile-img/notice-laba.png) no-repeat 95% 10px;
		background-size: 101rpx 68rpx;
		background-color: #fff;
	}
	.message-detail {
		background: url(/mobile-img/notice-top-bg.png) no-repeat;
		background-size: 100% 118rpx;
	}
</style>
