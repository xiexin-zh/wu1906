<template>
	<view class="poster" :style="{ width: setWidth + 'px', height: setHeight + 'px' }">
		<view class="top">{{ schoolName }}</view>
		<view class="title">{{ record.description }}</view>
		<view class="content">
			<view>
				<text class="text-bold">活动地点：</text>
				{{ record.placeName }}
			</view>
			<view>
				<text class="text-bold">活动时间：</text>
				{{ record.reserveDate | gmtToDate('date') }} {{ record.startTime }}-{{ record.endTime }}
			</view>
			<view>
				<text class="text-bold">活动内容：</text>
				{{ record.content }}
			</view>
		</view>
		<view class="scan u-fx-ac-jc">
			<view class="qrimg u-bg-fff">
				<tki-qrcode
					cid="qrcode2"
					ref="qrcode2"
					:val="`http://canpointlive.com/mobile-protal/protal-oa/#/pages/activity-booking/sign?id=${record.id}&schoolCode=${schoolCode}`"
					background="#f67b29"
					foreground="#fff"
					pdground="#fff"
					:size="200"
					:onval="true"
					:loadMake="true"
					:showLoading="false"
					:usingComponents="true"
				/>
			</view>
			扫码立即加入
		</view>
	</view>
</template>

<script>
import { store, actions } from './store/index.js';
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
export default {
	data() {
		return {
			id: 0,
			schoolCode: '',
			schoolName: '',
			record: {},
			setWidth: 0,
			setHeight: 0
		};
	},
	components: {
		tkiQrcode
	},
	async mounted() {
		this.id = this.$tools.getQuery().get('id');
		this.schoolName = store.userInfo.schoolName;
		this.schoolCode = store.userInfo.schoolCode;
		this.showData();
		let _this = this;
		uni.getSystemInfo({
			success: function(res) {
				_this.setWidth = res.windowWidth;
				_this.setHeight = res.windowHeight;
			}
		});
	},
	methods: {
		async showData() {
			const res = await actions.reserveDetail(this.id);
			this.record = res.data;
		}
	}
};
</script>

<style lang="scss">
.poster {
	width: 100%;
	height: 100%;
	position: relative;
	background: url(http://canpointtest.com/mobile-img/poster.png) no-repeat;
	background-size: 100% 100%;
	.top {
		position: absolute;
		top: 160rpx;
		left: 140rpx;
		font-size: 28rpx;
		text-align: center;
		width: 470rpx;
	}
	.title {
		position: absolute;
		top: 220rpx;
		left: 140rpx;
		font-size: 38rpx;
		font-weight: bold;
		text-align: center;
		width: 470rpx;
	}
	.content {
		position: absolute;
		top: 360rpx;
		left: 140rpx;
		width: 470rpx;
		font-size: 24rpx;
		line-height: 48rpx;
		.text-bold {
			font-weight: bolder;
		}
		.scroll-y {
			height: 140rpx;
		}
	}
	.scan {
		position: absolute;
		bottom: 50rpx;
		width: 100%;
		color: #fff;
		font-size: 24rpx;
	}
	.qrimg {
		padding: 10rpx 10rpx 6rpx 10rpx;
		margin-bottom: 10rpx;
	}
}
</style>
