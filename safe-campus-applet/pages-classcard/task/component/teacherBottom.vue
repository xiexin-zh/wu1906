<template>
	<view class="teacher-bottom u-bd-t u-fx-ac">
		<view @tap="goHtml('redFlower')" class="u-fx-f1 u-fx-ac-jc u-tips-color">
			<u-image width="42rpx" height="42rpx" src="http://canpointtest.com/mini-img/red-flower-icon.png"></u-image>
			<text class="u-font-02 u-padd-t10">作业红花榜</text>
		</view>
		<view class="u-fx-f1 u-fx-jc" v-if="currentUserType === '4'">
			<view @tap="goHtml('addTask')" class="add-task-btn"></view>
		</view>
		<view @tap="goHtml('taskTotal')" class="u-fx-f1 u-fx-ac-jc u-font-01 u-tips-color">
			<u-image width="42rpx" height="42rpx" src="http://canpointtest.com/mini-img/zy-total-icon.png"></u-image>
			<text class="u-font-02 u-padd-t10">作业统计</text>
		</view>
	</view>
</template>

<script>
	import { store } from '@store'
	export default {
		computed: {
			currentUserType: () => store.currentUserType,
		},
		data () {
			return {}
		},
		methods: {
			goHtml (path) {
				this.$tools.navTo({
					url: `./${path}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.teacher-bottom {
		background-color: #fff;
		height: 120rpx;
		width: 100%;
		position: fixed;
		z-index: 99;
		bottom: 0rpx;
		left: 0rpx;
		.add-task-btn {
			color:#fff;
			text-align: center;
			width: 100rpx;
			height: 100rpx;
			display: block;
			background-color: $u-type-primary;
			background: url(http://canpointtest.com/mini-img/publish-task.png) no-repeat;
			background-size: 100rpx 100rpx;
			z-index: 99;
			margin-top: -60rpx;
			border-radius: 100%;
		}
	}
</style>
