<template>
	<view class="back-home" @tap="goBack">主页</view>
</template>

<script>
	export default {
		data () {
			return {}
		},
		methods: {
			goBack () {
				this.$tools.redirectTo({
					url: '/pages-basedata/index/home'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.back-home {
		height: 44rpx;
		padding-left: 55rpx;
		background-size: 42rpx 42rpx;
	}
</style>
