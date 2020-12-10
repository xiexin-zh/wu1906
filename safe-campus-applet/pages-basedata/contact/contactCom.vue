<template>
	<view class="contact">
		<view class="title">老师{{teacherList.length}}人</view>
		<no-data v-if="teacherList.length === 0" msg="暂无班级老师~"></no-data>
		<view class="user-list u-fx-ac" v-for="teacher in teacherList" :key="teacher.id">
			<view>
				<u-image width="60rpx" height="60rpx" border-radius="100%" :src="teacher.photoSrc"></u-image>
			</view>
			<view class="u-mar-l">{{ teacher.teacherName }}</view>
			<view class="u-fx-f1 u-mar-l40 u-fx-je">
				<u-tag :text="teacher.subjectName || '未分科'" size="mini" bg-color="#7691fa" color="#fff" border-color="#fff" />
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="title">学生{{studentList.length}}人</view>
		<no-data v-if="studentList.length === 0" msg="暂无班级学生~"></no-data>
		<view class="user-list u-fx-ac" v-for="student in studentList" :key="student.userCode">
			<view>
				<u-image width="60rpx" height="60rpx" border-radius="100%" :src="student.photoUrl || 'http://canpointtest.com/mini-img/auto-user-icon.png'"></u-image>
			</view>
			<view class="u-mar-l">{{ student.userName }}</view>
			<view class="u-fx-f1 u-fx-je u-mar-l40">
			</view>
			<view class="rit-arrow"></view>
		</view>
	</view>
</template>

<script>
	import baseData from '@u/base-data'
	import NoData from '../component/NoData.vue'
	export default {
		components: {
			NoData
		},
		data() {
			return {
				teacherList: [],
				studentList: []
			}
		},
		onPullDownRefresh () {
			this.showList()
			setTimeout(() => {
				this.$tools.toast('数据已刷新')
				uni.stopPullDownRefresh()
			}, 1500)
		},
		onShow () {
			this.showList()
		},
		mounted () {
			this.showList()
		},
		methods: {
			showList () {
				baseData.getTeacherList((data) => {
					this.teacherList = data
				})
				baseData.getStudentList((data) => {
					this.studentList = data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.contact {
		padding-bottom: 100rpx;
		.title {
			color: $u-content-color;
			border-bottom: 1px #eee solid;
			letter-spacing: 2rpx;
			font-size: 28rpx;
			height: 88rpx;
			line-height: 88rpx;
			padding: 0 20rpx;
		}
		.user-list {
			padding: 0 30rpx;
			background-color: #fff;
			height: 100rpx;
			border-bottom: 1rpx $u-border-color solid;
		}
	}
</style>
