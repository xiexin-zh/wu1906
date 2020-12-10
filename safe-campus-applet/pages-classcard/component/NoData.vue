<template>
	<view class="no-data u-fx-ac-jc">
		<image :style="[style]" :src="autoImg"></image>
		<text class="u-padd-t u-tips-color u-font-01">{{ msg }}</text>
		<text class="u-padd-t u-tips-color u-font-01">{{ tips }}</text>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			autoImg: {
				type: String,
				default: 'http://canpointtest.com/mini-img/auto-no-data.png'
			},
			msg: {
				type: String,
				default: '暂无数据~'
			},
			tips: {
				type: String,
				default: ''
			},
			width: {
				type: [Number, String],
				default: 120
			},
			height: {
				type: [Number, String],
				default: 120
			},
			top: {
				type: [Number, String],
				default: 50
			}
		},
		computed: {
			style() {
				const style = {
					width: this.width + 'rpx',
					height:this.height + 'rpx',
					marginTop: this.top + 'rpx'
				}
				return style
			}
		},
		data () {
			return {
			}
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	.no-data {
	}
</style>
