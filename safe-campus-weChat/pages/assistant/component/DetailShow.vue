<template>
	<view class="detail-show">
		<view class="detail-bg">
			<view class="detail-info u-shadow u-border-radius u-padd-40">
				<view class="u-fx">
					<view class="label-w u-content-color">申请人：</view>
					<view>{{detail.userName}}</view>
				</view>
				<view class="u-fx u-mar-t u-mar-b">
					<view class="label-w u-content-color">申请事项：</view>
					<view><u-tag  :text="detail.typeName" mode="dark"></u-tag></view>
				</view>
				<view class="u-fx">
					<view class="label-w u-content-color">申请理由：</view>
					<view class="u-fx-f1 u-height u-scroll-y">{{detail.reason}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			detail: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.detail-show {
	.detail-bg {
		height: 400rpx;
		background: url(/mobile-img/safe-task.png) no-repeat;
		background-size: auto 306rpx;
		position: relative;
		.detail-info {
			position: absolute;
			width: 90%;
			top: 80rpx;
			left: 5%;
			height: 300rpx;
			background-color: #fff;
		}
		.u-height {
			height: 120rpx;
		}
		.label-w {
			width: 180rpx;
			text-align: right;
		}
	}
}
</style>
