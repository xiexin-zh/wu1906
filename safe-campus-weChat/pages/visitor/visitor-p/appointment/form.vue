<template>
	<view>
		<scroll-view scroll-y="true" @scrolltolower="showList(true)" class="scroll-h">
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">被访人学校：</view>
				<view class="u-fx-f1 u-fx-je">
					<picker :disabled="disabledTag" mode="selector" :value="formData.school" :range="schoolNameList" @change="chooseSchool">
						{{ schoolNameList[formData.school] || '请选择' }}
					</picker>
				</view>
				<view>></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">被访人姓名：</view>
				<view class="u-fx-f1"><input :disabled="disabledTag" class="item-input al-r" v-model="formData.visitorName" placeholder="请输入" /></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">被访人手机号：</view>
				<view class="u-fx-f1 u-fx-je"><input :disabled="disabledTag" class="item-input al-r" v-model="formData.phone" placeholder="请输入" /></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">预计到达时间：</view>
				<view @click="show = true" class="u-fx-f1 u-fx-je">
					<u-picker v-model="show" :start-year="startYear" mode="time" :params="params" @confirm="timeChange"></u-picker>
					<view class="uni-input">{{ formData.accessStartTime }}</view>
				</view>
				<view>></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">来访事由：</view>
				<view class="u-fx-f1 u-fx-je">
					<picker mode="selector" :value="formData.cause" :range="causeNameList" @change="chooseCause">{{ causeNameList[formData.cause] || '请选择' }}</picker>
				</view>
				<view>></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view>随行人数：</view>
				<view class="u-fx-f1"><input class="item-input al-r" v-model="formData.togetherNum" placeholder="0" /></view>
			</view>
			<view class="log">
				<view class="item-list">
					<view class="tip">我的照片：</view>
					<view class="u-fx-f1 u-mar-t u-mar-b">
						<view class="upload-user-img" @click="chooseImg">
							<image v-if="formData.photoUrl" :src="formData.photoUrl" class="upload-user-img"></image>
							<view v-if="!formData.photoUrl" class="upload-user-img">+</view>
						</view> 
					</view>
					<view class="sub-title">请上传1张本人正脸清晰照片用于来访识别。</view>
				</view>
			</view>
		</scroll-view>
		<view class="common-btn" @click="confirm">提交</view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import wxApi from '@u/wxApi'
