<template>
	<scroll-view v-if="showTag" scroll-y="true" class="scroll-h u-type-info-bg">
		<view class="u-fx-je"><image class="icon-img" :src="'/mobile-img/alipay_icon.png'" mode=""></image></view>
		<view class="tips u-fx-ac-jc">点击屏幕右上角【...】</view>
		<view class="tips u-fx-ac-jc">用浏览器打开</view>
		<view class="u-fx-ac-jc"><image class="tip-img" :src="'/mobile-img/alipay_tip.png'" mode=""></image></view>
	</scroll-view>
</template>

<script>
import eventBus from '@u/eventBus.js';
import uniRequest from 'uni-request';
import md5 from 'js-md5';
export default {
	data() {
		return {
			showTag: true
		};
	},
	components: {},
	beforeDestroy() {
		eventBus.$emit('getList');
		clearInterval(this.timer);
	},
	async mounted() {
		this.getData();
	},
	methods: {
		// 生成签名
		getSign(params) {
			let arr = [];
			for (let i in params) {
				arr.push(i + '=' + params[i]);
			}
			let urlStr = arr.join('&');
			return md5(urlStr).toUpperCase();
		},
		//支付状态轮询
		getPayStatus(data) {
			if (!this.$tools.isWx()) {
				this.showTag = false;
				const div = document.createElement('divform');
				div.innerHTML = data.payUrl;
				document.body.appendChild(div);
				document.forms[0].acceptCharset = 'UTF-8';
				document.forms[0].submit();
			} else {
				this.showTag = true;
				let _this = this;
				this.timer = setInterval(function() {
					uni.request({
						url: `/protal_api_11031/api/mobile/queryRecordInfoByOrderNo?orderNo=${data.orderId}`,
						header: {
							'Content-Type': 'application/json'
						},
						method: 'post',
						success: res => {
							console.log(res);
							if (res.data.data.status === '2') {
								_this.$tools.toast('充值成功', 'success');
								clearInterval(_this.timer);
								_this.$tools.goNext(() => {
									eventBus.$emit('getList');
									uni.reLaunch({
									   url: './index'
									})
								});
							}
							if (res.data.data.status === '3') {
								_this.$tools.toast('充值失败');
								clearInterval(_this.timer);
								_this.$tools.goNext(() => {
									eventBus.$emit('getList');
									uni.reLaunch({
									   url: './index'
									})
								});
							}
						}
					});
				}, 1000);
			}
		},
		//获取支付信息
		getData() {
			this.type = this.$tools.getQuery().get('type');
			if (this.type === '1') {
				uni.request({
					url: `/protal_api_11031/api/mobile/continueRecharge?billNo=${this.$tools.getQuery().get('billNo')}`,
					header: {
						'Content-Type': 'application/json'
					},
					method: 'post',
					success: res => {
						console.log(res.data.data);
						this.getPayStatus(res.data.data);
					}
				});
			} else {
				uni.request({
					url: `/protal_api_11031/api/mobile/continueRechargeByOrderNo?orderNo=${this.$tools.getQuery().get('orderNo')}`,
					header: {
						'Content-Type': 'application/json'
					},
					method: 'post',
					success: res => {
						console.log(res.data.data);
						this.getPayStatus(res.data.data);
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: 100vh;
}
.title {
	background: #666;
	color: #fff;
}
.tip-img {
	width: 650rpx;
	height: 466rpx;
	margin-top: 80rpx;
}
.icon-img{
	width: 198rpx;
	height: 194rpx;
	margin: 40rpx 40rpx 100rpx 0;
}
.tips {
	font-size: 32rpx;
	font-weight: 500;
	margin-bottom: 20rpx;
	color: #fff;
}
</style>
