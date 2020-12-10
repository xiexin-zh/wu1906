<template>
	<view class="help-detail">
		<view class="help-tab">
			<u-tabs :list="list" :is-scroll="false" active-color="#7691fa" inactive-color="#999999" bg-color="#fff" :current="current" @change="change"></u-tabs>
		</view>
		<view class="u-type-white-bg">
			<no-data v-if="helpList.length === 0" top="200" width="128" height="128" autoImg="http://canpointtest.com/mini-img/auto-help.png" msg="功能正在开发中..."></no-data>
			<view v-show="current !== 1" @tap="goDetail" class="help-item u-fx-ac u-bd-b" v-for="(help, index) in helpList" :key="index">
				<view class="tips">
				</view>
				<view class="u-fx-f1 u-mar-l u-te">{{ help.title }}</view>
				<view class="rit-arrow"></view>
			</view>
			<view class="more-help u-mar-l30" v-show="current === 1">
				<view class="u-fx-ac u-bd-b u-padd-b40">
					<view class="u-fx-ac-jc u-mar-l20 u-mar-t40">
						<u-image src="http://canpointtest.com/mini-img/tzgg-icon.png" width="90rpx" height="90rpx"></u-image>
						<text class="u-mar-t10 u-content-color u-font-01">通知公告</text>
					</view>
					<view class="u-fx-f1 u-mar-l30">
						<view class="u-fx-ac u-padd-10" @tap="goDetail">
							<view class="tips"></view>
							<view class="u-fx-f1 u-content-color u-mar-l">如何发布确认通知以及使用场景？</view>
						</view>
						<view class="u-fx-ac u-padd-10" @tap="goDetail">
							<view class="tips"></view>
							<view class="u-fx-f1 u-content-color u-mar-l">如何发布确认通知以及使用场景？</view>
						</view>
					</view>
				</view>
				<view class="u-fx-ac u-bd-b u-padd-b40">
					<view class="u-fx-ac-jc u-mar-l20 u-mar-t40">
						<u-image src="http://canpointtest.com/mini-img/zy-icon.png" width="90rpx" height="90rpx"></u-image>
						<text class="u-mar-t10 u-content-color u-font-01">作业</text>
					</view>
					<view class="u-fx-f1 u-mar-l30">
						<view class="u-fx-ac u-padd-10" @tap="goDetail">
							<view class="tips"></view>
							<view class="u-fx-f1 u-content-color u-mar-l">如何发布作业和答案？</view>
						</view>
						<view class="u-fx-ac u-padd-10" @tap="goDetail">
							<view class="tips"></view>
							<view class="u-fx-f1 u-content-color u-mar-l">如何点评作业？</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import NoData from '../component//NoData.vue'
	export default {
		components: {
			NoData
		},
		data () {
			return {
				list: [
					{
						name: '常见问题'
					},
					{
						name: '功能操作'
					},
					{
						name: '使用技巧'
					}
				],
				current: uni.getStorageSync('helpIndex') || 0,
				helpList: [
					{
						title: '怎么切换班级？'
					},
					{
						title: '如果关注平安校园微信公众号-免费接收消息提醒'
					},
					{
						title: '添加图片，视频出现问题？'
					},
					{
						title: '如何给班级新增学生老师？'
					},
					{
						title: '如何收藏小程序？'
					},
					{
						title: '如何设置小程序到桌面，快速使用？'
					},
					{
						title: '如何下载文件？'
					}
				]
			}
		},
		methods: {
			change (index) {
				this.current = index
			},
			goDetail () {
				this.$tools.navTo({
					url: '/pages-basedata/common/helpDetail'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.help-detail {
		padding-top: 120rpx;
		.tips {
			width: 10rpx;
			height: 10rpx;
			background-color: #eee;
			border-radius: 100%;
		}
		.help-tab {
			background-color: #fff;
			position: fixed;
			width: 100%;
			height: 100rpx;
			z-index: 99;
			top:0;
			left: 0;
		}
		.help-item {
			color: $u-content-color;
			height: 100rpx;
			padding: 0 30rpx 0 10rpx;
			margin-left: 30rpx;
		}
	}
</style>
