<template>
	<view class="container">
		<view class="set_box" v-for="(item, index) in talk" :key="index">
			<view class="set_time">
				<view>{{ item.YYMMDD }}</view>
			</view>
			<!-- 步骤条 -->
			<view class="set-1">
				<view class="set-2">
					<view class="right u-fx-ver">
						<text class="detail">来访事由： {{ item.causeName }}</text>
						<text class="detail">来访时间： {{ item.inTime }}</text>
						<text class="detail">签离时间： {{ item.outTime }}</text>
						<text class="detail">来访时长： {{ item.countTime }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		talk: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
		};
	},
	methods: {}
};
</script>

<style lang="scss">
.set_box {
	width: 100%;
	display: flex;
	flex-direction: row;
}
/* 左侧时间 */
.set_time {
	width: 30%;
	position: relative;
	view {
		width: 100%;
		position: absolute;
		margin: 30rpx 0 0 20rpx;
		color: $u-content-color;
	}
}
/* 右侧内容 */
.set-1 {
	width: 80%;
	margin-top: 60upx;
}
.set-2 {
	margin-left: 100rpx;
	position: relative;
	.right {
		.detail {
			font-size: 28rpx;
			margin-bottom: 10rpx;
		}
	}
}
.set-2::after {
	content: '';
	/* 必须存在如果没有图标就留空 */
	top: 0rpx;
	/* 定位 距离*/
	border-left: $u-light-color 1px solid;
	/* 横线颜色 */
	left: -44rpx;
	/* 定位 距离*/
	height: 120%;
	/* 高度 */
	position: absolute;
	/* 定位 */
	
}

.set-2::before {
	content: '';
	/* 必须存在如果没有图标就留空 */
	color: $u-type-info;
	/* 设置颜色 */
	position: absolute;
	/* 定位 */
	left: -55upx;
	top: -18upx;
	width: 20rpx;
	height: 20rpx;      
	border-radius: 100%;      
	background-color: $u-light-color;      
}
</style>
