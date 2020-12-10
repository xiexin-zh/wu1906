<template>
	<view class="invitation">
		<view class="tips u-tips-color">您可以通过如下方式邀请老师或家长加入班级</view>
		<view class="type-list u-fx-ac" v-for="(item, index) in typeList" :key="index">
			<view class="type-box u-fx-ac-jc">
				<u-image width="64rpx" height="64rpx" v-if="index === 0" src="http://canpointtest.com/mini-img/code-icon.png"></u-image>
				<u-image v-if="index === 1" width="64rpx" height="64rpx" src="http://canpointtest.com/mini-img/wx-icon.png"></u-image>
			</view>
			<view class="u-fx-f1 u-mar-l30">
				<view class="u-font-1">{{ item.title }}</view>
				<view class="u-tips-color u-mar-t10 u-font-01">{{ item.des }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				typeList: [
					{
						title: '方式一：通过班级码邀请',
						des: '通过此方式，会同时关注我的班微信公众号'
					},
					{
						title: '方式二：通过班级微信群邀请',
						des: ''
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.invitation {
		.tips {
			padding: 30rpx 30rpx 0;
		}
		.type-list {
			padding: 50rpx 30rpx;
			margin: 30rpx;
			background-color: #fff;
			border-radius: $u-border-radius;
			.type-box {
				width: 120rpx;
				height: 120rpx;
				border-radius: 100%;
				background-color: #f5f7ff;
			}
		}
	}
</style>
