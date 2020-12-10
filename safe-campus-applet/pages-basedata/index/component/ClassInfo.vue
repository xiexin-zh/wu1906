<template>
	<view class="class-info u-fx-ver">
		<u-popup v-model="isShow" mode="bottom" height="200">
			<view class="u-fx-jsa u-padd-t10" v-if="currentUserType === '4'">
				<view v-if="bindClassList.length === 0">
						您当前身份是教职工，暂无加入任何班级，您可在个人空间创建和加入班级~
				</view>
				<view @tap="changeBind(item, '4')" :class="['bind-class u-fx-ac-jc', {'act': currentBindClass.classCode === item.classCode}]" v-for="(item, index) in bindClassList" :key="item.classCode">
					<view class="u-of">
						<u-image border-radius="100" width="80rpx" height="80rpx" :src="userInfo.photoUrl"></u-image>
					</view>
					<view class="u-font-01 u-padd-t10">{{item.gradeName}}{{ item.className }}</view>
					<view class="u-font-02">{{ item.isBzr ? '班主任' : '任课老师'}}</view>
				</view>
			</view>
			<view class="u-fx-jsa u-padd-t10" v-if="currentUserType === '16'">
				<view v-if="bindStudentList.length === 0">
						您暂未绑定孩子, 你可在个人空间进行绑定~
				</view>
				<view @tap="changeBind(item, '16')" :class="['bind-class u-fx-ac-jc', {'act': currentBindStudent.userCode === item.userCode}]" v-for="(item, index) in bindStudentList" :key="item.userCode">
					<view class="u-of">
						<u-image border-radius="100" width="80rpx" height="80rpx" :src="item.photoUrl"></u-image>
					</view>
					<view class="u-font-01 u-padd-t10">{{item.gradeName}}{{ item.className }}</view>
					<view class="u-font-02">{{ item.userName }}</view>
				</view>
			</view>
		</u-popup>
		<view class="school-info u-fx-ae u-fx-jsb">
			<view class="u-bold">
				{{ userInfo.schoolName}}
			</view>
			<view>{{ dateTime.substr(0, 10).replace(/-/g, '.') }}</view>
		</view>
		<view class="u-fx-ac u-fx-f1">
			<view class="user-img u-fx-ac-jc">
				<u-image v-if="currentUserType === '4'" width="120rpx" height="130rpx" :src="userInfo.photoUrl"></u-image>
				<u-image v-if="currentUserType === '16'"  width="120rpx" height="130rpx" :src="currentBindStudent.photoUrl"></u-image>
				<view v-if="currentUserType === '16'" class="name-tip">{{ currentBindStudent.userName }}</view>
			</view>
			<view class="u-fx-f1">
				<view class="u-fx-ac u-bold">
				{{ baseData.getClassName() }}
					<view class="change-class u-mar-l30" @tap="changeClass">切换{{ currentUserType === '4' ? '班级' : '孩子'}}</view>
				</view>
				<view class="u-fx-ac u-mar-t40 u-font-01">
					<text>老师{{ teacherTotal }}人</text>
					<text class="u-padd-l">学生{{ studentTotal }}人</text>
					<view class="yq-btn u-mar-l u-font-01" v-if="false" @tap="yaoqing">邀请老师/家长</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import baseData from '@u/base-data'
	import eventBus from '@u/eventBus'
	import { store, setStore } from '@store'
	export default {
		data() {
			return {
				baseData,
				isShow: false,
				dateTime: this.$tools.getDateTime(),
			}
		},
		computed: {
			userInfo: () => store.userInfo,
			teacherTotal: () => store.teacherTotal,
			studentTotal: () => store.studentTotal,
			currentBindStudent: () => store.currentBindStudent,
			currentBindClass: () => store.currentBindClass,
			bindClassList: () => store.bindClassList,
			bindStudentList: () => store.bindStudentList,
			currentUserType: () => store.currentUserType
		},
		mounted () {
		},
		methods: {
			changeClass () {
				this.isShow = true
			},
			/**
			 * @description 切换绑定的班级和学生
			 */
			changeBind (item, type) {
				if (type === '4') {
					setStore({
						currentBindClass: item
					})
				} else {
					setStore({
						currentBindStudent: item
					})
				}
				this.baseData.getClassUserTotal()
				this.$tools.toast('切换成功')
				eventBus.$emit('initClassSpace')
				this.isShow = false
			},
			yaoqing () {
				this.$tools.navTo({
					url: '/pages-basedata/common/invitation',
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.class-info {
		letter-spacing: 2rpx;
		padding: 0 $u-mp-30;
		height: 280rpx;
		background-color: #7691fa;
		color:#fff;
		.school-info {
			height: 50rpx;
		}
		.user-img {
			width: 160rpx;
			height: 160rpx;
			position: relative;
			margin-right: 30rpx;
			border-radius: $u-border-radius-middle;
			overflow: hidden;
			background: url(http://canpointtest.com/mini-img/auto-user-border.png) no-repeat;
			background-size: 160rpx 160rpx;
		}
		.name-tip {
			position: absolute;
			height: 40rpx;
			line-height: 40rpx;
			width: 140rpx;
			bottom: 0rpx;
			left: 10rpx;
			text-align: center;
			color: $u-content-color;
			background: rgba(255,255,255,.5);
			font-size: 24rpx;
		}
		.yq-btn {
			height: 54rpx;
			line-height: 54rpx;
			padding: 0 12rpx;
			border-radius: 100rpx;
			background-color: #fff;
			color:#879ce8;
		}
		.bind-child-btn {
			width: 200rpx;
			height: 60rpx;
			border-radius: 40rpx;
			line-height: 60rpx;
			text-align: center;
			font-size: 24rpx;
			background-color: $u-type-primary-dark;
			color:#fff;
			margin: 20rpx auto;
		}
	}
</style>
