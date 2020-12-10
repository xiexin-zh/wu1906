<template>
	<view v-if="showTag" class="scroll-h u-type-info-bg u-fx-ac-jc">
		<view class="tips">请长按网址复制后使用浏览器访问</view>
		<view class="tips">
			<text selectable="true">{{ url }}</text>
		</view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus.js';
import { actions } from '@store';
import md5 from 'js-md5';
export default {
	data() {
		return {
			showTag: true,
			url: ''
		};
	},
	components: {},
	beforeDestroy() {
		eventBus.$emit('getList');
		clearInterval(this.timer);
	},
	onLoad: function(options) {
		this.billNo = options.billNo;
		this.orderNo = options.orderNo;
		this.type = options.type;
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
			// #ifdef MP-WEIXIN
			this.showTag = true;
			if (this.type === '1') {
				this.url = `http://canpointlive.com/mobile-protal/protal-card/#/pages/card-consume/alipay?type=1&billNo=${this.billNo}`;
			} else {
				this.url = `http://canpointlive.com/mobile-protal/protal-card/#/pages/card-consume/alipay?orderNo=${this.orderNo}`;
			}
			console.log(this.url);
			let _this = this;
			this.timer = setInterval(function() {
				actions
					.queryRecordInfo({
						orderNo: data.orderId
					})
					.then(res => {
						console.log(res);
						if (res.data.status === '2') {
							_this.$tools.toast('充值成功', 'success');
							clearInterval(_this.timer);
							_this.$tools.goNext(() => {
								eventBus.$emit('getList');
								uni.reLaunch({
									url: './index'
								});
							});
						}
						if (res.data.status === '3') {
							_this.$tools.toast('充值失败');
							clearInterval(_this.timer);
							_this.$tools.goNext(() => {
								eventBus.$emit('getList');
								uni.reLaunch({
									url: './index'
								});
							});
						}
					});
				/* uni.request({
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
								});
							});
						}
						if (res.data.data.status === '3') {
							_this.$tools.toast('充值失败');
							clearInterval(_this.timer);
							_this.$tools.goNext(() => {
								eventBus.$emit('getList');
								uni.reLaunch({
									url: './index'
								});
							});
						}
					}
				}); */
			}, 1000);
			// #endif
			// #ifdef H5
			this.showTag = false;
			console.log(data);
			const div = document.createElement('divform');
			div.innerHTML = data.payUrl;
			document.body.appendChild(div);
			document.forms[0].acceptCharset = 'UTF-8';
			document.forms[0].submit();
			// #endif
		},
		//获取支付信息
		async getData() {
			if (this.type === '1') {
				console.log(12345);
				const res = await actions.continueRecharge({
					billNo: this.billNo
				});
				console.log(res.data);
				this.getPayStatus(res.data);
			} else {
				const res = await actions.continueRechargeByOrderNo({
					orderNo: this.orderNo
				});
				console.log(res.data);
				this.getPayStatus(res.data);
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
.icon-img {
	width: 198rpx;
	height: 194rpx;
	margin: 40rpx 40rpx 100rpx 0;
}
.tips {
	font-size: 32rpx;
	font-weight: 500;
	margin-bottom: 20rpx;
	color: #fff;
	padding: 0 20rpx;
	word-break: break-all;
}
</style>
