<template>
	<view class="entry-app">
		<view class="u-type-white-bg entry-padd">
			<view class="u-tips-color tips-icon u-font-01 u-padd-b30">
				已有账号，请输入手机号进行绑定验证
			</view>
			<view class="yzm-box u-bd-b u-fx-ac">
				<view class="u-fx-f1 u-mar-r">
					<u-input v-model="mobile" type="number" placeholder="请输入手机号" />
				</view>
				<phone-code :mobile="mobile" @send="sendOk"></phone-code>
			</view>
			<view class="yzm-input" v-if="isShow">
				<u-message-input @change="change" :value="passCode" :maxlength="6" :focus="isFocus" active-color="#444444" inactive-color="#999999"></u-message-input>
			</view>
			<view :class="['primary-btn u-mar-t40', {'auto-act': passCode.length !== 6}]" @tap="goApp">确定</view>
			<view class="u-tips-color u-font-01 u-padd-t40 u-line-2">温馨提示：如果您是教职工，输入的手机号验证不通过，请联系学校管理员把您加入到系统</view>
		</view>
		<view class="u-type-white-bg entry-padd u-mar-t">
			<view class="u-tips-color tips-icon u-font-01 u-padd-b30">
				暂无账号？请选择身份进行注册
			</view>
			<view class="u-mar-t u-fx-jc">
				<view class="u-fx-ac-jc type-box u-mar-r40" @tap="bindTeacher">
					<u-image src="http://canpointtest.com/mini-img/laoshi-icon.png" width="80rpx" height="80rpx"></u-image>
					<text class="u-padd-t10 u-font-01">老师</text>
				</view>
				<view class="u-fx-ac-jc type-box u-mar-l40"  @tap="bindChild">
					<u-image src="http://canpointtest.com/mini-img/jiazhang-icon.png" width="80rpx" height="80rpx"></u-image>
					<text class="u-padd-t10 u-font-01">家长</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { actions, setStore } from '@store'
	import PhoneCode from '../component/PhoneCode.vue'
	import eventBus from '@u/eventBus'
	import baseData from '@u/base-data'
	export default {
		components: {
			PhoneCode
		},
		data () {
			return {
				isShow: false,
				isFocus: false,
				mobile: uni.getStorageSync('mobile'),
				passCode: ''
			}
		},
		mounted() {
		},
		methods: {
			sendOk () {
				this.isShow = true
				this.isFocus = true
			},
			change (value) {
				this.passCode = value
			},
			async goApp () {
				if (this.passCode.length === 6) {
					this.$tools.showLoading('登录中...')
					const res = await actions.userlogin({
						appletsOpenid: uni.getStorageSync('smallOpenId'),
						mobile: this.mobile,
						passCode: this.passCode,
						type: 0,
						openid: '',
						schoolCode: ''
					})
					setStore({
						userInfo: res.data,
						currentUserType: res.data.typeCode
					})
					this.$tools.toast('登录成功')
					this.$tools.goNext(() => {
						this.$tools.redirectTo({
							url: '/pages-basedata/index/home'
						})
					})
				}
			},
			bindChild () {
				this.$tools.navTo({
					url: '/pages/common/bindChild'
				})
			},
			bindTeacher () {
				this.$tools.confirm('该功能暂未开放~', null, false)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.entry-app {
		.entry-padd {
			padding: 50rpx;
		}
		.yzm-box {
			padding: 30rpx 0;
		}
		.yzm-input {
			padding: 80rpx 0rpx 40rpx;
		}
		.yzm-btn {
			height: 60rpx;
			line-height: 60rpx;
			font-size: 24rpx;
			padding: 0 20rpx;
			background-color: $u-type-primary;
			color:#fff;
			border-radius: 100rpx;
		}
		.type-box {
			width: 180rpx;
			height: 180rpx;
			background-color: $u-type-primary-light;
			color: $u-content-color;
			border-radius: 4rpx;
		}
		.auto-act {
			opacity: .4;
		}
	}
</style>
