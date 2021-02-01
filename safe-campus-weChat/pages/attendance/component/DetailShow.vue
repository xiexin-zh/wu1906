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
					<view> {{ detail.reason }} {{ detail.duration }}小时</view>
				</view>
				<view class="u-fx u-mar-t u-mar-b">
					<view class="label-w u-content-color">开始时间：</view>
					<view> {{ detail.startTime | gmtToDate('date') }}  {{ detail.startTime | gmtToDate('time') }}</view>
				</view>
					<view class="u-fx u-mar-t u-mar-b">
					<view class="label-w u-content-color">结束时间：</view>
					<view> {{ detail.endTime | gmtToDate('date') }}   {{ detail.endTime | gmtToDate('time') }}</view>
				</view>
					<view class="u-fx u-mar-t u-mar-b">
					<view class="label-w u-content-color">是否出校：</view>
					{{detail.outSchool === 'Y' ? '是' : '否'}}
				</view>
				<view class="u-fx u-mar-t u-mar-b">
					<view class="label-w u-content-color">描述：</view>
					<view>{{detail.remark ? detail.remark : '暂无' }}</view>
				</view>
				<view class="u-fx u-mar-t u-mar-b">
					<view class="label-w u-content-color">附件：</view>
					<image class="img u-mar-l20" v-for="(item,index) in detail.photoList" :key="index" :src="item"></image>
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
		height: 580rpx;
		background: url(/mobile-img/safe-task.png) no-repeat;
		background-size: auto 306rpx;
		position: relative;
		.detail-info {
			position: absolute;
			width: 90%;
			top: 80rpx;
			left: 5%;
			height: 500rpx;
			background-color: #fff;
		}
		.u-height {
			height: 120rpx;
		}
		.label-w {
			width: 180rpx;
			text-align: right;
		}
		.img {
			width: 80rpx;
			height: 80rpx;
		}
	}
}
</style>
