<template>
	<view class="u-page login">
		<view class="u-type-white-bg login-box">
			<view class="login-logo"><image :src="logo" class="auto-bg-img logo"></image></view>
			<view class="u-fx-ac login-input u-bd-b">
				<u-input v-model="phone" type="number" placeholder="请输入手机号" />
				<view class="yzm" :class="{ act: total !== 60 }" @click="getYzm">{{ tip }}</view>
			</view>
			<u-message-input :focus="isCode" @change="changeCode" v-if="isCode" inactive-color="#999" :maxlength="6" :value="passCode"></u-message-input>
			<view :class="['login-btn', {'act': passCode.length === 6}]" @click="login">登录</view>
		</view>
		<view class="u-mar-t u-type-white-bg u-padd-b40">
			<view class="u-tips-color u-padd-40 u-font-01">暂无账号, 请选择家长身份注册！</view>
			<view @click="toReg" class="register u-fx-ac-jc">
				<image src="/mobile-img/parent-icon.png" class="parent-icon"></image>
				<view class="u-padd-t10">家长注册</view>
			</view>
		</view>
	</view>
</template>

<script>
import { setStore, actions } from './store/index.js';
import uniRequest from 'uni-request';
import $ajax from '@u/request.js'
import hostEnv from '@config/index.js'
import wxApi from '@u/wxApi'
export default {
	data() {
		return {
			logo: '/mobile-img/logo.png',
			type: 0, // 短信
			phone: '',
			passCode: '',
			total: 60,
			isCode: false,
			tip: '获取验证码'
		};
	},
	computed: {},
	components: {},
	mounted() {
		uni.removeStorageSync('imgId')
		uni.setStorageSync('tabIndex', 0)
		const url = window.location.href;
		const params = new URLSearchParams(url.substr(url.indexOf('?')).replace('#/', ''));
		// 获取路径返回的code和openid
		this.openid = params.get('openid')
		this.code = params.get('code')
		// 获取路径返回schoolCode
		if (params.get('schoolCode')) {
			this.logo = `/mobile-img/${params.get('schoolCode')}.png`
			this.getOpenid(params.get('schoolCode'))
		} else {
			// 通过域名动态获取学校编码
			wxApi.getConfigSchoolCode(data => {
				this.logo = `/mobile-img/${data}.png`
				this.getOpenid(data)
			})
		}
		this.$tools.inputScroll();
	},
	methods: {
		// 微信js-api授权
		// 获取openid
		async getOpenid(schoolCode) {
			// 通过域名判断学校code，用于微信公众号配置和短信发送判断
			this.schoolCode = schoolCode
			uni.setStorageSync('_schoolCode', this.schoolCode)
			wxApi.getConfig();
			// 本地测试使用
			if (!this.openid && !this.code) {
				this.$tools.toast('请在地址栏输入openid进行绑定');
				return;
			}
			if (this.openid && !this.code) {
				const openid = this.openid;
				this.getUserInfo(openid);
				this.setOpenid(openid);
				return;
			}
			if (uni.getStorageSync('openid') && uni.getStorageSync('openid') !== 'undefined') {
				const openid = uni.getStorageSync('openid');
				this.setOpenid(openid);
				this.getUserInfo(openid);
			} else {
				const res = await uniRequest.get('/getOpenid', {
					params: {
						code: this.code,
						schoolCode: this.schoolCode
					}
				});
				const openid = res.data.data.openid;
				uni.setStorageSync('openid', openid);
				this.setOpenid(openid);
			}
		},
		// 存储openid
		setOpenid(openid) {
			this.openid = openid;
			setStore({
				key: 'openid',
				data: openid
			});
		},
		// 验证手机号
		testPhone() {
			var reg = /^1[3456789]\d{9}$/;
			if (this.phone === '' || !reg.test(this.phone)) {
				this.$tools.toast('请输入正确手机号');
				return false;
			}
			return true;
		},
		changeCode (e) {
			this.passCode = e
		},
		// 获取验证码
		async getYzm() {
			if (this.total !== 60) return
			if (!this.testPhone()) return;
			try {
				await $ajax.getUrl({
					url: `${hostEnv.protal_api_10166}/mobile/user/info/code/send/${this.phone}?schoolCode=${this.schoolCode}`
				})
				this.isCode = true
				this.$tools.toast('验证码发送成功');
				this.timer = setInterval(() => {
					if (this.total === 1) {
						this.tip = '获取验证码';
						this.total = 60;
						clearInterval(this.timer);
						return;
					}
					this.total--;
					this.tip = `${this.total} s`;
				}, 1000);
			} catch (err) {}
		},
		// 通过openid获取用户信息
		async getUserInfo(openid) {
			const res = await actions.getUserInfo(openid);
			if (res.data) {
				setStore({
					key: 'userInfo',
					data: res.data
				});
				setStore({
					key: 'dangerList',
					data:  []
				})
				this.$tools.redirectTo({
					url: './main'
				});
			}
		},
		// 登录
		async login() {
			if (!this.isCode) return
			if (!this.testPhone()) return;
			if (this.passCode === '') {
				this.$tools.toast('请输入验证码');
				return;
			}
			const res = await actions.login({
				appletsOpenid: '',
				mobile: this.phone,
				openid: this.openid,
				passCode: this.passCode,
				schoolCode: this.schoolCode,
				type: this.type
			});
			clearInterval(this.timer);
			setStore({
				key: 'userInfo',
				data: res.data
			});
			this.$tools.toast('登录成功', 1);
			this.$tools.goNext(() => {
				this.$tools.redirectTo({
					url: './main'
				});
			});
		},
		toReg() {
			this.$tools.navTo({
				title: '家长注册',
				url: './register'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.login {
	.login-box {
		padding: 120rpx 0 5rpx 0;
	}
	.logo {
		margin: 0 auto 100rpx auto;
		width: 428rpx;
		height: 89rpx;
		display: block;
	}
	.login-input {
		margin: 40rpx;
		padding: 20rpx 0rpx;
	}
	.yzm {
		margin-left: 20rpx;
		padding: 0 20rpx;
		text-align: center;
		line-height: 60rpx;
		height: 60rpx;
		border-radius: 100rpx;
		font-size: 24rpx;
		background-color: $u-type-primary;
		color: #fff;
		&.act {
			opacity: .5;
		}
	}
	.login-btn {
		height: 88rpx;
		margin: 60rpx 40rpx;
		background-color: $u-type-primary;
		color:#fff;
		font-size: 30rpx;
		border-radius: 100rpx;
		line-height: 88rpx;
		text-align: center;
		opacity: .6;
		&.act {
			opacity: 1
		}
	}
	.register {
		width: 150rpx;
		height: 150rpx;
		border-radius: 4px;
		background-color: $u-type-primary-light;
		margin: 20rpx auto;
		color: $u-type-primary;
		font-size: 24rpx;
	}
	.parent-icon {
		width: 80rpx;
		height: 80rpx;
		display: block;
	}
}
</style>
