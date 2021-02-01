<template>
	<view class="u-page u-bg-fff">
		<u-popup v-model="showPopTag" mode="center" border-radius="14" width="90%" height="80%">
			<choose-fullscreen :albumCode="id" :bindList="controlList" @close="showPopTag = false" @confirm="popselcet"></choose-fullscreen>
		</u-popup>
		<u-picker @confirm="changeTime" v-model="signDateTag" :start-year="startYear" mode="time" :default-time="defaultTime" :params="params"></u-picker>
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">开始时间:</view>
				<view class="u-fx-f1 u-fx-je u-content-color" @click="changeDatetime('startTime')">{{ formData.startTime }}</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">结束时间:</view>
				<view class="u-fx-f1 u-fx-je u-content-color" @click="changeDatetime('endTime')">{{ formData.endTime }}</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">选择全屏展示的设备:</view>
				<view @click="showPopTag = true" class="u-fx-f1 u-fx-je u-content-color">{{ controlTitle }}</view>
				<view class="rit-icon"></view>
			</view>
		</scroll-view>
		<view class="submit-btn"><u-button type="primary" @click="submitForm">提交</u-button></view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import ChooseFullscreen from './component/choose-fullscreen.vue';
import { store, actions } from './store/index.js';
export default {
	components: {
		ChooseFullscreen
	},
	data() {
		return {
			showPopTag: false,
			signDateTag: false,
			canClick: true,
			controlList: [],
			id: '',
			type: '', // 0新增 1查看 2编辑
			controlTitle: '请选择',
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
				startTime: '请选择',
				endTime: '请选择'
			},
			schoolInfo: {
				schoolCode: ''
			}
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
		this.schoolInfo.schoolCode = store.userInfo.schoolCode;
		this.defaultTime = this.$tools.getDateTime(new Date(), 'noSecond');
		this.id = this.$tools.getQuery().get('id');
		if (this.id) {
			this.showData();
		}
	},
	methods: {
		// 表单回填
		async showData() {
			const res = await actions.getFullDevice({
				mediaCode: this.id,
				mediaType: 2
			});
			this.formData = {
				startTime: res.data.startTime ? this.$tools.getDateTime(res.data.startTime, 'noSecond') : this.$tools.getDateTime(new Date(), 'noSecond'),
				endTime: res.data.endTime ? this.$tools.getDateTime(res.data.endTime, 'noSecond') : this.$tools.getDateTime(new Date(new Date().getTime() + (24 * 60 * 60 * 1000)), 'noSecond')
			}
			this.controlList = res.data.deviceList
			this.controlTitle = `已选择${this.controlList.length}个设备`;
		},
		popselcet(data) {
			console.log(data);
			this.controlList = data;
			this.controlTitle = `已选择${data.length}个设备`;
			this.showPopTag = false;
		},
		changeTime(item) {
			if (this.timeType === 'startTime') {
				this.formData.startTime = `${item.year}-${item.month}-${item.day} ${item.hour}:${item.minute}`;
			} else if (this.timeType === 'endTime') {
				this.formData.endTime = `${item.year}-${item.month}-${item.day} ${item.hour}:${item.minute}`;
			}
		},
		changeDatetime(type) {
			if (this.timeType === 'startTime' && this.formData.startTime !== '请选择') {
				this.defaultTime = this.formData.startTime;
			} else if (this.timeType === 'endTime' && this.formData.endTime !== '请选择') {
				this.defaultTime = this.formData.endTime;
			}
			this.signDateTag = true;
			this.timeType = type;
		},
		submitForm() {
			if (!this.canClick) {
				return;
			}
			if (this.formData.startTime === '请选择') {
				this.$tools.toast('请选择开始时间');
				return;
			}
			if (this.formData.endTime === '请选择') {
				this.$tools.toast('请选择结束时间');
				return;
			}
			if (new Date(this.formData.endTime).getTime() <= new Date(this.formData.startTime).getTime()) {
				this.$tools.toast('结束时间不能晚于开始时间');
				return;
			}
			if (this.controlList.length === 0) {
				this.$tools.toast('请选择全屏展示的设备');
				return;
			}
			this.canClick = false;
			const req = {
				deviceIdList: this.controlList.map(el => {
					return el.id;
				}),
				isAll: 0,
				mediaType: 2,
				mediaCode: this.id,
				startTime: this.formData.startTime,
				endTime: this.formData.endTime
			};
			console.log(req);
			actions
				.setFullShow(req)
				.then(res => {
					console.log(res);
					this.canClick = true;
					this.$tools.toast('设置成功', 'success');
					this.$tools.goNext(() => {
						eventBus.$emit('getList');
						this.$tools.goBack();
					});
				})
				.catch(err => {
					this.canClick = true;
					console.log(err);
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
