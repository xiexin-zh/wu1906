<template>
	<view class="class-manage">
		<view class="class-fix">
			<view class="class-info u-fx-ver u-type-white">
				<view class="class-name u-fx-ac">
					<view class="border-img u-border-radius-all">
						<u-image :src="userInfo.photoUrl" width="88rpx" height="88rpx" border-radius="100%"></u-image>
					</view>
					<view class="u-fx-f1 u-mar-l30 u-letter-1">
						<view>{{ baseData.getClassName() }}</view>
						<view class="u-font-01 u-padd-t10">班级编号:{{ currentBindClass.classId }}</view>
					</view>
				</view>
				<view class="u-fx-f1 u-fx-ac u-font-01">
					<view class="u-fx-f1 u-fx-ac-jc">
						<text>{{ teacherTotal }}</text>
						<text class="u-padd-t10">老师人数</text>
					</view>
					<view class="u-fx-f1 u-fx-ac-jc">
						<text>{{ studentTotal }}</text>
						<text class="u-padd-t10">学生人数</text>
					</view>
					<view class="u-fx-f1 u-fx-ac-jc" @tap="_unbindClass">
						<u-image src="http://canpointtest.com/mini-img/unbind-icon.png" width="32rpx" height="32rpx"></u-image>
						<text class="u-padd-t10">解绑班级</text>
					</view>
					<view class="u-fx-f1 u-fx-ac-jc" @tap="_delClass" v-if="currentBindClass.isBzr">
						<u-image src="http://canpointtest.com/mini-img/delete-icon.png" width="32rpx" height="32rpx"></u-image>
						<text class="u-padd-t10">删除班级</text>
					</view>
				</view>
			</view>
			<view class="class-tab u-fx-ac u-type-white-bg u-bd-b">
				<view class="tab-w">
					<u-tabs :list="list" :is-scroll="false" font-size="28" :current="current" @change="change"></u-tabs>
				</view>
				<view v-if="current === 1" class="u-fx-f1 u-fx-je u-padd-l"  @tap="addUser('')">
					<view class="add-icon"></view>
				</view>
			</view>
		</view>
		<view class="u-type-white-bg">
			<no-data msg="暂无人员数据~" v-if="userList.length === 0"></no-data>
			<view @tap="addUser(user)" class="u-padd-20 u-bd-b u-fx-ac" v-for="user in userList" :key="user.id">
				<view class="u-mar-l20">
					<u-image width="60rpx" height="60rpx" border-radius="100%" :src="user.photoUrl || user.photoSrc"></u-image>
				</view>
				<view class="u-fx-f1 u-mar-l30 u-content-color">{{ user.userName || user.teacherName }}</view>
				<view class="rit-arrow"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import NoData from '../component/NoData.vue'
	import baseData from '@u/base-data'
	import eventBus from '@u/eventBus'
	import { store, actions } from '@store'
	export default {
		components: {
			NoData
		},
		computed: {
			currentBindClass: () => store.currentBindClass,
			userInfo: () => store.userInfo,
			teacherTotal: () => store.teacherTotal,
			studentTotal: () => store.studentTotal
		},
		data () {
			return {
				current: 0,
				baseData,
				userList: [],
				teacherList: [],
				list: [
					{
						name: `老师`
					},
					{
						name: `学生`
					}
				]
			}
		},
		mounted () {
			eventBus.$on('initClass', type => {
				if (type === 0) {
					this.getTeacherList()
				} else {
					this.getStudentList()
				}
			})
			this.getTeacherList()
		},
		methods: {
			change(index) {
				this.current = index
				if (index === 0) {
					this.getTeacherList()
				} else {
					this.getStudentList()
				}
			},
			getTeacherList () {
				this.baseData.getTeacherList(data => {
					this.teacherList = data
					this.userList = data
				})
			},
			getStudentList() {
				this.baseData.getStudentList(data => {
					this.userList = data
				})
			},
			addUser (item) {
				if (item) {
					uni.setStorageSync('classUserInfo', item)
				} else {
					uni.removeStorageSync('classUserInfo')
				}
				if (this.current === 0) {
					this.$tools.navTo({
						url: '/pages-basedata/class-manage/addTeacher'
					})
				} else {
					this.$tools.navTo({
						url: '/pages-basedata/class-manage/addStudent'
					})
				}
			},
			/**
			 * @description 解绑班级
			 */
			_unbindClass () {
				this.$tools.delTip('您确定解绑该班级吗?', async () => {
					if (this.currentBindClass.isBzr) {
						this.$tools.showLoading('解绑中...')
						await actions.setTeacherBzr({
							schoolCode: store.userInfo.schoolCode,
							schoolId: store.schoolYear.schoolId,
							id: store.currentBindClass.classId,
							teacherName: '',
							teacherId: '',
							placeId: '',
							schoolYearId: store.schoolYear.id
						})
					} else {
						const id = this.teacherList.find(item => item.teacherCode === this.userInfo.userCode).id
						this.$tools.showLoading('解绑中...')
						await actions.removeTeacher(id)
					}
					this.$tools.toast('解绑成功')
					this.$tools.goNext(() => {
						this.baseData.getClassList()
						this.$tools.goBack()
					})
				})
			},
			/**
			 * @description 删除班级
			 */
			_delClass () {
				this.$tools.delTip('您确定删除该班级吗?', async () => {
					this.$tools.showLoading('删除中...')
					await actions.deleteClass([store.currentBindClass.classId])
					this.$tools.toast('删除成功')
					this.$tools.goNext(() => {
						this.baseData.getClassList()
						this.$tools.goBack()
					})
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.class-manage {
		padding-top: 340rpx;
		.class-fix {
			height: 340rpx;
			width: 100%;
			position: fixed;
			z-index: 99;
			top: 0;
			left: 0;
		}
		.class-info {
			height: 260rpx;
			background-color: $u-type-primary;
		}
		.tab-w {
			width: 300rpx;
		}
		.add-icon {
			height: 50rpx;
			background: url(http://canpointtest.com/mini-img/add-student-icon.png) no-repeat center;
			background-size: 42rpx 42rpx;
			font-size: 24rpx;
			padding-left: 42rpx;
			margin-right: 20rpx;
		}
		.class-name {
			height: 140rpx;
			padding: 40rpx;
		}
	}
</style>
