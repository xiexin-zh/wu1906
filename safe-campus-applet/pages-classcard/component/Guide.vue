<template>
	<view class="guide">
		<view class="u-tips-color">您也可以继续：</view>
		<view class="">
			<view class="primary-btn u-mar-t40" @tap="goPage('/pages-classcard/notice/createNotice')">发布通知公告</view>
			<view class="primary-btn u-mar-t40" @tap="goPage('/pages-classcard/task/addTask')">发布作业</view>
			<view class="second-btn u-mar-t40" @tap="goList">返回到列表</view>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {}
		},
		methods: {
			goList () {
				this.$tools.goBack()
			},
			goPage (path) {
				this.$tools.redirectTo({
					url: `${path}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.guide {
		padding: 40rpx 50rpx;
		background-color: #fff;
		margin-top: 20rpx
	}
</style>
