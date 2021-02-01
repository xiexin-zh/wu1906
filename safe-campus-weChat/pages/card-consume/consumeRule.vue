<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h detail">
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">每日消费限额：</view>
				<view class="u-fx-f1 u-mar-r10">
					<input type="digit" @input="everydayConsumeInput" class="item-input" v-model="everydayConsume" style="text-align: right;" placeholder="请输入每日消费限额" />
				</view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">单次消费限额：</view>
				<view class="u-fx-f1 u-mar-r10">
					<input type="digit" @input="singleConsumeInput" class="item-input" v-model="singleConsume" style="text-align: right;" placeholder="请输入单次消费限额" />
				</view>
			</view>
		</scroll-view>
		<view class="footer-btn u-fx-ac"><u-button @click="confirm" type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg">保存</u-button></view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus.js';
import { actions } from './store/index.js';
export default {
	data() {
		return {
			everydayConsume: 0,
			singleConsume: 0
		};
	},
	components: {},
	mounted() {
		this.singleConsume = uni.getStorageSync('accountInfo').singleConsume
		this.everydayConsume = uni.getStorageSync('accountInfo').everydayConsume
	},
	methods: {
		singleConsumeInput(event) {
			this.singleConsume = Math.floor(event.target.value * 100) / 100
		},
		everydayConsumeInput(event) {
			this.everydayConsume = Math.floor(event.target.value * 100) / 100
		},
		async confirm() {
			await actions.updateConsumeRule({
				everydayConsume: this.everydayConsume,
				singleConsume: this.singleConsume,
				userCode: uni.getStorageSync('accountInfo').userCode
			})
			this.$tools.toast('保存成功', 'success');
			this.$tools.goNext(() => {
				eventBus.$emit('getList');
				this.$tools.goBack();
			});
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
.al-r {
	text-align: right;
}
</style>
