<template>
	<view class="u-bg-fff">
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="u-fx-ac u-bd-b item-list" @click="changeChild">
				<view class="tip">申请人：</view>
				<view class="u-fx-f1 u-fx-je u-content-color mar-r20">
					{{theChild.userName}}
				</view>
				<view class="rit-icon" v-if="childList.length > 1 && !id"></view>
			</view>
			<view class="u-fx u-bd-b item-list">
				<view class="tip">申请原因：</view>
				<view class="u-fx-f1 u-tx-r"><textarea v-model="formData.reason" class="item-input u-content-color" placeholder="请输入描述" /></view>
			</view>
			<view class="u-bd-b item-list">
				<view class="">审批人</view>
				<view class="u-mar-t u-inline-block">
					<image class="u-user-img u-border-radius-all" :src="this.teacherInfo.photoUrl || '/mobile-img/auto-teacher.png' " ></image>
					<div class="u-tx-c u-mar-t10 u-content-color">{{ this.teacherInfo.userName }}</div>
				</view>
			</view>
		</scroll-view>
		<view class="submit-btn"><u-button type="primary" @click="submitForm">提交</u-button></view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import validateForm from '@u/validate';
import { store, actions } from '../store/index.js';
const yzForm = {
	reason : '请输入描述',
};
export default {
	data() {
		return {
			theChild: store.childList[0],
			formData: {
				id: this.$tools.getQuery().get('id')||'',
				parentCode: store.userInfo.userCode,
				parentName: store.userInfo.userName,
				reason: ""
			},
			teacherInfo: {},
			childList: JSON.parse(uni.getStorageSync('protal')).childList,
			id: ''
		};
	},
	created() {
		this.id = this.$tools.getQuery().get('id') || ''
		if (!this.id) {
			this.teacherGet(this.theChild)
		} else {
			this.getDetail(this.id)
		}
	},
	methods: {
		changeChild () {
			if(this.childList.length <= 1 || this.id){
				return false
			}
			const arr = this.childList.map(item => {
				return item.userName
			})
			this.$tools.actionsheet(arr, (index) => {
				this.index = index
				if (this.childList[index].userCode !== this.theChild.userCode) {
				this.theChild = this.childList[index]
				this.teacherGet(this.theChild)
			}
			})
		},
		async getDetail(id) {
			const res = await actions.dormApplicationDetail({id:id});
			this.formData = res.data || []
		 	store.childList.map(el => {
				if(el.userName === res.data.applicantName){
					this.theChild = el
				}
			})
			this.teacherGet(this.theChild)
		},
		async teacherGet(record) {
			const req = {
				userCode: record.userCode,
				schoolYearId: store.schoolYear.schoolYearId,
				schoolCode: record.schoolCode
			}
			const res = await actions.getTeacher(req)
			this.teacherInfo = res.data
			if (!res.data) {
				this.teacherInfo = {}
				this.$tools.toast('暂无班主任，请联系学校管理员设置')
				return false
			}
		},
		//提交
		submitForm() {
			if(!this.teacherInfo || JSON.stringify(this.teacherInfo) == "{}"){
				this.$tools.toast('暂无班主任，请联系学校管理员设置')
				return false
			}
			if (this.formData.reason==='') {
				this.$tools.toast('描述不能为空');
				return false
			}
			this.formData.approverCode = this.teacherInfo.userCode
			this.formData.approverName = this.teacherInfo.userName
			this.formData.approverPhoto = this.teacherInfo.photoUrl
			this.formData.schoolCode = this.theChild.schoolCode
			this.formData.schoolName = this.theChild.schoolName
			this.formData.applicantName = this.theChild.userName
			validateForm(yzForm, this.formData, () => {
			if (this.formData.id) {
				actions.updateDormApplication(this.formData).then(res => {
						this.$tools.toast('修改成功');
						this.$tools.goNext(() => {
							eventBus.$emit('getList');
							this.$tools.goBack();
						})
					})
			} else {
				actions.addDormApplication(this.formData).then(res => {
					this.$tools.toast('申请成功')
					this.$tools.goNext(() => {
						eventBus.$emit('getList','ok')
						this.$tools.goBack()
					})
				})
				}
			})
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
image {
	width: 160rpx;
	height: 160rpx;
}
</style>
