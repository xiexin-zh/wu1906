<template>
	<view class="u-page u-bg-fff">
		<u-popup v-model="showPopTag" mode="center" border-radius="14" width="90%" height="80%">
			<choose-classcard :type="type" :classInfo="classInfo" :schoolCode="schoolInfo.schoolCode" :bindList="controlList" @close="popclose" @confirm="popselcet"></choose-classcard>
		</u-popup>
		<u-picker @confirm="changeTime" v-model="signDateTag" :start-year="startYear" mode="time" :default-time="defaultTime" :params="params"></u-picker>
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">活动主题：</view>
				<view class="u-fx-f1 mar-r20">
					<input :disabled="type === '1'" class="item-input" maxlength="20" v-model="formData.remark" style="text-align: right;" placeholder="请输入活动主题" />
				</view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">活动地点：</view>
				<view class="u-fx-f1 mar-r20">
					<input :disabled="type === '1'" class="item-input" maxlength="10" v-model="formData.placeName" style="text-align: right;" placeholder="请输入活动地点" />
				</view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">活动开始时间:</view>
				<view class="u-fx-f1 u-fx-je u-content-color" @click="changeDatetime('startTime')">{{ formData.startTime }}</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">活动结束时间:</view>
				<view class="u-fx-f1 u-fx-je u-content-color" @click="changeDatetime('endTime')">{{ formData.endTime }}</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-f1 u-bd-b item-list">
				<view>活动内容：</view>
				<view class="u-fx-f1 u-mar-t20" v-if="type !== '1'">
					<textarea
						:auto-height="true"
						:disabled="type === '1'"
						class="item-input u-content-color"
						maxlength="100"
						v-model="formData.content"
						placeholder="请输入活动内容"
					/>
				</view>
				<view v-else class="u-fx-f1 u-fx-je">{{ formData.content }}</view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">活动发布:</view>
				<view @click="showPopTag = true" class="u-fx-f1 u-fx-je u-content-color">{{ controlTitle }}</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view>开启学生报名：</view>
				<view class="u-fx-f1 u-fx-je"><u-switch :disabled="type === '1'" v-model="formData.isSign"></u-switch></view>
			</view>
			<view v-if="formData.isSign" class="u-fx-ac u-bd-b item-list">
				<view class="tip">报名截止时间:</view>
				<view class="u-fx-f1 u-fx-je u-content-color" @click="changeDatetime('signEnddate')">{{ formData.signEnddate }}</view>
				<view class="rit-icon"></view>
			</view>
		</scroll-view>
		<view v-if="type !== '1'" class="submit-btn"><u-button type="primary" @click="submitForm">提交</u-button></view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import validateForm from '@u/validate';
