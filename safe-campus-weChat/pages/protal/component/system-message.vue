<template>
	<view class="app-message u-auto">
		<no-data v-if="dataList.length === 0"></no-data>
		<view @click="goDetail(data, noticeIndex, index)" v-for="(data, index) in dataList" :key="index" class="message-item u-mar u-padd u-border-radius u-type-white-bg">
			<view class="u-fx-ac">
				<view class="tips-w">
					<view class="tips" v-if="!data.readStatus"></view>
				</view>
				<view :class="['u-fx-f1 u-font-1', {'u-tips-color': data.readStatus}]">{{ data.title }}</view>
				<view class="u-tips-color u-font-01">{{ $tools.getDateTime(data.creatTime).substr(5,6)}}</view>
			</view>
			<view v-html="data.content" class="u-tips-color u-mar-t u-font-01 u-te2 content">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'app-message',
		props: {
			noticeIndex: {
				type: Number,
				default: 0
			},
			dataList: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data () {
			return {
			}
		},
		methods: {
			goDetail (item, index, _index) {
				uni.setStorageSync('sysDetail', JSON.stringify(item))
				this.dataList[_index].readStatus = 1
				this.$tools.navTo({
					url: `../protal/messageDetail?index=${index}`,
					title: '详情'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.app-message {
		.tips-w {
			width: 20rpx;
		}
		.tips {
			width: 10rpx;
			height: 10rpx;
			background-color: $u-type-primary;
			border-radius: 100%;
		}
		.content {
			height: 80rpx;
			overflow: hidden;
			padding: 0 $u-mp-20;
			color: $u-content-color !important;
			line-height: 40rpx;
		}
	}
</style>
