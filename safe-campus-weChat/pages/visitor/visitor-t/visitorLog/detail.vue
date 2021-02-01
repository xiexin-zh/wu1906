<template>
	<view class="detail u-page">
		<view class="top u-fx-jsb">
			<view class="info u-fx-ac">
				<image :src="photo ? photo :errorImg" alt="">
				<view class="u-fx-ver">
					<text class="name">{{ visitorName }}</text>
					<text class="phone">{{ visitorPhone }}</text>
					<text class="times">来访{{ visitSum }}次</text>
				</view>
			</view>
		</view>
		<view>来访记录</view>
		<scroll-view scroll-y="true" class="scroll-h"><steps :talk="talk"></steps></scroll-view>
	</view>
</template>

<script>
import steps from './steps.vue';
import { store, actions } from '../store/index.js';
export default {
	components: {
		steps
	},
	data() {
		return {
			errorImg: '/mobile-img/person-auto.png',
			visitorCode: '',
			visitorName: '',
			visitorPhone: '',
			visitSum: '',
			photo: '',
			talk: []
		};
	},
	async mounted() {
		this.visitorCode = this.$tools.getQuery().get('userCode')
		const req = {
			schoolCode: store.userInfo.schoolCode,
			userCode: this.visitorCode,
			pageNum: 1,
			pageSize: 100
		};
		const res = await actions.getVisitDetail(req);
		if (res.data.list.length === 0) {
			return;
		}
		this.talk = res.data.list;
		this.photo = res.data.list[0].registPhoto;
		this.visitorName = res.data.list[0].userName;
		this.visitorPhone = res.data.list[0].mobile;
		this.visitSum = res.data.list[0].visitSum;
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.detail {
	padding: 0 20rpx;
	.scroll-h {
		height: calc(100vh - 480rpx);
	}
	.top {
		width: 100%;
		height: 362rpx;
		background: url('http://canpointtest.com/mobile-img/person-bg.png') no-repeat;
		background-size: 100% 362rpx;
		margin: 20rpx 0 40rpx 0;
		color: $uni-bg-color;
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
}
</style>
