<template>
	<view class="task-detail" v-show="showPage">
		<u-popup v-if="isAppraise" v-model="isAppraise" mode="center" border-radius="12" width="85%">
			<appraising  @close="closeDialog" :title="appraisingTitle"></appraising>
		</u-popup>
		<u-modal v-model="isDp" title="作业点评" show-cancel-button @confirm="_reviewTask">
				<view class="slot-content u-padd">
					<u-input v-model="reviewBody" type="text" />
				</view>
			</u-modal>
		<view class="dialog-bottom" v-if="isDialog">
			<view class="u-fx-ac u-padd-20">
				<view class="u-fx-f1">已选择0位学生</view>
				<view class="">
					<text class="u-type-primary-dark">全选</text>
					<text class="u-padd-l40 u-tips-color" @tap="isDialog = false">取消</text>
				</view>
			</view>
			<view class="u-fx-ac u-padd-20">
				<view class="primary-btn dp-btn u-fx-f1 u-mar-r40" @tap="isDp = true">批量点评</view>
				<view class="primary-btn dp-btn u-fx-f1" @tap="isAppraise = true">批量评优</view>
			</view>
		</view>
		<view class="u-type-white-bg u-padd-30">
			<view class="u-font-1 u-bold u-padd-b20">{{ detail.homeworkTitle }}</view>
			<view class="u-tips-color">
				{{ detail.createUserName }} 发布时间：{{ detail.publishTime }}
			</view>
			<view class="content u-padd-t">
				{{ detail.homeworkBody }}
			</view>
			<file-show :file-list="detail.annexInfoDTOS"></file-show>
			<view v-if="detail.answerStatus === 1 && !replyStatus && currentUserType === '16'" class="u-fx-ac u-bg-color u-padd u-border-radius-middle u-mar-t20">
				<view>
					<u-image width="100rpx" height="100rpx" src="http://canpointtest.com/mini-img/zy-icon.png" mode=""></u-image>
				</view>
				<view class="u-fx-f1 u-mar-l30">
					<view>作业答案</view>
					<view class="u-tips-color u-mar-t10 u-font-01">提交作业后才能查看答案</view>
				</view>
				<view class="rit-arrow"></view>
			</view>
			<view class="" v-if="replyStatus || currentUserType === '4'">
				<file-show :file-list="detail.answerAnnexs"></file-show>
			</view>
			<view class="u-type-warning u-padd-t30 u-font-01" v-if="detail.cutOffStatus === 1">作业提交截止时间：{{ detail.cutOffTime }}</view>
			<view v-if="currentUserType === '4'" class="u-fx-ac u-fx-je u-padd-t30 u-bd-t u-mar-t30">
				<view class="u-tips-color u-fx-ac">
					<view @tap="editTask" class="edit-icon"></view>
					<view @tap="_delTask" class="del-icon"></view>
				</view>
			</view>
		</view>
		<view>
			<view class="u-padd-30 u-mar-t u-fx-ac u-type-white-bg u-content-color u-font-01" @click="seeNotice">
				<text class="u-fx-f1">已查看{{homeworkStatNum.readNum || 0}}人，未查看{{homeworkStatNum.noReadNum || 0}}人，已提交{{homeworkStatNum.submitNum || 0}}人，未提交{{homeworkStatNum.noSubmitNum || 0}}人</text>
				<view class="rit-arrow"></view>
			</view>
		</view>
		<view class="task-action u-fx-ac u-mar-t" v-if="currentUserType === '4' && false">
			<view class="u-fx-f1 u-fx-ac-jc u-bd-r" @tap="isDialog = true">
				<u-image width="48rpx" height="48rpx" src="http://canpointtest.com/mini-img/dp-icon.png"></u-image>
				<text class="u-tips-color u-font-01 u-padd-t10">一键点评</text>
			</view>
			<view class="u-fx-f1 u-fx-ac-jc u-bd-r">
				<u-image width="48rpx" height="48rpx" src="http://canpointtest.com/mini-img/ryq-icon.png"></u-image>
				<text class="u-tips-color u-font-01 u-padd-t10">荣誉墙</text>
			</view>
		</view>
		<view class="u-type-white-bg u-mar-t">
			<view class="u-bd-b u-font-01" v-if="showPage">
				<u-tabs :list="list" font-size="24" :is-scroll="false" :current="statusCurrent" @change="changeStatus"></u-tabs>
			</view>
			<view class="u-padd-30 u-font-01 u-tips-color u-tx-c" v-if="reviewList.length === 0">
				暂无数据~
			</view>
			<view class="u-fx u-padd-30 u-bd-b" v-for="(view, index) in reviewList" :key="view.studentCode">
				<view class="user-name">
					{{view.studentName.substr(1)}}
				</view>
				<view class="u-fx-f1 u-mar-l">
					<view class="u-fx">
						<view class="u-fx-f1">
							<view class="u-fx-ac u-font-01 u-letter-1">
								<view class="u-fx-f1">{{ view.studentName }}</view>
								<view class="u-type-error" v-if="view.homeworkScore">{{ view.homeworkScore || 0}}分</view>
								<view class="u-type-error">{{ homeworkRateList[view.homeworkRate - 1] }}</view>
								<view class="u-padd-l10 u-type-error u-fx-ac">
									{{ view.redFlowerNum }}朵
									<image class="icon_30" src="http://canpointtest.com/mini-img/red-flower.png"></image>
								</view>
							</view>
							<view class="u-tips-color u-font-01 u-mar-t10">{{ view.submitTime }}</view>
							<view class="u-mar-t">{{view.remarks}}</view>
						</view>
						<view class="">
							<view v-if="isDialog">
								<u-checkbox size="50" v-model="isChecked" shape="circle"></u-checkbox>
							</view>
						</view>
					</view>
					<file-show :file-list="view.annexInfos"></file-show>
					<view v-show="!isDialog && currentUserType === '4'" class="u-fx-ac u-content-color u-padd-t20">
						<view class="u-fx-f1" @tap="dpShow(view)">点评</view>
						<view class="u-fx-f1" @tap="appraising(view)">评优</view>
					</view>
					<view class="reply-info u-font-01 u-bg-color u-bd-t u-mar-t">
						<view class="u-padd-10" v-for="(msg, index) in view.homeworkReviewInfoList" :key="index">
							<text class="u-type-primary-dark">{{msg.userName}}：</text>
							<text>{{msg.reviewBody}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="currentUserType === '16'" class="task-ok ub-bd-t">
			<view :class="['primary-btn btn', {'act': replyStatus}]" @tap="_submitTask">{{ replyStatus ? '我已提交作业' : '我要交作业'}}</view>
		</view>
	</view>
</template>

<script>
	import FileShow from '../component/FileShow.vue'
	import Appraising from './component/Appraising.vue'
	import { store, actions } from '@store'
	import eventBus from '@u/eventBus'
	import baseData from '@u/base-data'
	export default {
		components: {
			FileShow,
			Appraising
		},
		computed: {
			userInfo: () => store.userInfo,
			bindStudentList: () => store.bindStudentList,
			currentUserType: () => store.currentUserType
		},
		data () {
			return {
				replyStatus: 0,
				baseData,
				appraisingTitle: '点评',
				isAppraise: false,
				isDp: false,
				reviewBody: '', // 点评信息
				isDialog: false,
				showPage: false,
				detail: {},
				statusCurrent: 0,
				isChecked: false,
				fileList: [],
				list: [],
				homeworkStatNum: {
					readNum: 0,
					noReadNum: 0,
					submitNum: 0,
					noSubmitNum: 0
				},
				reviewList: [],
				homeworkRateList: ['A+', 'A', 'A-', 'B+', 'B', 'B-']
			}
		},
		mounted () {
			this.list = [
				{
					name: '全部'
				},
				{
					name: '已批'
				},
				{
					name: '未批'
				},
				{
					name: '优秀'
				}
			]
			eventBus.$on('editTaskOk', () => {
				this._getTaskDetail()
			})
			this._getTaskDetail()
		},
		methods: {
			changeStatus (index) {
				this.statusCurrent = index
				if (index === 0) {
					this.reviewList = this.detail.studentHomeworkDTOS.filter(item => {
						return item.submitStatus === 1
					})
				} else if (index === 1) {
					this.reviewList = this.detail.studentHomeworkDTOS.filter(item => {
						return item.reviewStatus === 1 && item.submitStatus === 1
					})
				} else if (index === 2) {
					this.reviewList = this.detail.studentHomeworkDTOS.filter(item => {
						return item.reviewStatus === 0 && item.submitStatus === 1
					})
				} else if (index === 3) {
					this.reviewList = this.detail.studentHomeworkDTOS.filter(item => {
						return item.goodStatus === 1 && item.submitStatus === 1
					})
				}
			},
			/**
			 * @description 获取作业详情
			 */
			async _getTaskDetail () {
				const taskCode = uni.getStorageSync('taskCode')
				const res = await actions.getTaskDetail({
					identFlag: this.currentUserType === '4' ? 1 : 2,
					userCode: this.baseData.getUserCode(),
					homeworkCode: taskCode,
				})
				this.showPage = true
				this.fileList = res.data.annexInfoDTOS
				this.homeworkStatNum = res.data.homeworkStatNum
				// 如果是家长：存储我的回复状态和回复id
				if (this.currentUserType === '16') {
					const myReply = res.data.studentHomeworkDTOS.find(item => {
						return item.studentCode === this.baseData.getUserCode()
					})
					this.replyStatus = myReply.submitStatus
					this.replyId = myReply.id
					this.recordCode = myReply.recordCode
				}
				this.reviewList = res.data.studentHomeworkDTOS.filter(item => {
					return item.submitStatus === 1
				})
				this.detail = res.data
			},
			editTask (item) {
				// 存储编辑标识
				uni.setStorageSync('isEditTask', this.detail)
				this.$tools.navTo({
					url: '/pages-classcard/task/addTask'
				})
			},
			_delTask () {
				this.$tools.delTip('确定删除吗?', async () => {
					this.$tools.showLoading('删除中...')
					await actions.delTask(this.detail.id)
					this.$tools.toast('删除成功')
					this.$tools.goNext(() => {
						eventBus.$emit('initTask')
						this.$tools.goBack()
					})
				})
			},
			/**
			 * @description  评优
			 */
			closeDialog () {
				this.isAppraise = false
			},
			appraising (view) {
				uni.setStorageSync('appraiseInfo', {
					appraiseId: view.id,
					appraiseCode: view.recordCode,
					homeworkRate: view.homeworkRate,
					goodStatus: view.goodStatus,
					activeStatus: view.activeStatus,
					earnestStatus: view.earnestStatus,
					neatStatus: view.neatStatus,
					progressStatus: view.progressStatus
				})
				uni.setStorageSync('appraiseId', view.id)
				uni.setStorageSync('appraiseCode', view.recordCode)
				this.appraisingTitle = `点评${view.studentName}同学`
				this.isAppraise = true
			},
			/**
			 * @description  点评作业
			 */
			dpShow (item) {
				this.isDp = true
				this.reviewId = item.id
				this.reviewCode = item.recordCode
			},
			async _reviewTask () {
				if (this.reviewBody === '') {
					this.isDp = true
					this.$tools.toast('请输入点评内容')
					return
				}
				try {
					this.isDp = false
					this.$tools.showLoading('点评中...')
					await actions.reviewTask({
							homeworkCode: this.detail.homeworkCode,
							id: this.reviewId,
							reviewTime: this.$tools.getDateTime(),
							recordCode: this.reviewCode,
							reviewBody: this.reviewBody,
							userCode: this.userInfo.userCode,
							userIdent: this.currentUserType === '4' ? 1 : 2,
							userName: this.userInfo.userName
					})
					this.$tools.toast('点评成功')
					this.$tools.goNext(() => {
						this._getTaskDetail()
					})
				} catch(err) {}
			},
			/**
			 * @description 提交作业
			 */
			_submitTask () {
			  if (this.replyStatus) return
				uni.setStorageSync('replyTaskInfo', {
					replyId: this.replyId,
					recordCode: this.recordCode,
					subjectCode: this.detail.subjectCode,
					homeworkTitle: this.detail.homeworkTitle
				})
				this.$tools.navTo({
					url: '/pages-classcard/task/submitTask'
				})
			},
			/**
			 * @description  查看作业情况
			 */
			seeNotice () {
				if (this.currentUserType === '16') return
				this.$tools.navTo({
					url: `/pages-classcard/task/seeTask?readNum=${this.detail.homeworkStatNum.readNum}&noReadNum=${this.detail.homeworkStatNum.noReadNum}&submitNum=${this.detail.homeworkStatNum.submitNum}&noSubmitNum=${this.detail.homeworkStatNum.noSubmitNum}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.task-detail {
		padding-bottom: 200rpx;
		.dialog-bottom {
			border-top: 1px #f5f5f5 solid;
			position: fixed;
			width: 100%;
			height: 200rpx;
			z-index: 99;
			bottom: 0;
			left: 0;
			background-color: #fff;
			.dp-btn {
				height: 75rpx;
				line-height: 75rpx;
				border-radius: $u-border-radius;
				font-size: 26rpx;
			}
		}
		.answer-icon {
			width: 100rpx;
			height: 100rpx;
			display: block;
		}
		.user-name {
			width: 80rpx;
			height: 80rpx;
			font-size: 24rpx;
			line-height: 80rpx;
			text-align: center;
			background-color: $u-type-primary;
			color:#fff;
			border-radius: 100%;
		}
		.content {
			line-height: 50rpx;
			color: $u-content-color;
		}
		.notice-img {
			width: 100%;
			height: 200rpx;
			margin: 30rpx 20rpx;
			display: block;
		}
		.edit-icon {
			width: 60rpx;
			height: 42rpx;
			background: url(http://canpointtest.com/mini-img/edit-icon.png) no-repeat center;
			background-size: 42rpx 42rpx;
		}
		.del-icon {
			width: 60rpx;
			height: 42rpx;
			background: url(http://canpointtest.com/mini-img/del-icon.png) no-repeat center;
			background-size: 42rpx 42rpx;
			margin-left: 30rpx;
		}
		.task-action {
			height: 130rpx;
			background-color: #fff;
		}
		.user-icon {
			width: 80rpx;
			height: 80rpx;
			display: block;
			border-radius: 100%;
			background-color: $u-bg-color;
		}
		.red-flower-icon {
			width: 80rpx;
			text-align: center;
		}
		.task-ok {
			width: 100%;
			padding: 0 20rpx;
			position: fixed;
			z-index: 999;
			bottom: 0rpx;
			left: 0rpx;
			height: 100rpx;
			background-color: $u-type-white;
			.btn {
				height: 70rpx;
				line-height: 70rpx;
				width: 80%;
				margin: 15rpx auto;
				font-size: 24rpx;
			}
			.act {
				opacity: .4;
			}
		}
	}
</style>
