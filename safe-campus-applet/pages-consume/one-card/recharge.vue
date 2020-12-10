<template>
	<view>
		<view class="u-fx-ac u-bd-b item-list u-mar-b20">
			<view>充值账户：</view>
			<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountInfo.userName }}（余额{{ accountInfo.balance }}）</view>
		</view>
		<view class="u-fx-f1 u-bd-b item-list u-mar-b20">
			<view class="u-fx tip">充值金额（元）：</view>
			<view class="u-fx u-fx-ac u-mar-10 u-bd-b u-padd-10 u-font-3">
				<view>￥</view>
				<input @input="orderAmountInput" v-model="money" class="u-mar-l10" type="digit" placeholder="请输入充值金额" />
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
		<view class="u-bd-b item-list">
			<view class="tip">支付方式：</view>
			<view class="u-fx-f1 u-padd-t">
				<radio-group @change="changePayMode">
					<label v-for="(item, index) in payModeList" :key="item.value">
						<view :class="index === 0 ? 'uni-radio u-mar-b10 u-padd-b20 u-padd-t10 u-bd-b u-fx-ac' : 'uni-radio u-padd-t10 u-fx-ac'">
							<image class="icon u-mar-r20" :src="item.value === 'WXPAY_MINI' ? 'http://canpointtest.com/mini-img/wx.png' : 'http://canpointtest.com/mini-img/ali.png'" mode=""></image>
							<radio :value="item.value" :checked="item.checked" class="radio" style="transform:scale(0.8)" />
							<view class="u-mar-l10">{{ item.name }}</view>
						</view>
					</label>
				</radio-group>
			</view>
		</view>
		<view class="u-mar-40"><u-button @click="confirm" type="primary" class="primary-btn">确认充值</u-button></view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import { store, actions } from '@store';
import md5 from 'js-md5';
export default {
	data() {
		return {
			formData: {
				payMode: 'WXPAY_MINI'
			},
			accountInfo: {},
			money: 0,
			current: -1,
			moneyTotal: [50, 100, 200, 500, '其它金额'],
			payModeList: [
				{
					value: 'WXPAY_MINI',
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
				extra: this.formData.payMode === 'WXPAY_MINI' ? JSON.stringify({ openId: uni.getStorageSync('smallOpenId') }) : JSON.stringify({}),
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
			let _self = this;
			if (this.formData.payMode === 'WXPAY_MINI') {
				// 微信支付
				wx.requestPayment(
				{
				'timeStamp': res.data.payParams.timeStamp,
				'nonceStr': res.data.payParams.nonceStr,
				'package': res.data.payParams.package,
				'signType': 'MD5',
				'paySign': res.data.payParams.paySign,
				'success':function(res){
					_self.$tools.toast('充值成功', 'success');
					eventBus.$emit('getList');
					_self.$tools.goBack();
				},
				'fail':function(res){
					_self.$tools.toast('充值失败');
				},
				'complete':function(res){}
				})
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
	.radio {
		position: absolute;
		right: 10rpx;
	}
}
</style>
