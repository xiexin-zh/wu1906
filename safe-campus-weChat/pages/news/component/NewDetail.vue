<template>
	<view class="detail" v-cloak>
		<view class="title u-padd-t u-font-3">{{ detail.title }}</view>
		<view class="tips u-mar-t u-mar-b u-tips-color">
			<text class="createBy u-padd-r">{{ detail.createBy }}</text>
			<text>发布于: {{ $tools.getDateTime(detail.createTime) }}</text>
		</view>
		<view class="content u-padd-t u-content-color" v-html="detail.content"></view>
	</view>
</template>

<script>
export default {
	props: {
		detail: {
			type: Object,
			defatul: () => {
				return {};
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.detail {
	overflow-x: hidden;
	padding: $u-mp-20 0;
	margin: 0 $u-mp-20;
	.content {
		text-indent: 50rpx;
		line-height: 46rpx;
	}
	.content /deep/ img {
		display: block;
		width: 100%;
		margin-bottom: 20rpx
	}
}
</style>
