<template>
	<scroll-view scroll-y="true" class="scroll-h u-bg-fff">
		<view class="u-fx-ac u-bd-b item-list">
			<view class="tip">姓名：</view>
			<view class="u-fx-f1 u-fx-je"><input class="item-input" v-model="formData.userName" placeholder="请输入姓名" /></view>
		</view>
		<view class="u-fx-ac u-bd-b item-list">
			<view class="tip">手机号：</view>
			<view class="u-fx-f1 u-fx-je"><input class="item-input" v-model="formData.phone" placeholder="请输入手机号" /></view>
		</view>
		<view class="u-bd-b item-list">
		  <view class="tip">上传头像：</view>
		  <view class="u-fx-f1 u-mar-t">
				<video-upload
					class="u-fx-f1"
					isCheck
					:schoolCode="schoolCode"
					 types="image"
					:uploadCount="1"
					:upload_max="10"
					@success="success"
				></video-upload>
		  </view>
		</view>
		<view class="btn-mar">
			<u-button type="primary" @click="sign">提交</u-button>
		</view>
		<u-modal v-model="show" :zoom="show" :show-title="false" :show-confirm-button="false">
			<view class="slot-content">
				<view class="u-fx-ac-jc success">
					<image src="http://canpointtest.com/mobile-img/sign_in.png" mode=""></image>
					<text>提交成功</text>
				</view>
			</view>
		</u-modal>
	</scroll-view>
</template>

<script>
import { store, actions } from './store/index.js'
export default {
	data() {
		return {
			id: 0,
			schoolCode: '',
			formData: {
				userName: '',
				phone: '',
				base64Url: ''
			},
			show: false
		}
	},
	async mounted() {
		this.id = this.$tools.getQuery().get('id');
		this.schoolCode = this.$tools.getQuery().get('schoolCode');
	},
	methods: {
		success(e) {
			this.formData.base64Url = e.url
		},
		async sign () {
			for (let key in this.formData) {
				if (!this.formData[key]) {
					this.$tools.toast('请填写完整信息')
					return
				}
			}
			var reg = /^1[3456789]\d{9}$/;
			if (!reg.test(this.formData.phone)) {
				this.$tools.toast('请输入正确手机号')
				return
			}
			await actions.signInById({
				...this.formData,
				placeReserveId: this.id
			})
			this.show = true
		}
	}
};
</script>

<style lang="scss">
.scroll-h {
	height: 100vh;
}
.item-list {
	padding: 25rpx 15rpx 25rpx 25rpx;
	.tip::before {
		position: absolute;
		z-index: 99;
		content: '*';
		top: 30rpx;
		color: red;
		font-weight: bold;
		left: 8rpx;
	}
}
.item-input {
	width: 100%;
	font-size: 26rpx;
	text-align: right;
	color: $u-content-color;
}
.btn-mar {
	position: fixed;
	bottom: 0;
	width: calc(100% - 40rpx);
	margin: 40rpx 20rpx;
}
.success{
	padding: 60rpx;
	image{
		width: 160rpx;
		height: 160rpx;
		margin-bottom: 20rpx;
	}
}
</style>
