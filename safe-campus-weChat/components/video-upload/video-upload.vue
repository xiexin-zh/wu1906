<template>
	<view>
		<view class="upload">
			<view v-if="uploads.length < uploadCount && !disabled" class="an-img-add u-fx-ac-jc" @tap="chooseUploads">+</view>
			<block v-for="(upload, index) in uploads" :key="index">
				<view :class="desTag ? 'uplode-file uplode-file-des' : 'uplode-file'">
					<image v-if="types == 'image'" class="uploade-img" :src="upload.url || upload" :data-src="upload" @tap="previewImage($event, index)"></image>
					<image v-if="types == 'image' && !disabled" class="clear-one-icon" :src="clearIcon" @tap="delImage(upload, index)"></image>
					<view v-if="desTag" class="u-fx-ac-jc u-mar-10">
						<u-button v-if="upload.photoDes === '添加描述'" @click="addPhotoDes(index)" type="primary" size="mini" plain shape="circle">添加描述</u-button>
						<text v-else class="u-tips-color u-te">{{ upload.photoDes }}</text>
					</view>
					<video v-if="types == 'video'" class="uploade-video" :src="upload.url" controls enable-play-gesture>
						<cover-image v-if="types == 'video' && !disabled" class="clear-one-icon" :src="clearIcon" @tap="delImage(upload, index)"></cover-image>
					</video>
				</view>
			</block>
		</view>
		<u-modal v-model="showTag" :show-title="false" show-cancel-button @confirm="confirm">
			<view class="u-fx-ver u-mar-t20 u-mar-r20 u-mar-l20"><u-input v-model="photoDes" maxlength="10" type="text" :border="true" placeholder="请输入照片描述" /></view>
			<view class="u-tips-color u-font-02 u-mar-t20 u-mar-l20 u-padd-l10">提示：添加描述后，不可修改。</view>
		</u-modal>
	</view>
</template>

<script>
	import wxApi from '@u/wxApi'
export default {
	components: {
	},
	props: {
		types: {
			type: String,
			default: 'image'
		},
		desTag: {
			//描述
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		value: {
			type: Array,
			default: function() {
				return [];
			}
		},
		clearIcon: {
			//删除图标
			type: String,
			default: 'http://canpointtest.com/mobile-img/deletephoto.png'
		},
		isCheck: {
			//人脸识别
			type: Boolean,
			default: false
		},
		uploadIcon: {
			type: String,
			default: ''
		},
		uploadUrl: {
			//接口地址
			type: String,
			default: 'http://canpointtest.com:8090/ossApi/upload-oss-file'
		},
		uploadCount: {
			//上传数量
			type: Number,
			default: 1
		},
		upload_max: {
			//上传内容大小 默认3M
			type: Number,
			default: 3
		},
		schoolCode: {
			//接口地址
			type: String,
			default: ''
		}
	},
	computed: {
		uploads: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		}
	},
	data() {
		return {
			wxApi,
			// 超出限制数组
			exceeded_list: [],
			successTag: false,
			showTag: false,
			photoDes: ''
		};
	},
	mounted() {
		console.log(this.uploads);
		uni.$on('uAvatarCropper', path => {
			this.$tools.checkPhoto(path, url => {
				this.uploads.unshift({url});
				this.$emit('success', {url});
			})
		})
	},
	methods: {
		previewImage(e, index) {
			uni.previewImage({
				current: index,
				urls: this.uploads.map(el => {
					return el.url || el;
				})
			});
		},
		addPhotoDes(index) {
			this.photoIndex = index;
			this.showTag = true;
		},
		confirm() {
			this.uploads[this.photoIndex].photoDes = this.photoDes;
			this.photoDes = '';
		},
		chooseUploads() {
			switch (this.types) {
				case 'image':
				if(this.isCheck){
					this.wxApi.wxChoosePhoto(null, true)
				}else {
					console.log(123)
					this.wxApi.wxChoosePhoto(res => {
						console.log(res)
						if (this.desTag) {
							res.photoDes = '添加描述';
						}
						if (this.uploads.length >= this.uploadCount) {
							this.$tools.toast(`图片数量不能超过${this.uploadCount}张`);
							return;
						}
						this.uploads.unshift(res);
						this.$emit('success', res);
						this.$emit('progress', true);
					});
				}
					break;
				case 'video':
					uni.chooseVideo({
						sourceType: ['camera', 'album'],
						success: res => {
							console.log(res);
							if (Math.ceil(res.size / 1024) < this.upload_max * 1024) {
								uni.showLoading({
									title: '上传中'
								});
								this.$emit('progress', false);
								const fileType = res.tempFile.name.split('.')[1];
								this.$tools.ossUpload(this.schoolCode, res.tempFilePath, fileType, res => {
									console.log(res); // 直接返回路径
									if (res.code === 200) {
										uni.hideLoading();
										this.successTag = true;
										this.uploads.unshift(res.data);
										this.$emit('success', res.data);
										this.$emit('progress', true);
									} else {
										this.$tools.toast(res.data);
									}
								});
							} else {
								uni.showModal({
									title: '提示',
									content: `限制视频大小${this.upload_max}MB，该视频已超出`
								});
							}
						},
						fail: err => {
							uni.showModal({
								content: JSON.stringify(err)
							});
						}
					});
					break;
			}
		},
		delImage(item, index) {
			this.$tools.delTip('确定删除吗？', () => {
				const i = this.uploads.findIndex(list => {
					return list.url === item.url;
				});
				this.$emit('delImage', this.uploads[i]);
				uni.hideLoading();
				this.uploads.splice(index, 1);
			});
		}
	}
};
</script>

<style scoped>
.an-img-add {
	float: left;
	font-size: 60rpx;
	margin: 10rpx;
	height: 210upx;
	width: calc(33.3% - 20rpx);
	color: #666;
	background-color: #c8c7cc;
	line-height: 210upx;
}
.upload {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.uplode-file {
	margin: 10rpx;
	width: calc(33.3% - 20rpx);
	height: 210rpx;
	position: relative;
}
.uplode-file-des {
	height: 280rpx;
}
.uploade-img {
	display: block;
	width: 100%;
	height: 210rpx;
}
.uploade-video {
	display: block;
	max-width: 650rpx;
	max-height: 450rpx;
}
.clear-one {
	position: absolute;
	top: -10rpx;
	right: 0;
}
.clear-one-icon {
	position: absolute;
	width: 20px;
	height: 20px;
	top: -10rpx;
	right: -10rpx;
	z-index: 9;
}
</style>
