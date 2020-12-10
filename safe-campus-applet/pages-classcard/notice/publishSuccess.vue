<template>
	<view class="publish-success">
		<view class="success-info u-fx-ac-jc">
			<u-image width="128rpx" height="128rpx" src="http://canpointtest.com/mini-img/success-ok.png"></u-image>
			<view class="u-font-3 u-content-color u-bold u-padd-30">发布成功</view>
			<view class="u-tips-color u-tx-c">{{tips}}</view>
		</view>
		<guide></guide>
	</view>
</template>

<script>
	import eventBus from '@u/eventBus'
	import Guide from '../component/Guide.vue'
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
			const type = parseInt(uni.getStorageSync('noticeType'))
			if (type === 1) {
				this.tips = '你发送的是普通通知，可以在通知详情中查看学生家长的查阅情况'
			} else if (type === 2) {
				this.tips = '你发送的是重要通知，可以在通知详情中查看学生家长的查看数以及收到的回复情况'
			} else if (type === 3) {
				this.tips = '你发送的是回执通知，可以在通知详情中查看学生家长的查看情况以及反馈的内容'
			} else if (type === 4) {
				this.tips = '你发送的是通知公告，可以在通知详情中查看学生家长的查看情况以及反馈的内容'
			}
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
		.success-icon {
			width: 160rpx;
			height: 160rpx;
			display: block;
		}
		.other-info {
			background-color: #fff;
			margin-top: 20rpx;
			padding: 20px 80rpx;
		}
	}
</style>
