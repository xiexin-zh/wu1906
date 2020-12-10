<template>
	<view class="appraising">
		<view class="title u-bold u-padd-b30 u-tx-c">
			{{ title }}
		</view>
		<view :class="['choose-box', {'act': goodStatus}]" @tap="goodStatus = !goodStatus">优秀作业</view>
		<view class="u-tips-color u-padd-t40 u-padd-b">红花激励</view>
		<view class="u-fx-ac">
			<view :class="['choose-box u-fx-f1', {'act': neatStatus}]" @tap="neatStatus = !neatStatus">书写工整</view>
			<view :class="['choose-box u-fx-f1 u-mar-l30', {'act': earnestStatus}]" @tap="earnestStatus = !earnestStatus">态度认真</view>
		</view>
		<view class="u-fx-ac u-mar-t40">
			<view :class="['choose-box u-fx-f1', {'act': activeStatus}]" @tap="activeStatus = !activeStatus">积极完成</view>
			<view :class="['choose-box u-fx-f1 u-mar-l30', {'act': progressStatus}]" @tap="progressStatus = !progressStatus">进度明显</view>
		</view>
		<view class="u-tips-color u-padd-t40 u-padd-b">作业等级</view>
		<view class="u-fx">
			<view @tap="chooseRate(index)" :class="['choose-box u-fx-f1 u-mar-r', {'act': currentRate === index}]" v-for="(rate, index) in homeworkRate" :key="index">{{ rate }}</view>
		</view>
		<view class="u-tips-color u-fx-ac u-padd-t u-padd-b" v-if="false">
			<view>作业得分</view>
			<view class="u-mar-l40">
				<u-input border v-model="score" placeholder="请输入得分" />
			</view>
		</view>
		<view class="u-fx" v-if="false">
			<view class="choose-box u-fx-f1">100</view>
			<view class="choose-box u-fx-f1 u-mar-l">95</view>
			<view class="choose-box u-fx-f1 u-mar-l">90</view>
			<view class="choose-box u-fx-f1 u-mar-l">85</view>
			<view class="choose-box u-fx-f1 u-mar-l">80</view>
			<view class="choose-box u-fx-f1 u-mar-l">75</view>
		</view>
		<view v-if="false">
			<view class="u-tips-color u-padd-t u-padd-b">需修改重做</view>
			<view class="u-fx">
				<view class="choose-box u-fx-f1">需修订</view>
				<view class="choose-box u-fx-f1 u-mar-l">打回重做</view>
			</view>
		</view>
		<view class="u-fx-ac u-mar-t40 u-padd-t">
			<view class="u-fx-f1 sumbit-btn cancel" @tap="closeD">取消</view>
			<view class="u-fx-f1 sumbit-btn u-mar-l40" v-if="currentRate < 0" @tap="_addTaskApprais">确定</view>
		</view>
	</view>
</template>

<script>
	import eventBus from '@u/eventBus'
	import { actions } from '@store'
	export default {
		props: {
			title: {
				type: String,
				default: '作业点评'
			}
		},
		data () {
			return {
				currentRate: uni.getStorageSync('appraiseInfo').homeworkRate - 1,
				homeworkRate: ['A+', 'A', 'A-', 'B+', 'B', 'B-'],
				goodStatus: uni.getStorageSync('appraiseInfo').goodStatus == 1 ? true : false,
				activeStatus: uni.getStorageSync('appraiseInfo').activeStatus == 1 ? true : false,
				earnestStatus: uni.getStorageSync('appraiseInfo').earnestStatus == 1 ? true : false,
				neatStatus: uni.getStorageSync('appraiseInfo').neatStatus == 1 ? true : false,
				progressStatus: uni.getStorageSync('appraiseInfo').progressStatus == 1 ? true : false
			}
		},
		methods: {
			chooseRate (index) {
				this.currentRate = index
			},
			async _addTaskApprais () {
					if (this.currentRate <= 0) {
						this.$tools.toast('请选择作业等级')
						return
					}
					this.$tools.showLoading('评优中...')
					await actions.addTaskApprais({
						correctStatus: 0,
						activeStatus: this.activeStatus ? 1 : 0,
						goodStatus: this.goodStatus ? 1 : 0,
						earnestStatus: this.earnestStatus ? 1 : 0,
						neatStatus: this.neatStatus ? 1 : 0,
						progressStatus: this.progressStatus ? 1 : 0,
						homeworkCode: uni.getStorageSync('taskCode'),
						id: uni.getStorageSync('appraiseInfo').appraiseId,
						recordCode: uni.getStorageSync('appraiseInfo').appraiseCode,
						homeworkScore: 0,
						homeworkRate: this.currentRate + 1
					})
					this.$tools.toast('评优成功')
					eventBus.$emit('editTaskOk')
					this.closeD()
			},
			closeD () {
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.appraising {
		width: 100%;
		padding: 60rpx 40rpx;
		border-radius: $u-border-radius;
		
		.choose-box {
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background-color: #ffefe7;
			border-radius: $u-border-radius;
			&.act {
				background-color: #f3705a;
				color:#fff;
			}
		}
		.sumbit-btn {
			background-color: #f3705a;
			color:#fff;
			border-radius: $u-border-radius;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
		}
		.cancel {
			background-color: $u-bg-color;
			color:#666
		}
	}
</style>
