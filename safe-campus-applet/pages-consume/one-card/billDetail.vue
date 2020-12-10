<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h">
			<view v-if="tradeType === '1'" class="">
				<view class="detail-info u-fx-ac-jc u-bg-fff u-mar-b20 u-padd-20">
					<view class="name u-mar-10 u-fw-5 u-fx-ac">
						<image class="icon u-mar-r20" src="http://canpointtest.com/mini-img/chongzhi@2x.png" mode=""></image>
						<text class="warning">{{ tradeType | getTradeType }}</text>
					</view>
					<view class="money u-tx-c u-mar-20 u-bold">{{ accountDetail.consumeAmount }}</view>
					<view class="u-font-01 u-type-info u-tx-c u-mar-10">{{ accountDetail.consumeStatus | getTradeStatus }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>消费金额：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.consumeAmount }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>优惠：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.discountAmount }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>用户姓名：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.userName }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>消费设备：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.deviceName }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>消费方式：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.consumeType | getConsumeType }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>消费时间：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.consumeTime }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>账单号：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.billNo }}</view>
				</view>
			</view>
			<view v-if="tradeType === '2'" class="">
				<view class="detail-info u-fx-ac-jc u-bg-fff u-mar-b20 u-padd-20">
					<view class="name u-mar-10 u-fw-5 u-fx-ac">
						<image class="icon u-mar-r20" src="http://canpointtest.com/mini-img/chongzhi@2x.png" mode=""></image>
						<text class="warning">{{ tradeType | getTradeType }}</text>
					</view>
					<view class="money u-tx-c u-mar-20 u-bold">{{ accountDetail.rechargeAmount }}</view>
					<view class="u-font-01 u-type-info u-tx-c u-mar-10">{{ accountDetail.status | getTradeStatus }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>充值金额：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.rechargeAmount }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>赠送：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.discountAmount }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>用户姓名：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.userName }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>充值方式：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.remark }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>支付方式：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.rechargeType === '1' ? '线上' : '线下' }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>充值时间：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.createTime }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>账单号：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.billNo }}</view>
				</view>
			</view>
			<view v-if="tradeType === '3'" class="">
				<view class="detail-info u-fx-ac-jc u-bg-fff u-mar-b20 u-padd-20">
					<view class="name u-mar-10 u-fw-5 u-fx-ac">
						<image class="icon u-mar-r20" src="http://canpointtest.com/mini-img/buzhu@2x.png" mode=""></image>
						<text class="primary">{{ tradeType | getTradeType }}</text>
					</view>
					<view class="money u-tx-c u-mar-20 u-bold">{{ accountDetail.rechargeAmount }}</view>
					<view class="u-font-01 u-type-info u-tx-c u-mar-10">{{ accountDetail.status | getTradeStatus }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>补助金额：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.rechargeAmount }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>赠送：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.discountAmount }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>用户姓名：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.userName }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>补助时间：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.createTime }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>账单号：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.billNo }}</view>
				</view>
			</view>
			<view v-if="tradeType === '4'" class="">
				<view class="detail-info u-fx-ac-jc u-bg-fff u-mar-b20 u-padd-20">
					<view class="name u-mar-10 u-fw-5 u-fx-ac">
						<image class="icon u-mar-r20" src="http://canpointtest.com/mini-img/tuikuan@2x.png" mode=""></image>
						<text class="error">{{ tradeType | getTradeType }}</text>
					</view>
					<view class="money u-tx-c u-mar-20 u-bold">{{ accountDetail.returnAmount }}</view>
					<view class="u-font-01 u-type-info u-tx-c u-mar-10">{{ accountDetail.returnStatus | getTradeStatus }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>退款金额：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.returnAmount }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>用户姓名：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.userName }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>原消费账单号：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.origBillNo }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>退款时间：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.createTime }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>账单号：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.billNo }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>备注：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.remark }}</view>
				</view>
			</view>
			<view v-if="tradeType === '5'" class="">
				<view class="detail-info u-fx-ac-jc u-bg-fff u-mar-b20 u-padd-20">
					<view class="name u-mar-10 u-fw-5 u-fx-ac">
						<image class="icon u-mar-r20" src="http://canpointtest.com/mini-img/yueqingling@2x.png" mode=""></image>
						<text class="info">{{ tradeType | getTradeType }}</text>
					</view>
					<view class="money u-tx-c u-mar-20 u-bold">{{ accountDetail.clearAmount }}</view>
					<view class="u-font-01 u-type-info u-tx-c u-mar-10">{{ accountDetail.clearStatus | getTradeStatus }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>清零余额：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.clearAmount }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>清零押金：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.clearDeposit }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>退还余额：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.returnAmount }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>退还押金：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.returnDeposit }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>用户姓名：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.userName }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>清零时间：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.createTime }}</view>
				</view>
				<view class="u-fx-ac item-list">
					<view>账单号：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.billNo }}</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>备注：</view>
					<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r10">{{ accountDetail.remark }}</view>
				</view>
			</view>
			<view @click="confirm" class="u-mar-40 u-fx-ac" v-if="tradeType === '2' && accountDetail.status === '1' && timestamp > 0">
				<u-button type="primary" class="primary-btn u-fx-ac-jc">
					<text class="u-mar-r20">继续支付</text>
					<u-count-down @end="countEnd" :show-hours="false" :timestamp="timestamp" font-size="32" separator-color="#fff" color="#fff" bg-color="#7691fa"></u-count-down>
				</u-button>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import { store, actions } from '@store';
