<template>
	<view class="face u-page">
		<view class="head"></view>
		<view class="content u-bg-fff u-padd-40">
			<view class="face-view u-fx-ac-jc">
				<image @click="perviewImg" class="userPhoto" :src="baseImg"></image>
				<view class="name">{{ userName }}</view>
			</view>
			<view class="info">
				<view class="u-fx-ac">
					<u-icon class="icon-40 u-mar-r20" name="account-fill" color="#0084FF" size="40"></u-icon>
					人员类型：{{ userType | getUserType }}
				</view>
				<view class="u-fx-ac">
					<u-icon class="icon-40 u-mar-r20" name="clock-fill" color="#0084FF" size="40"></u-icon>
					出入时间：{{ accessTime }}
				</view>
				<view class="u-fx-ac">
					<u-icon class="icon-40 u-mar-r20" name="map" color="#0084FF" size="40"></u-icon>
					出入地点：{{ accessPlace }}
				</view>
				<view class="u-fx-ac">
					<u-icon class="icon-40 u-mar-r20" name="grid" color="#0084FF" size="40"></u-icon>
					出入类型：{{ accessType == '1' ? '进' : '出' }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { actions, store, setStore } from '../store/index.js';
export default {
	data() {
		return {
			baseImg: '',
			userName: '',
			userType: '',
			accessType: '',
			accessTime: '',
			accessPlace: ''
		};
	},
	components: {},
	computed: {},
	mounted() {
		this.userName = this.$tools.getQuery().get('userName');
		this.userType = this.$tools.getQuery().get('userType');
		this.baseImg = this.$tools.getQuery().get('snapPhoto');
		this.accessType = this.$tools.getQuery().get('accessType');
		this.accessTime = this.$tools.getQuery().get('accessTime');
		this.accessPlace = this.$tools.getQuery().get('accessPlace');
	},
	methods: {
		perviewImg() {
			uni.previewImage({
				urls: [this.baseImg]
			});
		},
	}
};
</script>

<style lang="scss">
.face {
	overflow: auto;
	.head {
		height: 300rpx;
		background: url('http://canpointtest.com/mobile-img/inoutDetail.png') no-repeat;
		background-size: 100% 300rpx;
	}
	.content {
		margin: -80rpx 40rpx 0 40rpx;
		border-radius: 16rpx;
		.face-view {
			width: 400rpx;
			height: 400rpx;
			margin: 50rpx auto 50rpx auto;
			border-radius: 10rpx;
			position: relative;
			.userPhoto {
				width: 400rpx;
				height: 400rpx;
				border-radius: 10rpx;
				display: block;
			}
			.name {
				position: absolute;
				bottom: 0;
				width: 400rpx;
				background-color: rgba(255, 255, 255, 0.64);
				height: 64rpx;
				line-height: 64rpx;
				text-align: center;
				font-weight: bold;
				color: #0084ff;
			}
		}
		.info {
			color: $u-content-color;
			line-height: 80rpx;
			font-size: 30rpx;
			padding: 30rpx 0 0 40rpx;
			text {
				padding-right: 20rpx;
			}
			.tip-demo {
				font-size: 28rpx;
				color: $u-type-warning;
				font-weight: bold;
			}
		}
		.access {
			text-align: center;
		}
		.icon-40 {
			font-size: 40rpx;
		}
	}
}
</style>
