<template>
	<view class="change-phone u-auto u-padd-t">
		<view class="u-mar u-type-white-bg u-padd u-border-radius u-fx-ac">
			<view class="phone-icon"></view>
			<view class="u-fx-f1 u-mar-l40">
				<u-input disabled v-model="formData.oldMobile" placeholder="原手机号" />
			</view>
		</view>
		<view class="u-mar u-type-white-bg u-padd u-border-radius u-fx-ac">
			<view class="phone-icon"></view>
			<view class="u-fx-f1 u-mar-l40">
				<u-input v-model="formData.newMobile" placeholder="新手机号" />
			</view>
		</view>
		<view class="u-mar u-type-white-bg u-padd u-border-radius u-fx-ac">
			<view class="yzm-icon"></view>
			<view class="u-fx-f1 u-mar-l40">
				<u-input v-model="formData.captchaCode" placeholder="验证码" />
			</view>
			<view @tap="getYzm" class="u-mar-l u-bd-l u-padd-l u-type-primary">
				{{ total === 60 ? '获取验证码' : total + 'S' }}
			</view>
		</view>
		<view class="u-mar u-padd-t">
			<u-button type="primary" @tap="submitForm">{{ changeTag ? '修改中...' : '确定' }}</u-button>
		</view>
	</view>
</template>

<script>
import { store, setStore, actions } from './store/index.js'
	export default {
		data () {
			return {
				total: 60,
				changeTag: false,
				formData: {
					oldMobile: store.userInfo.mobile,
					newMobile: '',
					captchaCode: ''
				}
			}
		},
		methods: {
			// 验证手机号
			testPhone() {
				var reg = /^1[3456789]\d{9}$/;
				if (!reg.test(this.formData.newMobile)) {
					this.$tools.toast('请输入正确手机号');
					return false;
				}
				return true;
			},
			async getYzm () {
				if (!this.testPhone()) return;
				if (!this.formData.newMobile) {
					this.$tools.toast('请输入正确手机号')
					return
				}
				if (this.formData.oldMobile === this.formData.newPhone) {
					this.$tools.toast('新旧手机号不能相同')
					return
				}
				try {
					actions.getCode(this.formData.newMobile)
					this.$tools.toast('发送成功', 1)
					this.timer = setInterval(() => {
						this.total--
						if (this.total <= 0) {
							this.total = 60
							clearInterval(this.timer)
						}
					}, 1000)
				} catch(err) {
					this.$tools.toast('发送失败')
				}
			},
			async submitForm () {
				if (!this.testPhone()) return
				if (!this.formData.newMobile) {
					this.$tools.toast('请输入新手机号')
					return false
				}
				if (!this.formData.captchaCode) {
					this.$tools.toast('请输入验证码')
					return
				}
				this.changeTag = true
				try {
					await actions.changePhone(this.formData)
					this.$tools.toast('修改成功')
					this.changeTag = false
					setStore({
						key: 'userInfo',
						data: {
							...store.userInfo,
							mobile: this.formData.newMobile
						}
					})
					this.$tools.goNext(() => {
						this.$tools.goBack()
					})
				} catch(err) {
					this.changeTag = false
					this.$tools.toast(err.message || '修改失败')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.change-phone {
		.phone-icon {
			width: 24rpx;
			height: 36rpx;
			background: url(assets/img/phone-icon.png) no-repeat;
			background-size: contain ;
		}
		.yzm-icon {
			width: 31rpx;
			height: 36rpx;
			background: url(assets/img/yzm-icon.png) no-repeat;
			background-size: contain ;
		}
	}
</style>
