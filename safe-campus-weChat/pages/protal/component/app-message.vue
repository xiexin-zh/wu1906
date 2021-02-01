<template>
	<view class="app-message u-auto">
		<no-data v-if="dataList.length === 0"></no-data>
		<view @tap="goDetail(data)" v-for="(data, index) in dataList" :key="index" class="message-item u-mar u-padd u-border-radius u-type-white-bg u-line2">
			<view class="u-fx-ac">
				<view class="u-fx-f1 u-font-1">{{ data.title }}</view>
				<view class="u-tips-color u-font-01">{{ $tools.getDateTime(data.creatTime).substr(5, 11) }}</view>
			</view>
			<view class="u-content-color">{{ data.content.split('#')[0] }}</view>
			<view class="u-tips-color u-font-01" v-for="(data, index) in data.content.split('#').slice(1)" :key="index">
				<view>{{ data }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'app-message',
		props: {
			dataList: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		methods: {
			/**
			 * @description 跳转消息详情
			 * @params {data: object} 消息详情
			 */
			goDetail (data) {
				if (data.detailUrl) {
					this.$tools.navTo({
						url: data.detailUrl.indexOf('#') > -1 ? data.detailUrl.split('#')[1] : data.detailUrl,
						title: '详情'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.app-message {
		
	}
</style>
