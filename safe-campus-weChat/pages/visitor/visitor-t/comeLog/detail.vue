<template>
	<view class="detail u-page">
		<view class="top u-fx-jsb">
			<view class="info u-fx-ac">
				<image :src="photo ? photo :errorImg" alt="">
				<view class="u-fx-ver">
					<text class="name">{{ visitorName }}</text>
					<text class="phone">{{ visitorPhone }}</text>
					<text class="name">{{ comeLog.causeName }}</text>
				</view>
		    </view>
			<view class="state">{{ visitState | visitState }}</view>
		</view>
		<view class="log u-fx-jsb">
			<view class="u-fx-ver">
				<view class="start u-fx-ac">
					<text>起</text>
					<text>{{ comeLog.inTime }}</text>
				</view>
				<view class="in u-fx-ac">
					<text>入</text>
					<text>{{ comeLog.inPlace }}</text>
				</view>
			</view>
			<view class="u-fx-ver">
				<view class="end u-fx-ac">
					<text>止</text>
					<text>{{ comeLog.outTime }}</text>
				</view>
				<view class="out u-fx-ac">
					<text>出</text>
					<text>{{ comeLog.outPlace }}</text>
				</view>
			</view>
		</view>
		<view class="log u-fx-jsb">
			<view class="start u-fx-ac">
				<icon type="info" size="24" />
				<text  class="mar-l20">随行人数：{{ comeLog.togetherNum || 0 }}</text>
			</view>
			<view class="end u-fx-ac">
				<icon type="waiting" size="24" />
				<text  class="mar-l20">来访时长：{{ comeLog.duration }}小时</text>
			</view>
		</view>
	</view>
</template>

<script>
import { store, actions } from '../store/index.js';
export default {
	components: {},
	data() {
		return {
			errorImg: '/mobile-img/person-auto.png',
			id: '',
			visitorName: '',
			visitorPhone: '',
			photo: '',
			visitSum: '',
			visitState: '',
			comeLog: {
				inTime: '',
				inPlace: '',
				outTime: '',
				outPlace: '',
				togetherNum: '',
				duration: ''
			}
		};
	},
	async mounted() {
		this.id = this.$tools.getQuery().get('id')
		const res = await actions.getComeLogDetail(this.id);
		if (!res.data) {
			return;
		}
		this.comeLog = res.data;
		this.photo = res.data.visitorUrl;
		this.visitorName = res.data.userName;
		this.visitorPhone = res.data.mobile;
		this.visitSum = res.data.visitSum;
		this.visitState = res.data.visitState;
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.detail {
	padding: 0 20rpx;
	.scroll-h {
		height: 64vh;
	}
	.top {
		width: 100%;
		height: 362rpx;
		background: url('http://canpointtest.com/mobile-img/person-bg.png') no-repeat;
		background-size: 100% 362rpx;
		margin: 20rpx 0 40rpx 0;
		color: $uni-bg-color;
		.state {
			margin: 30rpx 60rpx 0 0;
			font-size: 28rpx;
		}
		.info {
			margin: 0 0 0 10%;
			height: 300rpx;
			image {
				width: 160rpx;
				height: 160rpx;
				margin-right: 38rpx;
				padding: 6rpx;
				border-radius: 100%;
			}
			text {
				margin-bottom: 10rpx;
			}
			.name {
			}
			.phone {
			}
		}
	}
	.log {
		background: $uni-bg-color;
		padding: 40rpx 20rpx;
		margin: 20rpx 0 40rpx 0;
		border: 1px solid $u-border-color;
		border-radius: 16rpx;
		box-shadow: 2rpx 2rpx 1rpx 1rpx $u-border-color;
		view {
			margin: 10rpx 0;
			text:first-child {
				border: 1rpx solid $u-type-primary;
				padding: 6rpx 12rpx;
				border-radius: 100%;
				margin-right: 20rpx;
			}
		}
	}
}
</style>
