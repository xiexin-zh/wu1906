<template>
	<view class="mine">
		<u-popup z-index="99" v-model="isTeacher" mode="bottom" width="100%" height="500">
			<view class="u-padd-40">
				<view v-for="(item, index) in bindClassList" :key="item.userCode" class="u-fx-ac teacher-item">
					<view class="u-border-radius-all u-of">
						<u-image border-radius="100%" width="100rpx" height="100rpx" :src="userInfo.photoUrl"></u-image>
					</view>
					<view class="u-fx-f1 u-mar-l30">
						<view class="u-bold u-font-2">{{item.gradeName}}{{ item.className }}</view>
						<view class="u-content-color u-mar-t10">
							{{ item.isBzr ? '班主任' : '任课老师' }}
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup z-index="99" v-model="isChild" mode="bottom" width="100%" height="500">
			<child-list @close="isChild = false"></child-list>
		</u-popup>
		<u-popup v-model="isAdd" mode="bottom" width="100%" height="100%">
			<create-class v-if="classType === 1" @close="isAdd = false"></create-class>
			<join-class v-if="classType === 2" @close="isAdd = false"></join-class>
		</u-popup>
		<u-popup v-model="isShow" mode="bottom" height="500">
			<view class="u-main-color">
				<view class="u-padd-30 u-tx-c u-font-2 u-bold u-type-primary">当前角色：{{ currentUserType === '16' ? '家长' : '教职工'}}</view>
				<view class="dialog-type u-fx-ac u-fx-jsa">
					<view @tap="changeRole('4', '教职工')" :class="['type-box u-fx-ac-jc', {'act':  currentUserType === '4'}]">
						<u-image width="100rpx" height="100rpx" src="http://canpointtest.com/mini-img/laoshi-icon.png"></u-image>
						<view class="u-mar-t u-bold">教职工</view>
					</view>
					<view @tap="changeRole('16', '家长')" :class="['type-box u-fx-ac-jc', {'act':  currentUserType === '16'}]">
						<u-image width="100rpx" height="100rpx" src="http://canpointtest.com/mini-img/jiazhang-icon.png"></u-image>
						<view class="u-mar-t u-bold">家长</view>
					</view>
				</view>
			</view>
		</u-popup>
		<view class="person-info">
			<view class="u-fx-ac u-padd-t40">
				<view class="user-icon-bor" @tap="chooseAvatar">
					<u-image width="140rpx" height="140rpx" border-radius="100%" :src="avatar"></u-image>
				</view>
				<view class="u-fx-f1 u-mar-l30">
					<view class="u-font-1 u-fx-jsb u-fx-ac">
						<view>{{ userInfo.userName }}</view>
						<view @tap="changeType" v-if="isShowType" class="role-type">角色切换</view>
					</view>
					<view class="u-padd-t10 u-padd-b10">
						<text>{{ baseData.getClassName() }}</text>
						<text class="u-padd-l">{{ getUserType()}}</text>
					</view>
					<view class="u-fx-ac u-font-01" v-if="currentUserType === '4'" @tap="isTeacher =  true">
						<text class="u-padd-r10">已加入{{bindClassList.length || 0}}个班级</text>
						<u-image src="http://canpointtest.com/mini-img/eye-icon.png" width="28rpx" height="28rpx"></u-image>
					</view>
					<view class="u-fx-ac u-font-01" v-if="currentUserType === '16'">
						<text>(已绑定{{bindStudentList.length || 0}}个孩子)</text>
					</view>
				</view>
			</view>
			<view class="mine-scroll u-fx-ac">
				<view class="u-fx-f1 u-fx-ac" v-if="currentUserType === '4'">
					<view class="u-fx-f1 u-bd-r u-padd-l40 create-class-icon" @tap="classManage(1)">
						<view class="u-content-color">创建班级</view>
						<view class="u-tips-color u-font-01 u-mar-t10">默认为班主任</view>
					</view>
					<view class="u-fx-f1 u-padd-l40 add-class-icon" @tap="classManage(2)">
						<view class="u-content-color">加入班级</view>
						<view class="u-tips-color u-font-01 u-mar-t10">已存在的班级</view>
					</view>
				</view>
				<view class="u-fx-f1 u-fx-ac" v-if="currentUserType === '16'">
					<view class="u-fx-f1 u-bd-r u-padd-l40 bind-student-icon" @tap="showChild">
						<view class="u-content-color">孩子管理</view>
						<view class="u-tips-color u-font-01 u-mar-t10">查看和解绑孩子</view>
					</view>
					<view class="u-fx-f1 u-padd-l40 add-class-icon" @tap="bindChild">
						<view class="u-content-color">加入班级</view>
						<view class="u-tips-color u-font-01 u-mar-t10">绑定孩子即可加人</view>
					</view>
				</view>
			</view>
		</view>
		<menu-list></menu-list>
	</view>
