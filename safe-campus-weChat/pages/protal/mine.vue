<template>
	<view class="mine u-padd-b">
		<view class="person-bg u-fx-jsb" style="background: url(/mobile-img/person-bg-one.png) no-repeat; backgroundSize: 100% 100%">
			<text>{{ userInfo.schoolName }}</text>
			<text>{{ date }}</text>
		</view>
		<view class="person-info">
			<view class="info u-fx-ac-jc" style="background: url('/mobile-img/person-bg-two.png') no-repeat; backgroundSize: contain">
				<view><image class="person-icon" :src="userInfo.photoUrl || '/mobile-img/person-auto.png'" alt="" /></view>
				<view class="u-fx-ac">
					<text>{{ userInfo.userName }}</text>
					<text class="tip"></text>
					<text>{{ getTypeName(userInfo.typeCode) }}</text>
				</view>
			</view>
		</view>
		<view class="person-item">
			<view class="item u-fx-jsb u-bd-b u-fx-ac" @tap="changePhone">
				<text class="u-content-color">手机号</text>
				<text class="u-fx-f1 u-tx-r u-tips-color">{{ userInfo.mobile }}</text>
				<view class="rit-icon"></view>
			</view>
		</view>
		<view class="person-item">
			<view class="item u-fx-jsb u-bd-b u-fx-ac">
				<text class="u-content-color">我的身份</text>
				<text class="u-fx-f1 u-tx-r u-tips-color" @click="changeType">{{ getTypeName(userInfo.typeCode) }}</text>
				<view class="rit-icon"></view>
			</view>
			<view class="item u-fx-jsb u-fx-ac u-bd-b">
				<text class="u-content-color">当前绑定</text>
				<text @tap="changeClass" v-if="userInfo.typeCode == 4 && classInfo.gradeName" class="u-fx-f1 u-tx-r u-tips-color">
					{{ classInfo.gradeName }}{{ userInfo.schoolType === '8' || userInfo.schoolType === '9' ? classInfo.professionName + classInfo.className : classInfo.className }}
				</text>
				<text @tap="changeClass" v-if="userInfo.typeCode == 4 && !classInfo.gradeName" class="u-fx-f1 u-tx-r u-tips-color">暂未绑定</text>
				<view v-if="userInfo.typeCode == 16" @click="bindChild('1')" class="bind-child">绑定孩子</view>
				<view class="rit-icon" v-if="userInfo.typeCode == 4 && classList.length > 1"></view>
			</view>
			<view v-if="userInfo.typeCode == 4" class="item u-fx-jsb u-bd-b u-fx-ac" @click="changeIntroType">
				<text class="u-content-color">{{ introTitle }}</text>
				<view class="rit-icon"></view>
			</view>
		</view>
		<view v-if="userInfo.typeCode == 16">
			<view v-for="(child, index) in childList" :key="child.userCode" class="u-fx-ac u-mar u-border-radius u-padd child-list u-bd-b u-content-color u-bg-fff">
				<image class="img u-border-radius" :src="child.photoUrl" alt="" />
				<view class="u-fx-f1 u-line3 u-mar-l" @click="changeIntroType(index)">
					<view class="u-main-color">{{ child.userName }}</view>
					<view class="u-font-01" v-if="isHightSchool">{{ child.gradeName }}{{ child.subjectName }}{{ child.className }}</view>
					<view class="u-font-01" v-else>{{ child.gradeName }}{{ child.className }}</view>
					<view class="u-font-01">{{ child.workNo || '' }}</view>
				</view>
				<view class="rit-icon" @click="changeIntroType(index)"></view>
				<!-- <view class="unbind-btn u-fx-ac-jc" @tap="_unbind(child.userCode, index)">
					解绑
				</view> -->
			</view>
		</view>
		<view class="mine-btn" @tap="loginOut(true)">退出登录</view>
		<view class="mine-btn school" v-if="false">切换学校</view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import { store, setStore, actions } from './store/index.js';
