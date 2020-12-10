<template>
	<view class="phone-code">
		<view :class="['yzm-btn u-mar-l40', {'opa': total != 90}]" @tap="_getPhoneCode">{{ codeMsg }}</view>
	</view>
</template>

<script>
	import { actions } from '@store'
	export default {
		props: {
			mobile: {
				type: String,
				default: ''
			}
		},
		data () {
			return {
				total: 90,
				codeMsg: '获取验证码'
			}
		},
		methods: {
			// 获取验证码
			async _getPhoneCode () {
				var reg = /^1[3456789]\d{9}$/;
				if (!reg.test(this.mobile)) {
					this.$tools.toast('请输入正确手机号')
					return
				}
				if (this.total === 90) {
					this.total = 89
					this.$tools.showLoading('获取中...')
					await actions.getPhoneCode(this.mobile)
					this.$tools.toast('发送成功')
					this.$emit('send')
					this.time = setInterval(() => {
						this.total--
						this.codeMsg = this.total + ' S'
						if (this.total === 0) {
							clearInterval(this.time)
							this.codeMsg = '获取验证码'
							this.total = 90
						}
					}, 1000)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.phone-code {
		.yzm-btn {
			height: 50rpx;
			padding: 0 20rpx;
			background-color: $u-type-primary;
			color:#fff;
			border-radius: 100rpx;
			line-height: 50rpx;
			font-size: 24rpx;
		}
		.opa {
			opacity: .4;
		}
	}
</style>
