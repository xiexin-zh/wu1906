<template>
	<view class="teacher-face">
		<view class="u-bd-b"><u-tabs :list="list" :is-scroll="false" font-size="28" :current="current" @change="change"></u-tabs></view>
		<view v-if="current === 0" class="u-auto">
			<view class="u-tips-color u-mar u-font-01 tips-icon">点击学生头像进行上传更新</view>
			<no-data v-if="studentList.length === 0" msg="班级暂无学生"></no-data>
			<view @tap="uploadStudent(student.userCode, index)" class="student-list u-fx-ac-jc" v-for="(student, index) in studentList" :key="student.userCode">
				<image class="student-img" :src="student.photoUrl"></image>
				<text class="u-content-color u-padd-t10 u-tx-c u-font-01">{{ student.userName }}</text>
			</view>
		</view>
		<view v-if="current === 1" class="u-fx-ac-jc u-padd-40 u-type-white-bg">
			<view class="face-border">
				<image :src="currentUserPhoto" class="face-img"></image>
			</view>
			<view class="upload-btn" @tap="uploadStudent('')">上传头像</view>
		</view>
		<warn-info v-if="current === 1"></warn-info>
	</view>
</template>

<script>
	import { store, actions, setStore } from '@store'
	import NoData from '../../component/NoData.vue'
	import warnInfo from './warnInfo.vue'
	import baseData from '@u/base-data'
	export default {
		components: {
			warnInfo,
			NoData
		},
		computed: {
			userInfo: () => store.userInfo,
			currentBindStudent: () => store.currentBindStudent
		},
		data() {
			return {
				baseData,
				currentUserPhoto: '',
				current: 0,
				list: [
					{
						name: '班级学生'
					},
					{
						name: '本人头像'
					}
				],
				studentList: []
			}
		},
		mounted () {
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				this.baseData.uploadFace(path, url => {
					this.uploadPhoto(url)
				})
			})
			this.baseData.getStudentList(data => {
				this.studentList = data
			})
		},
		methods: {
			async uploadPhoto (url) {
				const userCode = this.current === 0 ? this.userCode : this.userInfo.userCode
				this.$tools.showLoading('头像上传中...')
				await actions.updatePhoto({
					schoolCode: this.userInfo.schoolCode,
					userCode,
					photoUrl: url
				})
				if (this.current === 0) {
					this.studentList[this.index].photoUrl = url
				} else {
					this.currentUserPhoto = url
					setStore({
						userInfo: {
							...this.userInfo,
							photoUrl: url
						}
					})
				}
				this.$tools.toast('上传成功')
			},
			change (index) {
				this.current = index
				if (index === 1) {
					this.currentUserPhoto = this.userInfo.photoUrl
				}
			},
			uploadStudent (code, index) {
				if (code) {
					this.userCode = code
					this.index = index
				}
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 400,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 300,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.teacher-face {
		.student-list {
			background-color: #fff;
			border: 4px #fff solid;
			width: 22.5%;
			float: left;
			margin-left: 2%;
			margin-bottom: 20rpx;
		}
		.student-img {
			width: 100%;
			height: 160rpx;
			border: none;
		}
		.face-show {
			background-color: #fff;
		}
		.face-border {
			width: 380rpx;
			height: 420rpx;
			overflow: hidden;
			border: 10rpx $u-bg-color solid;
			border-radius: $u-border-radius;
			background-color: $u-bg-color;
		}
		.upload-btn {
			width: 380rpx;
			height: 65rpx;
			line-height: 65rpx;
			letter-spacing: 2rpx;
			text-align: center;
			font-size: 24rpx;
			background-color: $u-type-primary;
			color:#fff;
		}
		.face-img {
			width: 380rpx;
			height: 420rpx;
			display: block;
		}
	}
</style>