import { store, actions } from '../store/index.js';
export default {
	components: {
	},
	data() {
		return {
			wxApi,
			disabledTag: false,
			show: false,
			params: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true,
				second: false
			},
			startYear: new Date().getFullYear(),
			causeNameList: [],
			causeList: [],
			schoolNameList: [],
			schoolList: [],
			id: '',
			defaultDate: '',
			type: '', // 0-修改  1-再次邀约
			formInfo: {},
			formData: {
				school: 0,
				visitorName: '',
				phone: '',
				cause: '',
				accessStartTime: this.$tools.getDateTime(new Date(), 'dateTimeWithOutSecond'),
				togetherNum: '',
				photoUrl: ''
			}
		};
	},
	computed: {},
	created() {
		this.id = this.$tools.getQuery().get('id');
		this.type = this.$tools.getQuery().get('type');
	},
	async mounted() {
		this.getSchool();
		if (this.id) {
			const res = await actions.getInviteDetail(this.id);
			if (!res.data.id) {
				return;
			}
			this.disabledTag = true;
			this.formData.visitorName = res.data.respondentName;
			this.formData.address = res.data.address;
			this.formData.phone = res.data.resMobile;
			this.formData.duration = res.data.duration + '小时';
			this.formData.photoUrl(res.data.visitorUrl);
			this.formData.cause = this.causeNameList.findIndex(item => {
				return item === res.data.causeName;
			});
		}
	},
	methods: {
		// 上传图片
		chooseImg() {
			this.wxApi.wxChoosePhoto(null, true, (url) => {
				this.formData.photoUrl = url
			})
		},
		async getSchool() {
			const req = {
				schoolCode: store.userInfo.schoolCode,
				userCode: store.userInfo.userCode
			};
			const res = await actions.getSchoolList(req);
			if (res.data.length === 0) {
				this.$tools.toast('请绑定学校');
				return;
			}
			res.data.forEach(ele => {
				this.schoolNameList.push(ele.schoolName);
				this.schoolList.push({
					text: ele.schoolName,
					value: ele.schoolCode
				});
			});
			this.$tools.goNext(() => {
				this.getCause();
			});
		},
		async getCause() {
			if (!this.schoolList[this.formData.school]) {
				this.$tools.toast('请选择拜访学校');
			}
			this.causeList = []
			this.causeNameList = []
			const req = {
				schoolCode: this.schoolList[this.formData.school].value
			};
			const res = await actions.getCauseList(req);
			if (res.data.list.length === 0) {
				return;
			}
			res.data.list.forEach(ele => {
				this.causeNameList.push(ele.causeName);
				this.causeList.push({
					text: ele.causeName,
					value: ele.id
				});
			});
		},
		async confirm() {
			if (this.formData.school === '') {
				this.$tools.toast('请选择被访人学校');
			} else if (this.formData.visitorName === '') {
				this.$tools.toast('请填写被访人姓名');
			} else if (this.formData.phone === '') {
				this.$tools.toast('请填写被访人手机号');
			} else if (!/^1[3456789]\d{9}$/.test(this.formData.phone)) {
				this.$tools.toast('请填写正确手机号');
			} else if (this.formData.cause === '') {
				this.$tools.toast('请选择来访事由');
			} else if (new Date(this.formData.accessStartTime).getTime() < new Date().getTime()) {
				this.$tools.toast('请填写正确到达时间');
			} else if (this.formData.photoUrl === '') {
				this.$tools.toast('请上传照片');
			} else {
				let school = this.schoolList.filter(ele => {
					return ele.text === this.schoolNameList[this.formData.school];
				})[0];
				console.log(school);
				if (!school) {
					this.$tools.toast('请选择被访人学校');
					return;
				}
				let cause = this.causeList.filter(ele => {
					return ele.text === this.causeNameList[this.formData.cause];
				})[0];
				console.log(cause);
				if (!cause) {
					this.$tools.toast('请选择来访事由');
					return;
				}
				let yzreq = {
					mobile: this.formData.phone,
					userName: this.formData.visitorName,
					schoolCode: school.value
				};
				actions.verifUser(yzreq).then(res => {
					if (!res.data) {
						this.$tools.toast('请核对受访人信息');
						return;
					}
					const req = {
						schoolCode: school.value,
						schoolName: school.text,
						accessStartTime: this.formData.accessStartTime + ':00',
						respondentName: this.formData.visitorName,
						resMobile: this.formData.phone,
						togetherNum: this.formData.togetherNum,
						visitorMobile: store.userInfo.mobile,
						visitorName: store.userInfo.userName,
						causeId: cause.value,
						causeName: cause.text,
						id: this.type === '0' ? this.id : '',
						type: '0',
						respondentType: '1',
						respondentCode: res.data,
						openid: store.openid,
						visitorUrl: this.formData.photoUrl
					};
					console.log(req);
					actions.addInviteInfo(req).then(res => {
						this.$tools.toast('提交成功', 'success');
						this.$tools.goNext(() => {
							eventBus.$emit('getList');
							this.$tools.goBack();
						});
					});
				});
			}
		},
		dateChange(e, type) {
			if (type === 'startDate') {
				this.formData.startDate = e.target.value;
			} else if (type === 'startTime') {
				this.formData.startTime = e.target.value;
			} else if (type === 'endDate') {
				this.formData.endDate = e.target.value;
			} else if (type === 'endTime') {
				this.formData.endTime = e.target.value;
			}
			this.formData.accessStartTime = this.formData.startDate + ' ' + this.formData.startTime;
			this.formData.accessEndTime = this.formData.endDate + ' ' + this.formData.endTime;
			console.log(new Date(this.formData.accessStartTime).getTime());
			this.formData.duration = parseInt(Math.ceil(new Date(this.formData.accessEndTime).getTime() - new Date(this.formData.accessStartTime).getTime()) / 1000 / 60 / 60) + '小时';
		},
		timeChange(value) {
			if (!value) {
				return;
			}
			this.formData.accessStartTime = value.year + '-' + value.month + '-' + value.day + ' ' + value.hour + ':' + value.minute;
			console.log(this.formData.accessStartTime);
		},
		chooseSchool(e) {
			if (!e.target) {
				return;
			}
			this.formData.school = e.target.value;
			this.getCause();
		},
		chooseCause(e) {
			this.formData.cause = e.target.value;
		}
	}
};
</script>

<style lang="scss">
.scroll-h {
	height: calc(100vh - 88rpx);
}
.tip::before {
	position: absolute;
	content: '*';
	color: red;
	left: 10rpx;
	width: 10rpx;
	height: 10rpx;
}
.item-list {
	padding: 25rpx 10rpx 25rpx 30rpx;
	background: $uni-bg-color;
}
.item-input {
	width: 100%;
	font-size: 26rpx;
	color: $u-tips-color;
}
.radio {
	padding-left: 25rpx;
}
.checkbox {
	padding: 30rpx 10px 10px 2px;
}
.log {
	background: $uni-bg-color;
	padding: 40rpx 0rpx;
	margin: 20rpx 0 40rpx 0;
	border-bottom: 1px solid $u-border-color;
}
.al-r {
	text-align: right;
}
</style>
