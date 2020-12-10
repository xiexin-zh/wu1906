<template>
	<view class="class-home">
		<view class="save-tip" @tap="isTips = false" v-if="isTips">
			<view class="sjx-icon"></view>
			<view class="u-fx">点击<view class="u-padd-l10 u-padd-r10">.<text class="u-bold u-font-3">.</text>.</view>按钮，添加到我的小程序，下拉微信首页就能找到</view>
		</view>
		<view class="wx-notice u-fx-ac" v-if="false">
			<view class="u-font-01">关注我的班公众号，避免错过重要通知和事项</view>
			<view class="wx-btn">马上关注</view>
		</view>
		<class-info></class-info>
		<app-list></app-list>
		<notice></notice>
		<class-space></class-space>
	</view>
</template>

<script>
import ClassInfo from './component/ClassInfo.vue';
import Notice from './component/Notice.vue';
import AppList from './component/AppList.vue';
import ClassSpace from './component/ClassSpace.vue';
import { actions, store, setStore } from '@store'
export default {
	data() {
		return {
			isTips: true
		};
	},
	computed: {
		currentUserType: () => store.currentUserType
	},
	components: {
		ClassInfo,
		Notice,
		AppList,
		ClassSpace
	},
};
</script>

<style lang="scss" scoped>
	.class-home {
		padding-bottom: 100rpx;
	}
	.save-tip{
		.sjx-icon {
			position: fixed;
			width: 20rpx;
			height: 20rpx;
			background-color: #fff;
			top: 8rpx;
			right: 100rpx;
			transform: rotate(45deg);
		}
		position: fixed;
		padding-left: 20rpx;
		z-index: 99;
		width: 96%;
		height: 60rpx;
		line-height: 60rpx;
		top: 12rpx;
		left: 2%;
		font-size: 24rpx;
		color: $u-content-color;
		background: url(http://canpointtest.com/mini-img/small-close-icon.png) no-repeat 98% 16rpx;
		background-size: 32rpx 32rpx;
		background-color: #fff;
		border-radius: $u-border-radius;
	}
.wx-notice {
	height: 84rpx;
	background-color: #5266af;
	color: #fff;
	font-size: 28rpx;
	padding: 0 20rpx;
	.wx-btn {
		margin-left: 20rpx;
		height: 50rpx;
		line-height: 50rpx;
		border: 1px #a8b7e9 solid;
		border-radius: 100rpx;
		padding: 0 20rpx;
		font-size: 24rpx;
	}
}
</style>
