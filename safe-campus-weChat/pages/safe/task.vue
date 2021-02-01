<template>
	<view class="task u-page u-fx-ver">
		<view class="task-title u-padd-l20 u-padd-r20 u-font-02">
			<image class="u-mar-r20" src="/mobile-img/safe-jg.png" mode=""></image>
			您在该区域有{{ num }}条巡检任务，请及时处理
		</view>
		<view class="task-content u-fx-f1 u-fx-ver u-shadow">
			<scroll-view scroll-y="true" class="scroll-h">
				<no-data msg="暂无数据~" v-if="scheduleList && scheduleList.dateSchedulings && scheduleList.dateSchedulings.length === 0 && scheduleList.timeSchedulings && scheduleList.timeSchedulings.length === 0"></no-data>
				<view class="u-padd-l20 u-padd-r20" v-else>
					<view class="task-type u-font-1 u-main-color" v-if="scheduleList && scheduleList.dateSchedulings && scheduleList.dateSchedulings.length !== 0">全天</view>
					<view class="task-info u-padd-r20 u-padd-l20 u-mar-b20 u-fx-jsb u-shadow" v-for="item in scheduleList.dateSchedulings" :key="item.taskId" @click="detail(item)">
						<view class="u-fx">
							<view class="task-name u-mar-r20 u-padd-r20 u-padd-l20"> {{ detailInfo.taskType === '1' ? '日常巡查' : detailInfo.taskType === '2' ? '设备巡查' : '安全护导'  }} </view>
							<view class="u-fx-ver u-fx-jsa"> 
									<view class="$u-font-03 u-content-color"> {{item.taskName}} </view>
									<view class="$u-font-01 u-tips-color">
										{{ item.year }}-第{{ item.dateNum }}{{
											item.taskTimeType === '2' ? '周'
											: item.taskTimeType === '3' ? '月' 
											: item.taskTimeType === '4' ? '季度' : ''
										}}任务
									</view>
								</view>
							</view>
						<view>
							<u-button :class="['u-font-01','btn',item.state === '1' ? 'day-yes' : 'day-no' ]" type="primary" shape="square" size="mini">{{ item.state === '1' ? '已完成' : '待完成'}}</u-button>
						</view>
					</view>
					<view class="task-type u-font-1 u-main-color" v-if="scheduleList && scheduleList.timeSchedulings && scheduleList.timeSchedulings.length !== 0">限时</view>
					<view class="task-info u-padd-r20 u-padd-l20 u-mar-b20 u-fx-jsb u-shadow" v-for="item in scheduleList.timeSchedulings" :key="item.taskId" @click="detail(item)">
						<view class="u-fx">
							<view class="task-name time-yes u-padd-r20 u-padd-l20 u-mar-r20"> {{ item.taskType === '1' ? '日常巡查' : item.taskType === '2' ? '设备巡查' : '安全护导'  }} </view>
							<view class="u-fx-ver u-fx-jsa">
								<view class="$u-font-03 u-content-color"> {{item.taskName}} </view>
								<view class="$u-font-01 u-tips-color">{{item.startTime | gmtToDate('time')}} - {{item.endTime | gmtToDate('time')}}</view>
							</view>
						</view>
						<view>
							<u-button :class="['u-font-01','btn',item.state === '1'?'time-yes':'time-no' ]" type="primary" shape="square" size="mini">{{ item.state === '1' ? '已完成' : '待完成'}}</u-button>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
  import vConsole from 'vconsole'
	import eventBus from '@u/eventBus'
	import { store, actions } from './store/index.js'
	export default {
		components: {},
		data() {
			return {
				leaveList: [],
				currentIndex: 0,
				pageList: {
					page: 1,
					size: 15
				},
				morePage: false,
				eduUser: false,
				isShow: false,
				num: 0,
				morePage: false,
				scheduleList: []
			}
		},
		mounted() {
      new vConsole()
			eventBus.$on('getList', () => {
				this.myScheduleGet()
			})
			this.schoolCode = this.$tools.getQuery().get("schoolCode")
    	this.userCode= this.$tools.getQuery().get("code")
      this.date= this.$tools.getQuery().get("date")
			this.myScheduleGet()
		},
		methods: {
			async myScheduleGet() {
				const req = {
					date: this.date,
					schoolCode: this.schoolCode,
					userCode: this.userCode
				}
				const res = await actions.getMySchedule(req)
				this.scheduleList = res.data
				this.num =  this.scheduleList.dateSchedulings.length + this.scheduleList.timeSchedulings.length
			},
			detail(item) {
				const url = item.state === '1' ? `./detail?taskId=${item.taskId}&code=${this.userCode}` : `./add?taskId=${item.taskId}`
				this.$tools.navTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page {
		background-color: #FFF;
		color: $u-main-color;
	}
	.task {
		.task-title {
			height: 60rpx;
			line-height: 60rpx;
			background: #FFFFCD;
			color: #FF0000;
			image {
				width: 25rpx;
				height: 25rpx;
				margin-top: -5rpx;
				vertical-align: middle;
			}
		}
		.task-content {
			background-color: #fff;
			border-radius: $u-border-radius;
			.scroll-h {
				height: calc(100vh - 60rpx);
				.task-type {
					height: 100rpx;
					line-height: 100rpx;
					color: $u-main-color;
				}
				.task-info {
					height: 150rpx;
					align-items: center;
					.task-name {
						height: 98rpx;
						width: 98rpx;
						line-height: 36rpx;
						padding-top: 15rpx;
						border-radius: $u-border-radius;
						background-color: $u-type-primary-disabled;
						color: $u-type-primary;
					}
				}
			}
		}
	}
</style>
