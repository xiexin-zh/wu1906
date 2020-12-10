<template>
	<view class="welcome-loading u-page u-fx">
		<swiper class="swiper u-page":autoplay="autoplay">
			<swiper-item>
				<view class="swiper-item"><image class="welcome-img" src="http://canpointtest.com/mini-img/welcome-one.png"></image></view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item"><image class="welcome-img" src="http://canpointtest.com/mini-img/welcome-two.png"></image></view>
			</swiper-item>
			<swiper-item>
				<button class="go-app" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">立即体验</button>
				<view class="swiper-item"><image class="welcome-img" src="http://canpointtest.com/mini-img/welcome-three.png"></image></view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import WXBizDataCrypt from '@u/WXBizDataCrypt.js'
import wxConfig from '@u/wx-config'
import baseData from '@u/base-data'
export default {
	data() {
		return {
			autoplay: false
		};
	},
	computed: {},
	async mounted() {
		const smallOpenId = uni.getStorageSync('smallOpenId')
		if (!smallOpenId) {
			// 如果没有存储openid则获取
			wxConfig.getOpenId(res => {
				uni.setStorageSync('smallOpenId', res.data.openid)
				this.session_key = res.data.session_key
				this.getUserInfo()
			})
		} else {
			this.getUserInfo()
		} 
	},
	methods: {
		getUserInfo () {
			// 如果有,则获取用户信息
			baseData.getUserInfo((data) => {
				// 如果有用户信息，则直接进入首页
				if (data) {
					this.$tools.redirectTo({
						url: '/pages-basedata/index/home'
					})
				} else {
					uni.setStorageSync('smallOpenId', 'oMukd5OePI28cpr0-qX9VVjkO9ig')
					this.$tools.redirectTo({
						url: '/pages/common/entry'
					})
				}
			})
		},
		onGetPhoneNumber(e) {
			if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
				//用户决绝授权
				//拒绝授权后弹出一些提示
				uni.setStorageSync('mobile', '')
				this.goApp()
			} else {
				//允许授权
				let pc = new WXBizDataCrypt('wx02c23d5ba971d7b8', this.session_key); //wxXXXXXXX为你的小程序APPID
				let data = pc.decryptData(e.detail.encryptedData, e.detail.iv);
				uni.setStorageSync('mobile', data.phoneNumber)
				this.goApp()
			}
		},
		goApp() {
			this.$tools.redirectTo({
				url: '/pages/common/entry'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.welcome-loading {
	width: 100%;
	height: 100%;
	position: fixed;
	z-index: 999;
	background-color: $u-bg-color;
	.welcome-img {
		width: 100%;
		height: 100vh;
		display: block;
	}
	.go-app {
		position: absolute;
		bottom: 144rpx;
		z-index: 9999;
		left: 50%;
		margin-left: -225rpx;
		width: 450rpx;
		height: 110rpx;
		line-height: 110rpx;
		text-align: center;
		background-color: $u-type-primary;
		color: #fff;
		border: none;
		border-radius: 100rpx;
		letter-spacing: 2rpx;
	}
}
</style>
