<template>
	<view class="u-page">
		<view class="detail">
			<view class="top u-fx-jsb">
				<view class="info u-fx-ac">
					<image :src="comeLog.visitorUrl ? comeLog.visitorUrl :errorImg" alt="">
					<view class="u-fx-ver">
						<text class="name">{{ visitorName }}</text>
						<text class="phone">{{ visitorPhone }}</text>
						<text class="times">{{ comeLog.causeName }}</text>
					</view>
				</view>
				<view class="state u-fx">
					<view class="trigon">
					</view>
					<text :class="state === '2' ? 'refuse' : state === '1' ? 'agree' : state === '0' ? 'wait' : 'cancel'">{{ state | visitApproveState }}</text>
				</view>
			</view>
			<view class="log u-fx-jsb">
				<view class="u-fx-ver">
					<view class="start u-fx-ac">
						<text>到</text>
						<text>{{ comeLog.accessStartTime }}</text>
					</view>
				</view>
				<view class="u-fx-ver">
					<view class="end u-fx-ac">
						<icon type="info" size="24" />
						<view class="mar-l20">随行人数：{{ comeLog.togetherNum || 0 }}</view>
					</view>
				</view>
			</view>
			<view v-if="refuseTag || state == '2'" class="log u-fx-jsb">
				<view class="start u-fx-ac">
					<icon type="cancel" size="24" />
					<text class="mar-l20">拒绝原因：{{ comeLog.reason }}</text>
				</view>
			</view>
		</view>
		<view v-if="state == '0'" class="submit-box u-fx">
			<view class="btn1" @click="open">审批不通过</view>
			<view class="btn2" @click="clickConfirm">审批通过</view>
		</view>
		<u-modal v-model="showTag" show-cancel-button @confirm="sure(0)" title="请输入拒绝原因">
			<view class="pop u-fx-ver u-mar-l20 u-mar-r20">
				<input class="u-border-radius" v-model="refuseText" focus placeholder="" />
			</view>
		</u-modal>
	</view>
</template>

<script>
import { store, actions } from '../store/index.js';
export default {
	data() {
		return {
			errorImg: '/mobile-img/person-auto.png',
			showTag: false,
			refuseTag: false,
			refuseText: '',
			id: '',
			visitorName: '',
			visitorCode: '',
			visitorPhone: '',
			causeName: '',
			state: '',
			comeLog: {
				accessStartTime: '',
				accessEndTime: '',
				togetherNum: '0',
				duration: '',
				reason: '',
				visitorUrl: '',
				resUrl: ''
			}
		};
	},
	async mounted() {
		this.id = this.$tools.getQuery().get('id')
		this.showDetail()
	},
	methods: {
		async showDetail(){
			const res = await actions.getInviteDetail(this.id);
			if (!res.data) {
				return;
			}
			this.comeLog = res.data;
			this.visitorName = res.data.visitorName;
			this.visitorCode = res.data.visitorCode;
			this.visitorPhone = res.data.visitorMobile;
			this.causeName = res.data.causeName;
			this.reason = res.data.reason;
			this.state = res.data.state;
			this.refuseTag = this.state === '2';
		},
		clickCancel() {
			this.showTag = false;
		},
		clickConfirm() {
			this.$tools.confirm(`确定同意吗?`, () => {
				const req = {
					id: this.id,
					state: '1',
					visitorCode: this.visitorCode,
					visitorName: this.visitorName,
					visitorMobile: this.visitorPhone,
					schoolCode: store.userInfo.schoolCode,
					type: 0,
					openid: store.openid
				};
				console.log(req);
				actions.approval(req).then(res => {
					this.$tools.toast('操作成功', 'success');
					this.$tools.goNext(() => {
						this.showDetail()
					});
				});
			});
		},
		open() {
			this.showTag = true
		},
		sure() {
			this.$tools.confirm(`确定拒绝吗?`, () => {
				console.log(this.refuseText);
				this.refuseTag = true;
				const req = {
					id: this.id,
					state: '2',
					visitorCode: this.visitorCode,
					visitorName: this.visitorName,
					visitorMobile: this.visitorPhone,
					schoolCode: store.userInfo.schoolCode,
					reason: this.refuseText,
					type: 0,
					openid: store.openid
				};
				console.log(req);
				actions.approval(req).then(res => {
					this.$tools.toast('操作成功', 'success');
					this.refuseText = '';
					this.$tools.goNext(() => {
						this.showDetail()
					});
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.detail {
	padding: 0 20rpx;
	.scroll-h {
		height: calc(100vh - 500rpx);
	}
	.top {
		width: 100%;
		height: 362rpx;
		background: url('http://canpointtest.com/mobile-img/person-bg.png') no-repeat;
		background-size: 100% 362rpx;
		margin: 20rpx 0 40rpx 0;
		color: #fff;
		.state {
			margin: 30rpx 30rpx 0 0;
			font-size: 28rpx;
			height: 60rpx;
			line-height: 60rpx;
			.trigon {
				border-width: 30rpx 20rpx 30rpx 0;
				border-style: solid;
				border-color: transparent #fff transparent transparent;
				position: relative;
			}
			text {
				background-color: #fff;
				padding: 0 20rpx;
			}
		}
		.info {
			margin: 0 0 0 10%;
			height: 300rpx;
			image {
				width: 160rpx;
				height: 160rpx;
				margin-right: 38rpx;
				background: rgba(255, 255, 255, 0.6);
				padding: 6rpx;
				border-radius: 100%;
			}
			text {
				margin-bottom: 10rpx;
			}
			.name {
			}
			.phone {
			}
		}
	}
	.log {
		background: #fff;
		padding: 40rpx 20rpx;
		margin: 20rpx 0 40rpx 0;
		border: 1px solid $u-border-color;
		border-radius: 16rpx;
		box-shadow: 2rpx 2rpx 1rpx 1rpx $u-border-color;
		.start,
		.end {
			margin: 10rpx 0;
			text:first-child {
				border: 1rpx solid $u-type-primary;
				padding: 6rpx 12rpx;
				border-radius: 100%;
				margin-right: 20rpx;
			}
		}
		.sub-title {
			font-size: 24rpx;
			color: $u-content-color;
		}
	}
}
.submit-box {
	height: 100rpx;
	width: 100%;
	position: fixed;
	bottom: 0;
	.btn1 {
		width: 50%;
		line-height: 100rpx;
		text-align: center;
		letter-spacing: 8rpx;
		background-color: #fff;
		color: #000;
		border-radius: $u-border-radius;
	}
	.btn2 {
		width: 50%;
		line-height: 100rpx;
		text-align: center;
		letter-spacing: 8rpx;
		background-color: $u-type-primary;
		color: #fff;
		border-radius: $u-border-radius;
	}
}
.pop {
	text-align: center;
	.title {
		padding: 20rpx 0 0 0;
	}
	input {
		border: 1rpx solid #ddd;
		margin: 20rpx 0;
	}
	.btn {
		padding: 0 20rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		letter-spacing: 8rpx;
		background-color: $u-type-primary;
		color: #fff;
	}
}
/deep/ uni-input {
	line-height: 2.1em;
	height: 2.1em;
	min-height: 2.1em;
}
.togethernum {
	/deep/ uni-input {
		line-height: 1.4em;
		height: 1.4em;
		min-height: 1.4em;
		max-width: 60rpx;
		.uni-input-input {
			padding: 0 10rpx;
			border: 1rpx solid #ddd;
			border-radius: 4rpx;
		}
	}
}
</style>
