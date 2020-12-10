<template>
	<view :class="['task-list', {'padd-bottom' : currentUserType === '4'}]">
		<u-picker v-model="isShowTime" :default-time="autoTime" mode="time" :params="params" @confirm="chooseTime"></u-picker>
		<u-select v-model="isShowType" :list="subjectType" @confirm="chooseType"></u-select>
		<view class="init-list u-fx-ac u-fx-jsb">
			<view class="u-fx-ac">
				<view class="u-padd-r40 u-fx-ac" @click="isShowTime = true">
					{{ showAutoTime }}
					<view class="down-arrow"></view>
				</view>
				<view class="u-padd-l40 u-fx-f1 u-fx-ac" @tap="isShowType = true">{{ subject }}<view class="down-arrow"></view></view>
			</view>
			<view class="u-tx-r" @tap="initReset">重置筛选</view>
		</view>
		<no-data v-if="taskList.length == 0" width="200" height="200" top="100" msg="老师一键点评作业" tips="支持老师和学生多种方式发布和提交作业">
			<view class="primary-btn u-mar-t40" style="width: 80%;" @tap="_addTask">布置作业</view>
		</no-data>
		<view @tap="goDetail(task)" class="notice-item u-fx-ver" v-for="task in taskList" :key="task.homeworkCode">
			<view class="u-fx-ac u-fx-f1">
				<image class="user-icon" :src="task.photoUrl"></image>
				<view class="u-fx-f1 u-mar-l30">
					<view class="u-fx-ac">
						<u-tag :text="task.subjectName || '作业'" size="mini" bg-color="#a0cfff" color="#fff" border-color="#fff" />
						<text class="u-bold u-padd-l">{{ task.homeworkTitle }}</text>
					</view>
					<view class="u-tips-color u-font-01 u-mar-t10">{{ task.createUserName }}老师：{{ task.publishTime }}</view>
					<view class="u-mar-t10 u-fx-ac u-content-color u-font-01" v-if="task.timingStatus === 1">
						定时时间：{{ task.timingTime }} <u-tag class="u-mar-l10 u-font-02" text="定时发布" size="mini" shape="circle" />
					</view>
				</view>
			</view>
			<view class="u-te2 u-content-color u-mar-t20">{{ task.homeworkBody}}</view>
		</view>
		<teacher-bottom></teacher-bottom>
	</view>
</template>

<script>
import { store, actions } from '@store';
import baseData from '@u/base-data'
import eventBus from '@u/eventBus'
import NoData from '../component/NoData.vue'
import teacherBottom from './component/teacherBottom.vue'
export default {
	components: {
		teacherBottom,
		NoData
	},
	computed: {
		userInfo: () => store.userInfo,
		currentUserType: () => store.currentUserType,
		currentBindClass: () => store.currentBindClass,
		currentBindStudent: () => store.currentBindStudent
	},
	data() {
		return {
			baseData,
			isShowTime: false,
			isShowType: false,
			autoTime: '',
			showAutoTime: '日期',
			subject: '科目',
			subjectCode: '',
			subjectType: store.subjectList.map(item => {
				return {
					value: item.subjectCode,
					label: item.subjectName
				}
			}),
			params: {
				year: true,
				month: true,
				day: true
			},
			pageList: {
				pageNum: 1,
				pageSize: 20
			},
			taskList: []
		};
	},
	onPullDownRefresh() {
		this.pageList.pageNum = 1
		this._getTaskList()
		setTimeout(() => {
			uni.stopPullDownRefresh()
		}, 1500);
	},
	onReachBottom() {
		this.pageList.pageNum ++
		this._getTaskList(true)
	},
	mounted() {
		eventBus.$on('initTask', () => {
			this.pageList.pageNum = 1
			this._getTaskList()
		})
		this._getTaskList()
	},
	methods: {
		_addTask () {
			this.$tools.navTo({
				url: '/pages-classcard/task/addTask'
			})
		},
		/**
		 * @description 选择科目
		 */
		chooseType (item) {
			this.pageList.pageNum = 1
			this.subject = item[0].label
			this.subjectCode = item[0].value
			this._getTaskList()
		},
		/**
		 * @description 重置条件
		 */
		initReset () {
			this.autoTime = ''
			this.showAutoTime = '日期'
			this.subject = '科目'
			this.pageList.pageNum = 1
			this.subjectCode = ''
			this._getTaskList()
		},
		/**
		 * @description 选择日期
		 */
		chooseTime (time) {
			this.autoTime = `${time.year}-${time.month}-${time.day}`
			this.showAutoTime = `${time.year}-${time.month}-${time.day}`
			this._getTaskList()
		},
		/**
		 * @description 获取通知列表
		 */
		async _getTaskList(tag) {
			const res = await actions.getTaskList({
				classCode: baseData.getClassCode(),
				homeworkTitle: "",
				pageNum: this.pageList.pageNum,
				pageSize: 20,
				subjectCode: this.subjectCode,
				schoolCode: this.userInfo.schoolCode,
				startTime: this.autoTime,
				endTime: this.autoTime,
				userCode: this.baseData.getUserCode(),
				identType: this.currentUserType === '4' ? 1 : 2
			})
			if (tag) {
				if (res.data.records.length === 0) {
					this.$tools.toast('数据已加载完毕')
				}
				this.taskList = this.taskList.concat(res.data.records)
			} else {
				this.taskList = res.data.records
			}
		},
		goDetail(item) {
			uni.setStorageSync('taskCode', item.homeworkCode)
			this.$tools.navTo({
				url: '/pages-classcard/task/taskDetail',
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.task-list {
	padding: 110rpx 30rpx 0rpx;
	.init-list {
		color: $u-content-color;
		padding: 0 30rpx;
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 88;
		height: 88rpx;
		background-color: #fff;
	}
	&.padd-bottom {
		padding-bottom: 130rpx
	}
	.date-tip {
		border-radius: 100rpx;
		margin: 20rpx auto;
		display: inline-block;
		background-color: #dbdbdb;
		height: 40rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		padding: 0 20rpx;
		color: #fff;
	}
	.notice-item {
		margin-bottom: 30rpx;
		height: 230rpx;
		background-color: #fff;
		border-radius: $u-border-radius;
		padding: 20rpx;
		.user-icon {
			width: 84rpx;
			height: 84rpx;
			display: block;
			border-radius: 100%;
			background-color: $u-bg-color;
		}
	}
	.add-btn {
		background-color: $u-bg-color;
		height: 120rpx;
		width: 100%;
		position: fixed;
		z-index: 99;
		bottom: 0rpx;
		left: 0rpx;
	}
}
</style>
