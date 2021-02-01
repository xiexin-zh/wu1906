<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="u-fx-f1 u-bd-b item-list u-mar-b20">
				<view class="u-fx tip">充值金额（元）：</view>
				<view class="u-fx u-fx-ac u-mar-10 u-bd-b u-padd-10 u-font-3">
					<view>￥</view>
					<input @input="orderAmountInput" v-model="money" class="u-mar-l10" type="digit" placeholder="" />
				</view>
				<view class="money-num u-fx-jsa u-mar-t20">
					<view
						@click="changeMoney(item, index)"
						:class="
							current === index
								? 'u-padd-20 u-padd-t10 u-padd-b10 u-bd-1px u-mar-r20 u-color u-type-primary-bg u-type-white u-border-radius '
								: 'u-type-info-light-bg u-padd-20 u-padd-t10 u-padd-b10 u-bd-1px u-mar-r20 u-border-radius'
						"
						v-for="(item, index) in moneyTotal"
						:key="index"
					>
						{{ item }}
					</view>
				</view>
				<view class="u-fx u-mar-t20">到账：{{ money || 0 }}元</view>
			</view>
			<view class="u-fx-ac u-bd-b item-list u-mar-b20">
				<view>充值账户：</view>
				<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountInfo.userName }}（余额{{ accountInfo.balance }}）</view>
			</view>
			<view class="u-bd-b item-list">
				<view class="tip">支付方式：</view>
				<view class="u-fx-f1 u-padd-t">
					<radio-group @change="changePayMode">
						<label v-for="(item, index) in payModeList" :key="item.value">
							<view :class="index === 0 ? 'uni-radio u-mar-b10 u-padd-b20 u-padd-t10 u-bd-b u-fx' : 'uni-radio u-padd-t10 u-fx'">
								<image class="icon u-mar-r20" :src="item.value === 'WXPAY_JSAPI' ? '/mobile-img/wx.png' : '/mobile-img/ali.png'" mode=""></image>
								<radio :value="item.value" :checked="item.checked" />
								<view>{{ item.name }}</view>
							</view>
						</label>
					</radio-group>
				</view>
			</view>
		</scroll-view>
		<view class="footer-btn u-fx-ac"><u-button @click="confirm" type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg">确认充值</u-button></view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import { store, actions } from './store/index.js';
import md5 from 'js-md5';
export default {
	data() {
		return {
			formData: {
				payMode: 'WXPAY_JSAPI'
			},
			accountInfo: {},
			money: 0,
			current: -1,
			moneyTotal: [50, 100, 200, 500, '其它金额'],
			payModeList: [
				{
					value: 'WXPAY_JSAPI',
					name: '微信支付',
					checked: true
				},
				{
					value: 'ALIPAY_WAP',
					name: '支付宝支付'
				}
			]
		};
	},
	components: {},
	beforeDestroy() {
		eventBus.$emit('getList');
	},
	mounted() {
		this.accountInfo = uni.getStorageSync('accountInfo');
	},
	methods: {
		changePayMode(e) {
			this.formData.payMode = e.target.value;
			console.log(this.formData.payMode);
		},
		orderAmountInput(e) {
			this.current = -1;
			this.money = Math.floor(e.target.value * 100) / 100;
		},
		changeMoney(money, index) {
			this.money = money === '其它金额' ? '' : money;
			this.current = index;
		},
		onBridgeReady(payParams) {
			let _self = this;
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest',
				{
					appId: payParams.appId, //公众号名称，由商户传入
					timeStamp: payParams.timeStamp, //时间戳，自1970年以来的秒数
					nonceStr: payParams.nonceStr, //随机串
					package: payParams.package,
					signType: payParams.signType, //微信签名方式：
					paySign: payParams.paySign //微信签名
				},
				function(res) {
					if (res.err_msg == 'get_brand_wcpay_request:ok') {
						// 使用以上方式判断前端返回,微信团队郑重提示：
						_self.$tools.toast('充值成功', 'success');
						eventBus.$emit('getList');
						_self.$tools.goBack();
					}
				}
			);
		},
		async confirm() {
			if (!this.money) {
				this.$tools.toast('请输入充值金额');
				return;
			}
			if (!this.formData.payMode) {
				this.$tools.toast('请选择支付方式');
				return;
			}
			const req = {
				extra: this.formData.payMode === 'WXPAY_JSAPI' ? JSON.stringify({ openId: store.openid }) : JSON.stringify({}),
				payType: this.formData.payMode,
				rechargeAmount: this.money.toFixed(2),
				timeStamp: parseInt(new Date().getTime() / 1000),
				userCode: this.accountInfo.userCode,
				key: 'M86l522AV6q613Ii4W6u8K48uW8vM1N6bFgyv769220MdYe9u37N4y7rI5mQ'
			};
			const sign = this.getSign(req);
			req.sign = sign;
			const res = await actions.createRecharge({
				...req,
				key: undefined
			});
			if (this.formData.payMode === 'WXPAY_JSAPI') {
				// 微信支付
				if (typeof WeixinJSBridge == 'undefined') {
					if (document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(res.data.payParams), false);
					} else if (document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(res.data.payParams));
						document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(res.data.payParams));
					}
				} else {
					this.onBridgeReady(res.data.payParams);
				}
			} else {
				this.$tools.navTo({
					url: `./alipay?orderNo=${res.data.orderId}`
				});
			}
		},
		// 生成签名
		getSign(params) {
			let arr = [];
			for (let i in params) {
				arr.push(i + '=' + params[i]);
			}
			let urlStr = arr.join('&');
			return md5(urlStr).toUpperCase();
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 100rpx);
}
.tip::before {
	position: absolute;
	content: '*';
	color: red;
	left: 10rpx;
	width: 10rpx;
	height: 10rpx;
}
.item-list {
	padding: 25rpx 10rpx 25rpx 30rpx;
	background: $uni-bg-color;
}
.item-input {
	width: 100%;
	font-size: 26rpx;
	color: $u-tips-color;
}
.money-num {
	.money-list {
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
	}
}
.icon {
	width: 42rpx;
	height: 42rpx;
}
/deep/ .uni-radio {
	position: relative;
	uni-radio {
		position: absolute;
		right: 10rpx;
		.uni-radio-input {
			width: 40rpx;
			height: 40rpx;
		}
	}
}
</style>
