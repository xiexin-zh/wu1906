<template>
	<view class="face u-bg-fff">
		<view class="face-view u-fx-ac-jc" v-if="baseImg === ''">
			<view @click="chooseImage"><image class="photo" src="/mobile-img/auto-face.png"></image></view>
			<view>点击上传</view>
		</view>
		<view @click="chooseImage" class="face-view u-fx-ac-jc" v-if="baseImg !== ''">
			<view class="click-photo">点击拍照</view>
			<view><image class="userPhoto" :src="baseImg"></image></view>
		</view>
		<view class="info">
			<view class="tip"><text>注意事项</text></view>
			<view>1. 请确认照片是本人</view>
			<view>2. 请确认露出清晰完整人脸部位</view>
			<view v-if="false">3. 保持光线充足，不要戴眼镜</view>
			<view v-if="false">4. 正对摄像头，不要戴帽子</view>
			<view v-if="false">5. 拍照时不要晃动，保证照片清晰度</view>
		</view>
		<view class="u-fx-ac u-fx-jsa">
			<view class="rule-list u-fx-ac-jc">
				<image class="rule-img" src="/mobile-img/zdsj.png"></image>
				<view>正对手机</view>
			</view>
			<view class="rule-list u-fx-ac-jc">
				<image class="rule-img" src="/mobile-img/gxcz.png"></image>
				<view>光线充足</view>
			</view>
			<view class="rule-list u-fx-ac-jc">
				<image class="rule-img" src="/mobile-img/fmdz.png"></image>
				<view>放慢动作</view>
			</view>
		</view>
		<view v-if="oldUrl !== baseImg" class="u-fx-jc padd-t60"><u-button type="primary" @click="uploadImg">上传照片</u-button></view>
	</view>
</template>

<script>
import { actions } from '../store/index.js';
import { store, setStore } from '../../../protal/store/index.js';
import wxApi from '@u/wxApi'
export default {
	data() {
		return {
			url: '',
			path: '',
			oldUrl: '',
			baseImg: '',
			wxApi
		};
	},
	components: {
	},
	computed: {
		userInfo: () => store.userInfo
	},
	mounted() {
		this.oldUrl = this.userInfo.photoUrl || ''
		this.baseImg = this.userInfo.photoUrl || ''
	},
	methods: {
		async uploadImg() {
			try {
				const { userCode } = this.userInfo;
				await actions.updateTeacherPhoto({
					schoolCode: this.userInfo.schoolCode,
					userCode,
					photoUrl: this.baseImg
				});
				this.oldUrl = this.baseImg;
				setStore({
					key: 'userInfo',
					data: {
						...this.userInfo,
						photoUrl: this.baseImg
					}
				});
				this.$tools.toast('上传成功', 1)
			} catch (err) {}
		},
		chooseImage() {
			this.wxApi.wxChoosePhoto(null, true, (url) => {
				this.baseImg = url
				this.uploadImg()
			})
		},
	}
};
</script>

<style lang="scss">
.face {
	.image {
		width: 200rpx;
		height: 200rpx;
		background-color: #ccc;
	}
	padding-bottom: 40rpx;
	.face-demo {
		width: 450rpx;
		height: 550rpx;
		margin: 0 auto;
		.face-demo-img {
			width: 100%;
			height: 100%;
		}
	}
	overflow: auto;
	.face-view {
		overflow: hidden;
		border: 6rpx $u-type-primary-light solid;
		width: 450rpx;
		height: 450rpx;
		margin: 50rpx auto 50rpx auto;
		border-radius: 10rpx;
		background-color: $u-type-primary-disabled;
		color: $u-type-primary;
		font-weight: bold;
		position: relative;
		.click-photo {
			position: absolute;
			width: 100%;
			height: 70rpx;
			line-height: 70rpx;
			color: $u-border-color;
			bottom: 0px;
			letter-spacing: 4rpx;
			z-index: 99;
			text-align: center;
			background: rgba(0, 0, 0, 0.4);
		}
	}
	.rule-list {
		margin-top: 30rpx;
		width: 160rpx;
		padding: 10px 0;
		color: #666;
		font-weight: bold;
		background-color: $u-type-primary-light;
		.rule-img {
			width: 40rpx;
			height: 50rpx;
			display: block;
			margin-bottom: 20rpx;
		}
	}
	.userPhoto {
		width: 450rpx;
		height: 450rpx;
		display: block;
	}
	.photo {
		width: 100rpx;
		height: 100rpx;
	}
	.info {
		color: $u-content-color;
		line-height: 60rpx;
		text-indent: 30rpx;
		font-size: 24rpx;
		.tip {
			color: $u-type-error;
			font-size: 28rpx;
			font-weight: bold;
		}
		.tip-demo {
			font-size: 22rpx;
			color: $u-type-warning;
			font-weight: bold;
		}
	}
	.padd-t60 {
		padding-top: 60rpx;
	}
}
</style>