import apiFun from './store/apiFun.js';
export default {
	data() {
		return {
			currentClass: uni.getStorageSync('currentClass') || 0,
			date: this.$tools.getDateTime().substr(0, 10),
			classInfo: {},
			classList: [],
			typeList: [],
			isHightSchool: false,
			isMap: false,
			introTitle: '个人简介',
			typeMenuList: []
		};
	},
	computed: {
		userInfo: () => store.userInfo,
		childList: () => store.childList,
		teachClassList: () => store.teachClassList,
		currentBindClass: () => store.currentBindClass,
		enjoyParentApp: () => store.enjoyParentApp,
		enjoyTeacherApp: () => store.enjoyTeacherApp
	},
	async mounted() {
		this.isHightSchool = this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9';
		eventBus.$on('getChild', () => {
			apiFun.getChildList();
			apiFun.getMenuList();
		});
		this.getTypeList();
		if (this.userInfo.typeCode == 4) {
			const currentInfo = this.teachClassList.findIndex(item => {
				return item.classId === this.currentBindClass.classId;
			});
			console.log(currentInfo);
			if (currentInfo > -1) {
				this.classInfo = this.currentBindClass;
				this.classList = this.teachClassList;
				return;
			}
			this.getClassInfo();
		} else {
			apiFun.getChildList();
		}
	},
	methods: {
		// 获取身份类型
		getTypeName(type) {
			if (type === '16') {
				return '家长';
			} else {
				if (this.classInfo.isBZR) {
					return this.isHightSchool ? '辅导员' : '班主任';
				} else {
					return '教职工';
				}
			}
		},
		changePhone() {
			this.$tools.navTo({
				url: './changePhone',
				title: '修改手机号'
			});
		},
		// 查询用户拥有的身份
		async getTypeList() {
			const res = await actions.getTypeList({
				schoolCode: this.userInfo.schoolCode,
				userCode: this.userInfo.userCode
			});
			this.typeList = res.data;
			// 初次进入身份为家长，并且获取身份类型只有家长
			if (this.userInfo.typeCode === '16' && this.typeList.length === 1) {
				this.typeMenuList = [];
			} else {
				this.typeMenuList = ['教职工', '家长'];
			}
		},
		// 切换班级
		changeClass() {
			if (this.classList.length > 1) {
				const arr = this.classList.map(item => {
					if (this.isHightSchool) {
						return item.gradeName + item.professionName + item.className;
					} else {
						return item.gradeName + item.className;
					}
				});
				this.$tools.actionsheet(arr, index => {
					this.currentClass = index;
					uni.setStorageSync('currentClass', index);
					this.classInfo = this.classList[index];
					console.log(this.classInfo);
					setStore({
						key: 'isBZR',
						data: this.classInfo.isBZR ? this.classInfo : null
					});
					setStore({
						key: 'currentBindClass',
						data: this.classInfo
					});
					this.$tools.toast('切换成功', 1);
				});
			}
		},
		// 切换身份
		changeType() {
			if (this.typeMenuList.length === 0) return;
			this.$tools.actionsheet(this.typeMenuList, index => {
				if (this.typeMenuList[index] === this.userInfo.typeName) return;
				if (index === 0) {
					// 切换教职工
					this.introTitle = '个人简介';
					this.addLog('4', '教职工');
				} else {
					this.introTitle = '学生简介';
					if (this.typeList.length === 1) {
						this.bindChild('0');
					} else {
						this.addLog('16', '家长');
					}
				}
			});
		},
		// 个人简介
		changeIntroType(index) {
			if (this.userInfo.typeCode === '16') {
				if (this.childList.length === 0) {
					this.$tools.toast('请先绑定孩子');
					return;
				}
				console.log(index);
				this.$tools.navTo({
					url: `./intro?type=0&index=${index}` // 0查看1编辑
				});
			} else {
				this.$tools.navTo({
					url: `./intro?type=0` // 0查看1编辑
				});
			}
			/* this.$tools.actionsheet(['查看', '编辑'], index => {
				this.$tools.navTo({
					url: `./intro?type=${index}` // 0查看1编辑
				})
			}); */
		},
		// 添加登录日志
		async addLog(typeCode, typeName) {
			const { schoolCode, schoolName, userCode, userName } = this.userInfo;
			await actions.addLog({
				id: this.userInfo.userId,
				openid: store.openid,
				schoolCode,
				schoolName,
				typeCode,
				typeName,
				userCode,
				userName
			});
			setStore({
				key: 'userInfo',
				data: {
					...this.userInfo,
					typeCode,
					typeName
				}
			});
			// 切换首页收藏应用
			if (typeCode == '4') {
				this.getClassInfo();
				setStore({
					key: 'enjoyApp',
					data: this.enjoyTeacherApp
				});
			} else {
				apiFun.getChildList();
				setStore({
					key: 'enjoyApp',
					data: this.enjoyParentApp
				});
			}
			apiFun.getMenuList();
		},
		// 绑定孩子
		bindChild(type) {
			this.$tools.navTo({
				title: '绑定孩子',
				url: `./bindChild?type=${type}`
			});
		},
		// 解绑孩子
		_unbind(childCode, index) {
			this.$tools.confirm('确定解绑吗?', async () => {
				await actions.unbindChild({
					childCode,
					parentCode: this.userInfo.userCode
				});
				this.childList.splice(index, 1);
				this.$tools.toast('解绑成功');
			});
		},
		// 获取绑定的班级信息
		async getClassInfo() {
			let res = null;
			if (this.isHightSchool) {
				res = await actions.getHighSchoolBZRInfo({
					schoolCode: this.userInfo.schoolCode,
					teacherCode: this.userInfo.userCode
				});
				if (!res.data || res.data.length === 0) {
					this.bzrList = [];
					setStore({
						key: 'isBZR',
						data: null
					});
				} else {
					this.bzrList = res.data.map(el => {
						return {
							...el,
							gradeCode: el.gradeName,
							gradeName: el.gradeName + '级',
							professionName: el.subjectName,
							professionCode: el.subjectCode
						};
					});
				}
			} else {
				res = await actions.getClassInfo({
					schoolCode: this.userInfo.schoolCode,
					userType: this.userInfo.typeCode,
					userCode: this.userInfo.userCode
				});
				if (!res.data.classInfos || res.data.classInfos.length === 0) {
					this.bzrList = [];
					setStore({
						key: 'isBZR',
						data: null
					});
				} else {
					this.bzrList = res.data.classInfos;
				}
			}
			// 获取当任课老师的班级
			const resTea = await actions.getClassTea({
				schoolCode: this.userInfo.schoolCode,
				userCode: this.userInfo.userCode
			});
			const arr = new Map();
			this.classList = [...resTea.data, ...this.bzrList].filter(list => !arr.has(list.classCode) && arr.set(list.classCode, list));
			this.classList = this.classList.map((el, index) => {
				return {
					...el,
					isBZR: this.bzrList.findIndex(list => list.classCode === el.classCode) !== -1,
					value: el.classCode,
					classId: el.id,
					text: el.gradeName + (el.professionName || el.subjectName || '') + el.className
				};
			});
			console.log(this.classList);
			setStore({
				key: 'teachClassList',
				data: this.classList
			});
			if (this.bzrList.length > 0) {
				if (parseInt(this.currentClass) > this.bzrList.length - 1) {
					this.classInfo = this.bzrList[0];
				} else {
					this.classInfo = this.bzrList[this.currentClass];
				}
				setStore({
					key: 'currentBindClass',
					data: this.classInfo
				});
				setStore({
					key: 'isBZR',
					data: this.classInfo.isBZR ? this.classInfo : null
				});
			}
		},
		// 退出登陆
		async loginOut(tag) {
			if (tag) {
				this.$tools.confirm('确定退出登录吗?', async () => {
					try {
						actions.loginOut(this.userInfo.userCode);
						this.$tools.redirectTo({
							url: './index'
						});
					} catch (err) {
						ths.$tools.toast('退出失败');
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.mine {
	.person-bg {
		height: 350rpx;
		color: #fff;
		padding: 30rpx;
	}
	.person-info {
		margin: -220rpx 30rpx 0 30rpx;
	}
	.person-icon {
		width: 150rpx;
		height: 150rpx;
		border: 4px $u-type-primary-light solid;
		border-radius: 100%;
		margin-bottom: 20rpx;
		background-color: $u-bg-color;
		display: block;
	}
	.info {
		height: 312rpx;
		overflow: hidden;
		border-radius: 10rpx;
		z-index: 99;
		color: $u-type-primary-dark;
		.tip {
			display: inline-block;
			border-radius: 100%;
			height: 8rpx;
			width: 8rpx;
			margin: 0 8rpx;
			background-color: $u-type-primary-dark;
		}
		img {
			border-radius: 50%;
			width: 120rpx;
			height: 120rpx;
			display: block;
			margin-bottom: 20rpx;
		}
	}
}
.person-item {
	margin-top: 20rpx;
	background-color: #fff;
	.item {
		padding: 30rpx 20rpx;
	}
}
.mine-btn {
	border-radius: $u-border-radius;
	margin: 30rpx 20rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	background-color: $u-type-white;
	color: $u-tips-color;
}
.bind-child {
	margin-left: 10rpx;
	background-color: $u-type-primary-dark;
	border-radius: $u-border-radius;
	padding: 8rpx 20rpx;
	color: #fff;
}
.child-list {
	.img {
		width: 140rpx;
		height: 160rpx;
		display: block;
		background-color: #eee;
	}
	.unbind-btn {
		width: 100rpx;
		height: 50rpx;
		background-color: $u-type-error-dark;
		color: $u-type-white;
		border-radius: 60rpx;
	}
}
</style>
