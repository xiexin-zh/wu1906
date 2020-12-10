<template>
	<view class="publish-success">
		<view class="success-info u-fx-ac-jc">
			<view>
				<u-image width="128rpx" height="128rpx" src="http://canpointtest.com/mini-img/success-ok.png"></u-image>
			</view>
			<view class="u-font-3 u-content-color u-bold u-padd-30">发布成功</view>
			<view class="u-tips-color u-tx-c">{{tips}}</view>
		</view>
		<guide></guide>
	</view>
</template>

<script>
	import Guide from '../component/Guide.vue'
	import eventBus from '@u/eventBus'
	export default {
		components: {
			Guide
		},
		data () {
			return {
				tips: ''
			}
		},
		mounted () {
		},
		methods: {
			goModule (type) {
				if (type === 'list') {
					this.$tools.goBack()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.publish-success {
		.success-info {
			background-color: #fff;
			padding: 50rpx 80rpx;
		}
	}
</style>
