<template>
	<view class="set-time">
		<u-picker v-model="isShowTime" :default-time="dateTime" mode="time" :params="params" @confirm="chooseTime"></u-picker>
		<view class="u-fx-ac u-padd-20 u-bd-t">
			<view>{{ title }}</view>
			<view class="u-fx-f1 u-tx-r"><u-switch v-model="status"></u-switch></view>
		</view>
		<view class="u-fx-ac u-padd-20 u-bd-t" v-if="status">
			<view class="time-icon"><u-image width="40rpx" height="40rpx" src="http://canpointtest.com/mini-img/time-icon.png" mode=""></u-image></view>
			<view class="u-mar-l10">日期</view>
			<view @tap="isShowTime = true" class="u-fx-f1 u-tx-r u-content-color">{{ dateTime }}</view>
			<view class="rit-arrow"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			}
		},
		data () {
			return {
				dateTime: this.$tools.getDateTime().substr(0, 16),
				status: false,
				isShowTime: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true
				},
			}
		},
		methods: {
			chooseTime(time) {
				this.dateTime = `${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}`;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.set-time {
	}
</style>
