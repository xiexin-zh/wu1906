<template>
	<view class="an-uploadImg-group">
		<view class="an-img" v-for="(item, index) in imgBase64List" :key="index">
			<u-lazy-load class="upload-icon" :image="item.url ? item.url : item" @click="perviewImg(index)"></u-lazy-load>
			<view class="an-icon-close" v-if="!disabled" @click.stop="handleRemove(index)"><view class="del">-</view></view>
		</view>
		<view v-if="imgBase64List.length < total && !disabled" class="an-img-add u-fx-ac-jc" @click="chooseImage">+</view>
	</view>
</template>

<script>
import wxApi from '@u/wxApi';
export default {
	name: 'AnUploadImg',
	components: {},
	props: {
		total: {
			type: Number | String,
			default: 3
		},
		value: {
			type: Array,
			default: () => {
				return [];
			}
		},
		disabled: {	//禁用图片上传删除功能
			type: Boolean,
			default: false
		},
		isCheck: {	//启用人脸识别功能
			type: Boolean,
			default: false
		}
	},
	computed: {
		imgBase64List: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		}
	},
	mounted() {
		if (this.isCheck) {
			uni.$on('uAvatarCropper', path => {
				this.$tools.checkPhoto(path, url => {
					this.imgBase64List.push({ url });
				});
			});
		}
	},
	data() {
		return {
			wxApi
		};
	},
	methods: {
		chooseImage() {
			if (this.isCheck) {
				this.wxApi.wxChoosePhoto(null, true);
			} else {
				this.wxApi.wxChoosePhoto(res => {
					this.imgBase64List.push(res);
				});
			}
		},
		perviewImg(index) {
			uni.previewImage({
				current: index,
				indicator: 'default',
				urls: this.imgBase64List.map(el => {
					return el.url ? el.url : el;
				})
			});
		},
		handleRemove(index) {
			this.imgBase64List.splice(index, 1);
		}
	}
};
</script>

<style lang="scss">
.an-uploadImg-group {
	overflow: auto;
	height: 100%;
	flex-wrap: wrap;
}
.an-img {
	float: left;
	margin: 10rpx;
	position: relative;
}
.an-img-add {
	float: left;
	font-size: 60rpx;
	margin: 10rpx;
	height: 160rpx;
	width: 160rpx;
	color: #666;
	background-color: #c8c7cc;
	line-height: 160rpx;
}
.upload-icon {
	height: 160rpx;
	width: 160rpx;
	display: block;
}
.an-icon-close {
	width: 36rpx;
	height: 36rpx;
	position: absolute;
	right: 0rpx;
	top: 5rpx;
	.del {
		color: #fff;
		height: 36rpx;
		width: 36rpx;
		font-weight: blod;
		line-height: 30rpx;
		text-align: center;
		border-radius: 100%;
		background-color: #555555;
	}
}
</style>
