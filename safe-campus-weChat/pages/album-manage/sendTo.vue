<template>
	<view class="u-page u-bg-fff">
		<u-popup v-model="showPopTag" mode="center" border-radius="14" width="90%" height="80%">
			<choose-classcard :type="type" :schoolCode="schoolInfo.schoolCode" :bindList="controlList" @close="showPopTag = false" @confirm="popselcet"></choose-classcard>
		</u-popup>
		<class-tree
			isCheck
			:isHighSchool="isHighSchool"
			v-show="classTag"
			:classTag="classTag"
			:schoolInfo="schoolInfo"
			@close="classTag = false"
			@confirm="classSelcet"
			:classChecked="classList"
		></class-tree>
		<teacher-tree
			isCheck
			v-show="teacherTag"
			:teacherTag="teacherTag"
			:schoolInfo="schoolInfo"
			@close="teacherTag = false"
			@confirm="teacherSelcet"
			:classChecked="teacherList"
		></teacher-tree>
		<dormcard-tree isCheck v-show="dormTag" :classTag="dormTag" :schoolInfo="schoolInfo" @close="dormTag = false" @confirm="dormSelcet" :classChecked="dormList"></dormcard-tree>
		<u-alert-tips class="u-mar-10" type="warning" title="提示：选择班级可以发送到该班级的家长"></u-alert-tips>
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">选择班级:</view>
				<view @click="classTag = true" class="u-fx-f1 u-fx-je u-content-color">{{ classTitle }}</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">选择教职工:</view>
				<view @click="teacherTag = true" class="u-fx-f1 u-fx-je u-content-color">{{ teacherTitle }}</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">选择教室班牌:</view>
				<view @click="showPopTag = true" class="u-fx-f1 u-fx-je u-content-color">{{ controlTitle }}</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">选择宿舍班牌:</view>
				<view @click="dormTag = true" class="u-fx-f1 u-fx-je u-content-color">{{ dormTitle }}</view>
				<view class="rit-icon"></view>
			</view>
		</scroll-view>
		<view class="submit-btn"><u-button type="primary" @click="submitForm">提交</u-button></view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import ChooseClassCard from '@/components/choose-classcard/choose-classcard.vue';
import ClassTree from '@/components/class-tree/class-tree';
import TeacherTree from '@/components/teacher-tree/teacher-tree';
import { store, actions } from './store/index.js';
import dormcardTree from '@/components/dormcard-tree/dormcard-tree';
export default {
	components: {
		ChooseClassCard,
		ClassTree,
		dormcardTree,
		TeacherTree
	},
	data() {
		return {
			isHighSchool: false,
			classTag: false,
			teacherTag: false,
			dormTag: false,
			showPopTag: false,
			canClick: true,
			controlList: [],
			classList: [],
			teacherList: [],
			dormList: [],
			type: '', // 0新增 1查看 2编辑
			controlTitle: '请选择',
			classTitle: '请选择',
			dormTitle: '请选择',
			teacherTitle: '请选择',
			schoolInfo: {
				schoolYearId: 0,
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
		this.isHighSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9';
		this.schoolInfo.schoolCode = store.userInfo.schoolCode;
		this.schoolInfo.schoolYearId = store.schoolYear ? store.schoolYear.schoolYearId : '';
		this.id = this.$tools.getQuery().get('id');
		if (this.id) {
			this.showData();
		}
	},
	methods: {
		// 表单回填
		async showData() {
			const res = await actions.getRelationData({
				schoolCode: store.userInfo.schoolCode,
				mediaCode: this.id
			});
			this.controlList = res.data.deviceList.filter(el => el.category === 1);
			this.teacherList = res.data.teacherList.map(el => {
				return {
					...el,
					userId: el.id
				};
			});
			this.classList = res.data.classList.map(el => {
				return {
					...el,
					userId: el.id
				};
			});
			this.dormList = res.data.deviceList.filter(el => el.category === 2);
			this.controlTitle = `已选择${this.controlList.length}个教室班牌`;
			this.dormTitle = `已选择${this.dormList.length}个宿舍班牌`;
			this.classTitle = `已选择${this.classList.length}个班级`;
			this.teacherTitle = `已选择${this.teacherList.length}个教职工`;
		},
		classSelcet(value) {
			this.classList = value;
			this.classTitle = `已选择${this.classList.length}个班`;
			this.classTag = false;
		},
		teacherSelcet(value) {
			this.teacherList = value;
			this.teacherTitle = `已选择${this.teacherList.length}个教职工`;
			this.teacherTag = false;
		},
		dormSelcet(value) {
			this.dormList = value;
			this.dormTitle = `已选择${this.dormList.length}个宿舍班牌`;
			this.dormTag = false;
		},
		popselcet(data) {
			this.controlList = data;
			this.controlTitle = `已选择${data.length}个教室班牌`;
			this.showPopTag = false;
		},
		submitForm() {
			if (!this.canClick) {
				return;
			}
			if (this.classList.length === 0 && this.teacherList.length === 0 && this.controlList.length === 0 && this.dormList.length === 0) {
				this.$tools.toast('请选择发布对象');
				return;
			}
			this.canClick = false;
			const deviceList = [];
			this.controlList.forEach(ele => {
				deviceList.push({
					...ele,
					category: 1,
					id: undefined
				});
			});
			this.dormList.forEach(ele => {
				deviceList.push({
					...ele,
					category: 2,
					id: undefined
				});
			});
			const req = {
				classList: this.classList.map(el => {
					return {
						classCode: el.classCode,
						className: el.className,
						schoolCode: store.userInfo.schoolCode,
						schoolYearId: store.schoolYear.schoolYearId,
						gradeCode: el.gradeCode,
						gradeName: el.gradeName,
						subjectCode: el.subjectCode,
						subjectName: el.subjectName,
						mediaCode: this.id,
						id: el.userId || undefined
					};
				}),
				teacherList: this.teacherList.map(el => {
					return {
						userCode: el.userCode,
						userName: el.userName,
						schoolCode: store.userInfo.schoolCode,
						mediaCode: this.id,
						id: el.userId || undefined
					};
				}),
				deviceList,
				mediaType: 1,
				mediaCode: this.id,
				schoolCode: store.userInfo.schoolCode
			};
			console.log(req);
			actions
				.addRelationData(req)
				.then(res => {
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
		}
	}
};
</script>

<style lang="scss">
.u-bg-fff {
	background-color: $uni-bg-color;
}
.scroll-h {
	height: calc(100vh - 210rpx);
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