export default {
	data() {
		return {
			tradeType: '0',
			timestamp: 600,
			accountDetail: {}
		};
	},
	components: {},
	onLoad: function(options) {
		this.tradeType = options.type;
		this.id = options.id
	},
	mounted() {
		eventBus.$on('getList', () => {
			this._getAccountInfo();
		});
		this._getAccountInfo();
	},
	methods: {
		// 账单详情
		async _getAccountInfo() {
			const res = await actions.getBillDetail({
				billNo: this.id,
				tradeType: this.tradeType
			});
			if (!res.data || res.data.length === 0) {
				return;
			}
			console.log(res.data)
			this.accountDetail = res.data;
			if(this.tradeType === '2' && res.data.status === '1'){
				let dateTime = res.data.createTime
				dateTime = res.data.createTime.replace(/-/g, '/')
				this.timestamp = parseInt((new Date(dateTime).getTime() + 10*60*1000 - new Date().getTime()) / 1000)
				console.log(this.timestamp)
			}
		},
		onBridgeReady(payParams) {
			let _self = this
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
						eventBus.$emit('getList');
						_self.$tools.goBack();
					}
				}
			);
		},
		async confirm() {
			if (this.accountDetail.payType === 'WXPAY_MINI') {
				// 微信支付
				const res = await actions.continueRecharge({
					billNo: this.accountDetail.billNo
				})
				let _self = this;
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
				// 支付宝支付
				this.$tools.navTo({
					url: `./alipay?type=1&billNo=${this.accountDetail.billNo}`
				});
			}
		},
		//倒计时结束
		countEnd() {
			this._getAccountInfo();
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh);
}
.item-list {
	padding: 25rpx 10rpx 25rpx 30rpx;
	background: $uni-bg-color;
}
.primary-btn{
	width: 100%;
	overflow: hidden;
}
.name {
	font-size: 40rpx;
}
.money {
	font-size: 60rpx;
}
.icon {
	width: 50rpx;
	height: 40rpx;
}
.u-fw-5 {
	font-weight: 500;
}
.primary {
	color: $u-type-primary;
}
.success {
	color: $u-type-success;
}
.error {
	color: $u-type-error;
}
.warning {
	color: $u-type-warning;
}
.info {
	color: $u-type-info;
}
</style>