import ChooseCLassCard from '@/components/choose-classcard/choose-classcard.vue';
import { store, actions } from './store/index.js';
const yzForm = {
	remark: '请输入活动主题',
	placeName: '请输入活动地点'
};
export default {
	components: {
		ChooseCLassCard
	},
	data() {
		return {
			canClick: true,
			signDateTag: false,
			showPopTag: false,
			startYear: new Date().getFullYear(),
			defaultTime: '',
			params: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true,
				second: false
			},
			formData: {
				remark: '',
				isSign: false,
				content: '',
				placeName: '',
				signEnddate: '请选择',
				startTime: '请选择',
				endTime: '请选择'
			},
			controlList: [],
			type: '', // 0新增 1查看 2编辑
			controlTitle: '请选择',
			schoolInfo: {
				schoolYearId: 0,
				schoolCode: ''
			},
			classInfo: {}
		};
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	created() {
		this.defaultTime = this.$tools.getDateTime(new Date(), 'noSecond');
		this.schoolInfo.schoolCode = store.userInfo.schoolCode;
		this.schoolInfo.schoolYearId = store.schoolYear ? store.schoolYear.schoolYearId : '';
		this.type = this.$tools.getQuery().get('type');
		this.userType = this.$tools.getQuery().get('userType');
		if (this.userType === '1') {
			this.classInfo.classCode = store.isBZR.classCode;
			this.classInfo.gradeCode = store.isBZR.gradeCode;
		} else {
			this.type = '1';
		}
		this.id = this.$tools.getQuery().get('id');
		if (this.id) {
			this.showData();
		}
	},
	methods: {
		// 表单回填
		async showData() {
			const res = await actions.schoolActivityDetail(this.id);
			this.formData.placeName = res.data.placeName;
			this.formData.startTime = this.$tools.getDateTime(res.data.startTime, 'noSecond');
			this.formData.endTime = this.$tools.getDateTime(res.data.endTime, 'noSecond');
			this.formData.remark = res.data.description;
			this.formData.content = res.data.content;
			this.formData.isSign = res.data.openSign === '1';
			this.formData.signEnddate = this.$tools.getDateTime(res.data.stopDatetime, 'noSecond');
			this.controlList = res.data.deviceList;
			this.controlTitle = `已选择${this.controlList.length}个设备`;
		},
		changeTime(item) {
			if (this.timeType === 'startTime') {
				this.formData.startTime = `${item.year}-${item.month}-${item.day} ${item.hour}:${item.minute}`;
			} else if (this.timeType === 'endTime') {
				this.formData.endTime = `${item.year}-${item.month}-${item.day} ${item.hour}:${item.minute}`;
			} else if (this.timeType === 'signEnddate') {
				this.formData.signEnddate = `${item.year}-${item.month}-${item.day} ${item.hour}:${item.minute}`;
			}
		},
		changeDatetime(type) {
			if (this.type === '1') {
				return;
			}
			if (this.timeType === 'startTime' && this.formData.startTime !== '请选择') {
				this.defaultTime = this.formData.startTime;
			} else if (this.timeType === 'endTime' && this.formData.endTime !== '请选择') {
				this.defaultTime = this.formData.endTime;
			} else if (this.timeType === 'signEnddate' && this.formData.signEnddate !== '请选择') {
				this.defaultTime = this.formData.signEnddate;
			}
			this.signDateTag = true;
			this.timeType = type;
		},
		popclose() {
			this.showPopTag = false;
		},
		popselcet(data) {
			this.controlList = data.map(el => {
				return {
					...el,
					activityId: this.id || undefined,
					schoolYearId: store.schoolYear.schoolYearId
				};
			});
			this.controlTitle = `已选择${this.controlList.length}个设备`;
			this.showPopTag = false;
		},
		submitForm() {
			if (!this.canClick) {
				return;
			}
			validateForm(yzForm, this.formData, () => {
				if (this.formData.startTime === '请选择') {
					this.$tools.toast('请选择活动开始时间');
					return;
				}
				if (this.formData.endTime === '请选择') {
					this.$tools.toast('请选择活动结束时间');
					return;
				}
				if (new Date(this.formData.endTime).getTime() <= new Date(this.formData.startTime).getTime()) {
					this.$tools.toast('活动结束时间不能晚于活动开始时间')
					return
				}
				if (this.controlList.length === 0) {
					this.$tools.toast('请选择发布设备');
					return;
				}
				if (this.formData.isSign && this.formData.signEnddate === '请选择') {
					this.$tools.toast('请选择报名截止时间');
					return;
				}
				if (this.formData.isSign && new Date(this.formData.signEnddate).getTime() > new Date(this.formData.startTime).getTime()) {
					this.$tools.toast('报名截止时间不能晚于活动开始时间')
					return
				}
				this.canClick = false;
				const req = {
					schoolCode: store.userInfo.schoolCode,
					createName: store.userInfo.userName,
					createCode: store.userInfo.userCode,
					placeName: this.formData.placeName,
					description: this.formData.remark,
					content: this.formData.content,
					startTime: this.formData.startTime,
					endTime: this.formData.endTime,
					deviceList: this.controlList,
					openSign: this.formData.isSign ? '1' : '2',
				};
				if (this.formData.isSign) {
					req.stopDatetime = this.formData.signEnddate;
				}
				console.log(req);
				let res = null;
				if (this.type === '2') {
					req.id = this.id;
					res = actions.editSchoolActivity(req);
				} else if (this.type === '0') {
					res = actions.addSchoolActivity(req);
				}
				res
					.then(res => {
						console.log(res);
						this.canClick = true;
						this.$tools.toast('发布成功', 'success');
						this.$tools.goNext(() => {
							eventBus.$emit('getList');
							this.$tools.goBack();
						});
					})
					.catch(err => {
						this.canClick = true;
						console.log(err);
					});
			});
		}
	}
};
</script>

<style lang="scss">
.u-bg-fff {
	background-color: $uni-bg-color;
}
.scroll-h {
	height: calc(100vh - 120rpx);
}
.item-list {
	padding: 25rpx 15rpx 25rpx 25rpx;
	.tip::before {
		position: absolute;
		z-index: 99;
		content: '*';
		top: 30rpx;
		color: red;
		font-weight: bold;
		left: 8rpx;
	}
}
.item-input {
	width: 100%;
	font-size: 26rpx;
	color: $u-content-color;
}
.radio-mar {
	padding-left: 35rpx;
}
.item-text-area {
	height: 120rpx;
	width: 100%;
	line-height: 40rpx;
	padding-top: 15rpx;
	color: $u-content-color;
	font-size: 24rpx;
}
.checkbox {
	padding: 30rpx 10px 10px 2px;
}
.submit-btn {
	height: 120rpx;
	padding: 20rpx;
}
.date {
	padding: 10rpx 20rpx;
	border: 1rpx solid $u-border-color;
	border-radius: 8rpx;
	margin: 10rpx 0;
}
.action {
	width: 100rpx;
}
.sign-list {
	margin: 20rpx 0 0 0;
	.day {
		border-radius: 8rpx;
		width: 100rpx;
		height: 100rpx;
		background-color: $u-type-primary;
		color: $uni-bg-color;
		font-size: 24rpx;
		view:first-child {
			font-size: 34rpx;
		}
	}
	.box {
		width: calc(100% - 120rpx);
		margin-left: 18rpx;
		.list {
			font-size: 24rpx;
			padding: 10rpx 20rpx;
			border: 1rpx solid $u-border-color;
			border-radius: 8rpx;
			margin: 0 10rpx 20rpx 10rpx;
			float: left;
			min-height: 110rpx;
			min-width: 176rpx;
		}
	}
}
.mar-lt10 {
	margin: 10rpx 0 0 10rpx;
}
.u-icon-40 {
	width: 40rpx;
	height: 40rpx;
}
.u-icon-36 {
	width: 36rpx;
	height: 36rpx;
}
</style>
