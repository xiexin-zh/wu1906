<template>
	<view class="u-type-white-bg">
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="">
				<view class="u-fx-ac u-bd-b item-list">
					<view class="tip">申请人：</view>
					<view class="u-fx-f1 u-fx-je u-content-color mar-r20" v-if="childId" >{{theChild.userName}}</view>
					<view class="u-fx-f1 u-fx-je u-content-color mar-r20" v-else @click="changeChild">{{theChild.userName}}</view>
				<view class="rit-icon" v-if="childList.length > 1 && !id"></view>
				</view>
				<view class="u-fx u-bd-b item-list">
					<view class="tip">申请原因：</view>
					<view class="u-fx-f1 u-tx-r"><textarea :maxlength='200' v-model="formData.reason" class="item-input u-content-color" placeholder="请输入描述" /></view>
				</view>
				<view class="u-bd-b item-list">
					<view class="tip">审批人</view>
					<view class="u-mar-t u-inline-block">
						<image class="u-user-img u-border-radius-all" :src="teacherInfo.photoUrl || '/mobile-img/auto-teacher.png'"></image>
					  <div class="u-mar-t10 u-tx-c u-content-color">{{teacherInfo.userName}}</div>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="footer-btn u-fx-ac u-bg-color">
		  <u-button
		    type="primary"
				 @click="submitForm"
		    class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
		  >
		    提交
		  </u-button>
		</view>
	</view>
</template>

<script>
import chooseChild from '@/components/choose-child/choose-child.vue';
import eventBus from '@u/eventBus';
import validateForm from '@u/validate';
import { store, actions } from '../store/index.js';
const yzForm = {
	reason : '请输入申请原因',
};
export default {
	components: {
		chooseChild
	},
	data() {
		return {
			childId:'',
			commitFlag:'',
			childList: JSON.parse(uni.getStorageSync('protal')).childList,
			//当前孩子
			theChild:store.childList[0],
			//当前班主任
			teacherInfo:{},
			formData: {
				id: this.$tools.getQuery().get('id')||'',
				parentCode: store.userInfo.userCode,
				parentName: store.userInfo.userName,
				reason: "",
				approverCode: 'string',
				approverName: 'string',
				isSign: false,
				schoolCode: store.userInfo.schoolCode,
				schoolName: store.userInfo.schoolName,
				status: ''
			},
			schoolInfo: {
				schoolYearId: 0,
				schoolCode: ''
			},
			id: ''
		};
	},
	created() {
		this.id = this.$tools.getQuery().get('id') || ''
		if(this.id){
			this.childId  = this.id
			this.getDetail(this.id) //找到详情有code才能找老师
		}else{
			this.theChild = store.childList[0]
			this.getTeacher(this.theChild)
		}
	},
		methods: {
		changeChild () {
			if(this.childList.length <= 1 || this.childId){
				return false
			}
					const arr = this.childList.map(item => {
						return item.userName
					})
					this.$tools.actionsheet(arr, (index) => {
						this.index = index
						if (this.childList[index].userCode !== this.theChild.userCode) {
							 this.theChild = this.childList[index]
						   this.getTeacher(this.theChild)
					}
			})
		},
		// childInfo(item) {
		// 	if (item.userCode !== this.theChild.userCode) {
		// 		this.theChild = item
		// 	}
		// },
		async getDetail(id) {
			const res = await actions.ApplicationDetail({id:id});
			this.formData = res.data||[]
			this.childList.map(el=>{
				if(el.userName === res.data.applicantName){
					this.theChild = el
				}
			})
			// this.theChild.userCode = res.data.applicationCode
			// this.theChild.schoolCode =res.data.schoolCode
			// this.theChild.userName =res.data.applicantName
			this.getTeacher(this.theChild)
		},
		async getTeacher(record) {
			let req = {
				userCode: record.userCode,
				schoolYearId: store.schoolYear.schoolYearId,
				schoolCode: record.schoolCode
			}
			const res = await actions.getTeacher(req);
			this.teacherInfo = res.data || {}
			if (JSON.stringify(res.data)=='{}') {
				this.$tools.toast('暂无班主任，请联系学校管理员设置')
				return false
			}
		},
		//提交
		submitForm() {
			if(JSON.stringify(this.teacherInfo)=='{}'){
				this.$tools.toast('暂无班主任，请联系学校管理员设置')
				return false
			}
			validateForm(yzForm, this.formData, () => {
						this.formData.approverCode = this.teacherInfo.userCode
			      this.formData.approverName = this.teacherInfo.userName
			      this.formData.approverPhoto = this.teacherInfo.photoUrl
						this.formData.schoolCode = this.theChild.schoolCode
						this.formData.schoolName = this.theChild.schoolName
						this.formData.applicantName = this.theChild.userName
						this.formData.applicantCode = this.theChild.userCode
						if (this.formData.id) {
							actions.updateApplication(this.formData).then(res => {
								this.$tools.toast('修改成功', 'success');
								this.$tools.goNext(() => {
									eventBus.$emit('getList');
									this.$tools.goBack();
								});
							});
						} else {
							actions.addApplication(this.formData).then(res => {
								this.$tools.toast('申请成功', 'success');
								this.$tools.goNext(() => {
									eventBus.$emit('getList');
									this.$tools.goBack();
								});
							});
						}
			});
		},
		goBack() {
			eventBus.$emit('getList');
			this.$tools.goBack();
		},
	
	},
	watch: {
			//修改孩子查老师
		// 	theChild: {
		// 	handler(newValue, oldValue) {
		// 		console.log(newValue)
		// 		this.getTeacher()
		// 	},
		// 	deep: true
		// },
	},
	

};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 100rpx);
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
</style>