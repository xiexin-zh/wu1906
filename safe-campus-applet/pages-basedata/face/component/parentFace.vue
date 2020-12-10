<template>
	<view class="parent-face">
		<view class="u-bd-b"><u-tabs :list="list" :is-scroll="false" font-size="28" :current="current" @change="change"></u-tabs></view>
		<view class="u-fx-ac-jc u-padd-40 u-type-white-bg">
			<view class="face-border">
				<image :src="currentUserPhoto" class="face-img"></image>
			</view>
			<view class="upload-btn" @tap="goPhoto">上传头像</view>
		</view>
		<warn-info></warn-info>
	</view>
</template>

<script>
	import { store, actions, setStore } from '@store'
	import warnInfo from './warnInfo.vue'
	import baseData from '@u/base-data'
	export default {
		components: {
			warnInfo
		},
		computed: {
			userInfo: () => store.userInfo,
			currentBindStudent: () => store.currentBindStudent
		},
		data() {
			return {
				baseData,
				current: 0,
				currentUserPhoto: '',
				list: [
					{
						name: '孩子头像'
					},
					{
						name: '本人头像'
					}
				]
			}
		},
		mounted () {
			this.currentUserPhoto = this.currentBindStudent.photoUrl
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				this.baseData.uploadFace(path, url => {
					this.uploadPhoto(url)
				})
			})
		},
		methods: {
			async uploadPhoto (url) {
				const userCode = this.current === 0 ? this.currentBindStudent.userCode : this.userInfo.userCode
				this.$tools.showLoading('头像上传中...')
				await actions.updatePhoto({
					schoolCode: this.userInfo.schoolCode,
					userCode,
					photoUrl: url
				})
				this.currentUserPhoto = url
				if (this.current === 0) {
					setStore({
						currentBindStudent: {
							...this.currentBindStudent,
							photoUrl: url
						}
					})
				} else {
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
				if (index === 0) {
					this.currentUserPhoto = this.currentBindStudent.photoUrl
				} else {
					this.currentUserPhoto = this.userInfo.photoUrl
				}
			},
			goPhoto () {
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
	.parent-face {
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
