<template>
	<view class="container u-bg-fff">
		<view class="set_box" v-for="(item, index) in talk" :key="index">
			<!-- 步骤条 -->
			<view class="set-1">
				<view class="set-2" @click="reportDetail(item)">
					<view class="time mar-b20">{{ item.reportTime | gmtToDate('time') }}</view>
					<view :class="item.enableFever ? 'right u-fx-ver bd-err' : 'right u-fx-ver bd-normol'" class="right u-fx-ver">
						<view class="info u-fx-jsb u-fx-ac">
							<text class="detail">体温</text>
							<text class="detail">{{ item.temperature }}ºC</text>
							<text :class="item.enableFever ? 'err u-white-color' : 'normal u-white-color'">{{ item.enableFever ? '发热' : '未发热' }}</text>
						</view>
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
	methods: {
		reportDetail(record) {
			this.$tools.navTo({
				url: './detail?id=' + record.id
			});
		},
	}
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
	width: calc(100% - 40rpx);
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

.right{
	padding: 40rpx 20rpx;
	border-radius: $u-border-radius;
}
.bd-err{
	border: 1rpx solid $u-type-error;
	background-color: $u-type-error-light;
}
.bd-normol{
	border: 1rpx solid $u-border-color;
}
.info{
	.err,.normal{
		width: 120rpx;
		background-color: $u-type-info;
		border-radius: $u-border-radius;
		text-align: center;
		padding: 4rpx 0;
	}
	.err{
		background-color: $u-type-error;
	}
}
</style>
