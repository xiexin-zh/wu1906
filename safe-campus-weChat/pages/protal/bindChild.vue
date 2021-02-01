<template>
	<scroll-view scroll-y="true" class="scroll-h u-bg-fff">
		<view class="u-fx-ac u-bd-b u-fx-jsb item-list">
			<view>学校：</view>
			<view class="u-tx-r u-content-color">{{ schoolName }}</view>
		</view>
		<!-- <view class="u-fx-ac u-bd-b item-list">
			<view>年级：</view>
			<picker class="u-fx-f1 u-tx-r col-666" mode="selector" :value="gradeName" :range="gradeList" @change="chooseGrade">{{ gradeName }}</picker>
			<view class="rit-icon"></view>
		</view>
		<view class="u-fx-ac u-bd-b item-list">
			<view>班级：</view>
			<picker class="u-fx-f1 u-tx-r col-666" mode="selector" :value="className" :range="classList" @change="chooseClass">{{ className }}</picker>
			<view class="rit-icon"></view>
		</view> -->
		<view class="u-fx-ac u-bd-b item-list">
			<view>孩子姓名：</view>
			<view class="u-fx-f1"><input class="item-input" v-model="formData.userName" placeholder="请输入姓名" /></view>
		</view>
		<view class="u-fx-ac u-bd-b item-list">
			<view>孩子学号：</view>
			<view class="u-fx-f1 u-fx-je"><input class="item-input" v-model="formData.workNo" placeholder="请输入学号" /></view>
		</view>
		<view class="u-fx-ac u-bd-b item-list">
			<view>亲属关系：</view>
			<picker class="u-fx-f1 u-tx-r col-666" mode="selector" :value="relationShip" :range="relationShipList" @change="chooseRelation">{{ relationShip }}</picker>
			<view class="rit-icon"></view>
		</view>
		<view class="bind-mar">
			<u-button type="primary" @click="bindChild">绑定</u-button>
		</view>
	</scroll-view>
</template>

<script>
import { store, setStore, actions } from './store/index.js'
import eventBus from '@u/eventBus'
export default {
	data() {
		return {
			schoolName: '请选择学校',
			gradeList: [],
			gradeName: '请选择班级',
			classList: [],
			className: '请选择年级',
			relationShip: '请选择关系',
			formInfo: {},
			formData: {
				userName: '',
				workNo: '',
				parentName: '',
				mobile: '',
				schoolCode: '',
				/* gradeCode: '',
				classCode: '', */
				relationShip: ''
			}
		}
	},
	components: {},
	computed: {
		userInfo: () => store.userInfo,
		schoolYear: () => store.schoolYear,
		enjoyParentApp: () => store.enjoyParentApp,
		relationShipList: () => store.relationShipList.map(item => item.relationShip)
	},
	mounted() {
		this.type = this.$tools.getQuery().get('type')
		this.formData.schoolCode = this.userInfo.schoolCode
		this.formData.parentName = this.userInfo.userName
		this.formData.mobile = this.userInfo.mobile
		this.schoolName = this.userInfo.schoolName
		this.formData.relationShip =  this.userInfo.relationShip || 1
		this.getGradeList()
	},
	methods: {
		// 选择关系
		chooseRelation (item) {
			const index = item.target.value
			this.relationShip = this.relationShipList[index]
			this.formData.relationShip = index + 1
		},
		// 获取年级
		async getGradeList () {
			const res = await actions.getGradeList({
				schoolCode: this.formData.schoolCode,
				page: 1,
				size: 100
			})
			this.gradeTotal = res.data.list
			this.gradeList = res.data.list.map(item => {
				return item.name
			})
		},
		// 选择年级
		async chooseGrade (item) {
			const index = item.target.value
			this.gradeName = this.gradeList[index]
			this.formData.gradeCode = this.gradeTotal[index].code
			const res = await actions.getClassList({
				schoolCode: this.formData.schoolCode,
				page: 1,
				size: 100,
				gradeCode: this.formData.gradeCode,
				schoolYearId: this.schoolYear.schoolYearId
			})
			this.classTotal = res.data.list
			this.classList = res.data.list.map(item => {
				return item.className
			})
		},
		// 选择班级
		chooseClass (item) {
			const index = item.target.value
			this.className = this.classList[index]
			this.formData.classCode = this.classTotal[index].classCode
		},
		// 绑定孩子
		async bindChild () {
			for (let key in this.formData) {
				if (!this.formData[key]) {
					this.$tools.toast('请填写完整信息')
					return
				}
			}
			if (this.type == 0) {
				await actions.addBindChild({
					...this.formData,
					openid: this.userInfo.openid
				})
			} else {
				await actions.bindChild({
					...this.formData,
					openid: this.userInfo.openid
				})
			}
			this.$tools.toast('绑定成功', 1)
			if (this.userInfo.typeCode == 4) {
				this.$tools.goNext(() => {
					this.addLog('16', '家长')
				})
			} else {
				this.$tools.goNext(() => {
					eventBus.$emit('getChild')
					this.$tools.goBack()
				})
			}
		},
		// 添加登录日志
		async addLog (typeCode, typeName) {
			const { openid, schoolCode, schoolName, userCode, userName } = this.userInfo
			await actions.addLog({
				id: this.userInfo.userId,
				openid,
				schoolCode,
				schoolName,
				typeCode,
				typeName,
				userCode,
				userName
			})
			setStore({
				key: 'userInfo',
				data: {
					...this.userInfo,
					typeCode,
					typeName
				}
			})
			setStore({
				key: 'enjoyApp',
				data: this.enjoyParentApp
			})
			eventBus.$emit('getChild')
			setTimeout(() => {
				this.$tools.goBack()
			})
		},
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: 100vh;
}
.bind-mar {
	margin: 50rpx 20rpx;
}
.item-list {
	padding: 28rpx 15rpx;
}
.item-input {
	width: 100%;
	font-size: 26rpx;
	color: $u-content-color;
	text-align: right;
}
.col-666 {
	color: #999;
}
.radio {
	padding-left: 25rpx;
}
.checkbox {
	padding: 30rpx 10px 10px 2px;
}
.yzm-btn {
	background-color: $u-type-primary;
	height: 60rpx;
	line-height: 60rpx;
	width: 180rpx;
	color: #fff;
	margin-left: 30rpx;
	text-align: center;
	border-radius: 4rpx;
}
.submit-box {
	margin: 50rpx 20rpx;
	text-align: center;
	padding: 0 20rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	letter-spacing: 8rpx;
	background-color: $u-type-primary;
	color: #fff;
	border-radius: $u-border-radius;
}
.go-login {
	text-align: center;
	color: #666;
	padding-bottom: 40rpx;
	letter-spacing: 2rpx;
	.act {
		padding-left: 6rpx;
		color: $u-type-primary;
	}
}
</style>
