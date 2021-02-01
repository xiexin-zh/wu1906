<template>
	<view class="face u-bg-fff">
		<choose-child @change = "change"></choose-child>
		<tab-menu @change="changeImg" :data-list="tabMenu"></tab-menu>
		<view class="face-view u-fx-ac-jc" v-if="baseImg === ''">
			<view @click="chooseImage">
				<image class="photo" src="/mobile-img/auto-face.png"></image>
			</view>
			<view>点击上传</view>
		</view>
		<view @click="chooseImage" class="face-view u-fx-ac-jc" v-if="baseImg!== ''">
			<view class="click-photo">点击拍照</view>
			<view >
				<image class="userPhoto" :src="baseImg"></image>
			</view>
		</view>
		<view class="info">
			<view class="tip">
				<text>注意事项</text>
			</view>
			<view>1. 请确认照片是本人</view>
			<view>2. 请确认露出清晰完整人脸部位</view>
			<view v-if="false">3. 保持光线充足，不要戴眼镜</view>
			<view v-if="false">4. 正对摄像头，不要戴帽子</view>
			<view v-if="false">5. 拍照时不要晃动，保证照片清晰度</view>
		</view>
		<view class="u-fx-ac u-fx-jsa">
			<view class="rule-list u-fx-ac-jc">
				<image class="rule-img" src="/mobile-img/zdsj.png"></image>
				<view>正对手机</view>
			</view>
			<view class="rule-list u-fx-ac-jc">
				<image class="rule-img" src="/mobile-img/gxcz.png"></image>
				<view>光线充足</view>
			</view>
			<view class="rule-list u-fx-ac-jc">
				<image class="rule-img" src="/mobile-img/fmdz.png"></image>
				<view>放慢动作</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { actions, store } from './store/index.js'
	import { setStore } from '../../protal/store/index.js'
	import chooseChild from '@/components/choose-child/choose-child.vue'
	import wxApi from '@u/wxApi'
	export default {
		data() {
			return {
				wxApi,
				isChild: true,
				tabMenu: [
					{
						name: '孩子照片'
					},
					{
						name: '本人照片'
					}
				],
				oldUrl: '',
				baseImg: ''
			}
		},
		components: {
			chooseChild
		},
		computed: {
			userInfo: () => store.userInfo,
			childList: () => store.childList
		},
		mounted () {
			this.change(this.childList[0])
		},
		methods: {
			changeImg (index) {
				if (index) {
					this.isChild = false
					this.oldUrl = JSON.parse(uni.getStorageSync('protal')).userInfo.photoUrl
					this.baseImg = JSON.parse(uni.getStorageSync('protal')).userInfo.photoUrl
				} else {
					this.isChild = true
					this.change(this.currentStudent)
				}
			},
			change(item) {
				this.currentStudent = item
				const url = this.currentStudent.photoUrl || ''
				this.oldUrl = url
				this.baseImg = url
			},
			async uploadImg () {
				try {
					const { userCode } = this.currentStudent
					const params = {
						schoolCode: this.userInfo.schoolCode,
						userCode: this.isChild ? userCode : this.userInfo.userCode,
						photoUrl: this.baseImg
					}
					if (this.isChild) {
						await actions.updatePhoto(params)
						const index = this.childList.findIndex(item => {
							return item.userCode === userCode
						})
						this.childList[index].photoUrl = this.baseImg
						setStore({
							key: 'childList',
							data: this.childList
						})
					} else {
						await actions.updateTeacherPhoto(params)
						setStore({
							key: 'userInfo',
							data: {
								...this.userInfo,
								photoUrl: this.baseImg
							}
						})
					}
					this.oldUrl = this.baseImg
					this.$tools.toast('上传成功', 1)
				} catch(err) {
				}
			},
			chooseImage() {
				this.wxApi.wxChoosePhoto(null, true, (url) => {
					this.baseImg = url
					this.uploadImg()
				})
			},
		}
	}
</script>

<style lang="scss">
	.face {
		padding-bottom: 40rpx;
		.face-demo {
			width: 450rpx;
			height: 500rpx; 
			margin: 0 auto;
			.face-demo-img {
				width: 100%;
				height: 100%;
			}
		}
		overflow: auto;
		.face-view {
			overflow: hidden;
			border: 6rpx $u-type-primary-light solid;
			width: 450rpx;
			height: 500rpx;
			margin: 50rpx auto 50rpx auto;
			border-radius: 10rpx;
			background-color: $u-type-primary-disabled;
			color: $u-type-primary;
			font-weight: bold;
			position: relative;
			.click-photo {
				position: absolute;
				width: 100%;
				height: 70rpx;
				line-height: 70rpx;
				color:$u-border-color;
				bottom: 0px;
				letter-spacing: 4rpx;
				z-index: 99;
				text-align: center;
				background: rgba(0,0,0,.4);
			}
		}
		.rule-list {
			margin-top: 30rpx;
			width: 160rpx;
			padding: 10px 0;
			color: #666;
			font-weight: bold;
			background-color: $u-type-primary-light;
			.rule-img {
				width: 40rpx;
				height: 50rpx;
				display: block;
				margin-bottom: 20rpx;
			}
		}
		
		.userPhoto {
			width: 500rpx;
			height: 500rpx;
			display: block;
		}
		.photo {
			width: 100rpx;
			height: 100rpx;
		}
		.info {
			color: $u-content-color;
			line-height: 60rpx;
			font-size: 24rpx;
			text-indent: 30rpx;
			.tip {
				color: $u-type-error;
				font-size: 34rpx;
				font-weight: bold;
			}
			.tip-demo {
				font-size: 28rpx;
				color: $u-type-warning;
				font-weight: bold;
			}
		}
		.padd-t60 {
			padding-top: 60rpx
		}
	}
	
</style>