</template>

<script>
import ChildList from './component/ChildList.vue'
import CreateClass from './component/CreateClass.vue'
import JoinClass from './component/JoinClass.vue'
import MenuList from './component/MenuList.vue'
import baseData from '@u/base-data'
import { store, setStore } from '@store' 
export default {
	computed: {
		userType: () => store.userType,
		userInfo: () => store.userInfo,
		currentUserType: () => store.currentUserType,
		currentBindClass: () => store.currentBindClass,
		bindClassList: () => store.bindClassList,
		bindStudentList: () => store.bindStudentList
	},
	components: {
		MenuList,
		JoinClass,
		CreateClass,
		ChildList
	},
	data() {
		return {
			avatar: '',
			baseData,
			isShowType: false,
			isShow: false,
			isAdd: false,
			classType: 0,
			isChild: false,
			isTeacher: false
		}
	},
	mounted () {
		this.isShowType = this.userType.indexOf('4') > -1
		this.avatar = this.userInfo.photoUrl
	},
	methods: {
		bindChild () {
			this.$tools.navTo({
				url: '/pages-basedata/mine/bindChild'
			})
		},
		showChild () {
			this.isChild = true
		},
		changeType () {
			this.isShow = true
		},
		/**
		 * 切换角色
		 */
		changeRole (type, name) {
			// 如果是教职工而没有家长身份，直接提示用户需要先注册绑定
			if (type === '16' && this.userType.indexOf('16') === -1) {
				this.isShow = false
				this.$tools.confirm('您还不是家长，请先绑定孩子成为家长', () => {
					this.$tools.navTo({
						url: '/pages-basedata/mine/bindChild'
					})
				})
				return
			}
			this.$tools.showLoading('身份切换中...')
			this.baseData.changeUserType(type, name, () => {
				this.$tools.toast('切换成功')
				this.isShow = false
				this.baseData.getUserInfo(() => {})
				if (type === '4') {
					this.baseData.getClassList((data) => {
						this.isShow = false
						if (data.length === 0) {
							this.$tools.confirm('您尚未加入某个班级，请联系管理员加入', () => {
							},false)
						}
						
					})
				} else  {
					this.baseData.getChildList((data) => {
						this.isShow = false
						if (data.length === 0) {
							this.$tools.confirm('您还没有绑定孩子，请前往绑定', () => {
								this.$tools.navTo({
									url: '/pages-basedata/mine/bindChild'
								})
							})
						}
					})
				}
			})
		},
		// 获取当前用户身份
		getUserType () {
			if (this.currentUserType === '16') {
				return '家长'
			} else {
				if (this.currentBindClass.isBzr) {
					return '班主任'
				} else {
					return '教职工'
				}
			}
		},
		// 创建和加入班级
		classManage (type) {
			this.isAdd = true
			this.classType = type
		},
		// 查看头像
		chooseAvatar () {
			uni.previewImage({
					urls: [this.userInfo.photoUrl],
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.teacher-item {
	border-radius: $u-border-radius;
	margin-bottom: 30rpx;
	border: 2px $u-type-primary solid;
	padding: 30rpx;
}
.person-info {
	padding: 0 40rpx;
	height: 350rpx;
	position: relative;
	background-color: #7691fa;
	color: #fff;
	.user-icon-bor {
		border: 2px #fff solid;
		background-color: $u-bg-color;
		border-radius: 100%;
	}
	.role-type {
		background: url(http://canpointtest.com/mini-img/role-icon.png) no-repeat;
		background-size: 32rpx 32rpx;
		font-size: 24rpx;
		padding-left: 40rpx;
		color:#eee
	}
	.mine-scroll {
		position: absolute;
		z-index: 9;
		width: 90%;
		left: 5%;
		bottom: -60rpx;
		height: 170rpx;
		border-radius: $u-border-radius;
		background-color: #fff;
		box-shadow: 0px 2px 2px #f5f5f5;
	}
	.create-class-icon {
		background: url(http://canpointtest.com/mini-img/create-class-icon.png) no-repeat 90% center;
		background-size: 64rpx 64rpx;
	}
	.bind-student-icon {
		background: url(http://canpointtest.com/mini-img/bind-student-icon.png) no-repeat 90% center;
		background-size: 64rpx 64rpx;
	}
	.add-class-icon {
		background: url(http://canpointtest.com/mini-img/add-class-icon.png) no-repeat 90% center;
		background-size: 64rpx 64rpx;
	}
}
.dialog-type {
	height: 350rpx;
}
.type-box {
	width: 200rpx;
	height: 200rpx;
	color: $u-tips-color;
	border: 4px $u-bg-color solid;
	border-radius: $u-border-radius-middle;
	&.act {
		border-color: $u-type-primary;
		color: $u-type-primary;
	}
}
</style>
