<template>
	<view class="photo-list">
		<u-popup z-index="100" v-model="isUpdate" mode="bottom" height="100%">
			<view class="u-fx-ac u-padd-20 u-bd-b u-type-white-bg">
				<text>相册名称：</text>
				<view class="u-fx-f1 u-tx-r u-content-color"><u-input v-model="newName" placeholder="请输入相册名称"></u-input></view>
				<view class="rit-arrow"></view>
			</view>
			<view class="u-padd-40 u-fx">
				<view class="second-btn u-mar-t40 u-fx-f1" @tap="isUpdate = false">取消</view>
				<view class="primary-btn u-fx-f1 u-mar-t40 u-mar-l40" @tap="_updataAlbum">保存</view>
			</view>
			<view class="del-btn" @tap="_delAlbum">删除相册</view>
		</u-popup>
		<u-popup z-index="100" v-model="isUpload" mode="bottom" height="100%">
			<view class="u-padd-30 u-bd-b">
				<view>上传到：{{ albumName }}</view>
			</view>
			<view><upload-file ref="uploadFile" :file-list="fileList"></upload-file></view>
			<view class="u-padd-40 u-fx">
				<view class="second-btn u-mar-t40 u-fx-f1" @tap="isUpload = false">取消</view>
				<view class="primary-btn u-fx-f1 u-mar-t40 u-mar-l40" @tap="uploadPhoto">上传到相册</view>
			</view>
		</u-popup>
		<view v-if="isEdit" class="edit-bottom u-fx-ac u-font-01">
			<view class="u-fx-f1 u-tx-c u-bd-r" @tap="_setCover"><view>设为轮播图(班牌显示)</view></view>
			<view class="u-fx-f1 u-tx-c" @tap="_delPhoto">删除</view>
		</view>
		<view v-if="!isEdit" class="add-photo" @tap="isUpload = true">
			<u-image border-radius="100%" src="http://canpointtest.com/mini-img/auto-camera.png" height="100rpx" width="100rpx"></u-image>
		</view>
		<view class="photo-cover">
			<u-image width="100%" height="400rpx" :src="coverImg"></u-image>
			<view class="cover-info u-fx-ac u-type-white">
				<view class="u-fx-f1">
					<text class="u-bold u-te">{{ albumName }}</text>
					<view class="u-mar-t10 u-font-01">
						<text>{{ photoTotal }}张照片</text>
						<text class="u-padd-l">{{ VideoTotal }}个视频</text>
					</view>
				</view>
				<view class="u-fx-ac u-font-01">
					<u-icon class="u-mar-r10" @tap="isUpdate = true" size="30" color="#ff0" name="edit-pen"></u-icon>
					<view @tap="isUpdate = true">编辑相册</view>
					<u-icon class="u-mar-l40 u-mar-r10" @tap="managePhoto" size="30" color="#ff0" name="more-circle"></u-icon>
					<view class="" @tap="managePhoto">{{ isEdit ? '取消管理' : '批量管理' }}</view>
				</view>
			</view>
		</view>
		<view class="u-padd-t30">
			<no-data v-if="photoList.length === 0" msg="还未上传相片哦,赶紧上传分享吧~"></no-data>
			<view v-for="(photo, index) in photoList" :key="photo.id" class="photo-img" @tap="showImg(photo.id, index)">
				<view v-if="isEdit" :class="['check-icon', { act: checkListId.indexOf(photo.id) > -1 }]"></view>
				<u-image v-if="photo.fileType !== 'video'" :src="photo.photoSrc" width="100%" height="250rpx"></u-image>
				<u-image v-else src="http://canpointtest.com/mini-img/auto-video.png" width="100%" height="250rpx"></u-image>
			</view>
		</view>
	</view>
</template>

<script>
import UploadFile from '../component/UploadFile.vue';
import eventBus from '@u/eventBus';
import NoData from '../component/NoData.vue'
import { actions } from '@store';
export default {
	components: {
		NoData,
		UploadFile
	},
	data() {
		return {
			newName: uni.getStorageSync('albumName'),
			albumName: uni.getStorageSync('albumName'),
			photoTotal: 0,
			VideoTotal: 0,
			coverImg: 'http://canpointtest.com/mini-img/auto-camera.png',
			isEdit: false,
			isUpdate: false,
			checkListId: [],
			fileList: [],
			isUpload: false,
			photoList: []
		};
	},
	mounted() {
		this._getPhotoList();
	},
	methods: {
		async _getPhotoList() {
			const res = await actions.getPhotoList({
				query: uni.getStorageSync('albumId')
			});
			this.photoList =
				res.data.list.map(ele => {
					return {
						...ele,
						fileType: this.getFileType(ele.photoSrc)
					};
				}) || [];
			this.photoTotal = res.data.list.length;
			if (res.data.list.length > 0) {
				this.coverImg = res.data.list[0].photoSrc;
			}
		},
		getFileType(url) {
			let fileType = url.split('.')[url.split('.').length - 1];
			if (fileType && 'mp4|ogg|webm'.toLowerCase().indexOf(fileType.toLowerCase()) !== -1) {
				return 'video';
			} else if ('jpeg|gif|jpg|png|bmp|pic|svg|'.toLowerCase().indexOf(fileType.toLowerCase()) !== -1) {
				return 'image';
			}
		},
		async uploadPhoto() {
			if (this.$refs.uploadFile.newFileList.length === 0) {
				this.$tools.toast('请上传照片');
				return;
			}
			const res = await actions.uploadPhoto({
				query: uni.getStorageSync('albumId'),
				data: this.$refs.uploadFile.newFileList.map(item => {
					return item.annexUrl;
				})
			});
			this.$tools.toast('上传成功');
			this.$tools.goNext(() => {
				this.isUpload = false;
				this._getPhotoList();
			});
		},
		managePhoto() {
			if (this.photoList.length === 0) return;
			this.isEdit = !this.isEdit;
		},
		/**
		 * @description  更新相册
		 */
		async _updataAlbum() {
			await actions.updateAlbum({
				albumName: this.newName,
				id: uni.getStorageSync('albumId')
			});
			this.$tools.toast('更新成功');
			this.$tools.goNext(() => {
				this.albumName = this.newName;
				this.isUpdate = false;
			});
		},
		/**
		 * @description  删除相册
		 */
		_delAlbum() {
			this.$tools.delTip('确定删除相册吗？删除后不可恢复', async () => {
				try {
					this.$tools.showLoading('删除中...');
					await actions.delAlbumById(uni.getStorageSync('albumId'));
					this.$tools.toast('删除成功');
					this.$tools.goNext(() => {
						eventBus.$emit('addAlbumOk');
						this.$tools.goBack();
					});
				} catch (err) {
					console.log(err);
				}
			});
		},
		/**
		 * @description 删除照片
		 */
		_delPhoto() {
			if (this.checkListId.length === 0) {
				this.$tools.toast('请选择照片');
				return;
			}
			this.$tools.delTip('您确定删除选中的照片吗?', async () => {
				this.$tools.showLoading('删除中');
				await actions.delPhoto(this.checkListId);
				this.$tools.toast('删除成功');
				this.isEdit = false;
				this.$tools.goNext(() => {
					this.checkListId = [];
					this._getPhotoList();
				});
			});
		},
		/**
		 * @description 轮播设置
		 */
		async _setCover() {
			if (this.checkListId.length === 0) {
				this.$tools.toast('请选择照片');
				return;
			}
			this.$tools.showLoading('设置中...');
			await actions.setCover({
				ids: this.checkListId,
				albumId: uni.getStorageSync('albumId')
			});
			this.$tools.toast('设置成功');
			this.checkListId = [];
			this.isEdit = false;
		},
		showImg(id, index) {
			if (this.isEdit) {
				if (this.checkListId.indexOf(id) === -1) {
					this.checkListId.push(id);
				} else {
					const _index = this.checkListId.findIndex(item => item.id === id);
					this.checkListId.splice(_index, 1);
				}
			} else {
				/* uni.previewImage({
					urls: [url]
				}); */
				uni.setStorageSync('imgPreviewPicList', this.photoList);
				this.$tools.navTo({
					url: './imgPreview?index=' + index
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.photo-list {
	.edit-bottom {
		position: fixed;
		width: 100%;
		height: 100rpx;
		z-index: 9;
		bottom: 0rpx;
		left: 0rpx;
		background-color: #fff;
	}
	.del-btn {
		position: absolute;
		z-index: 99;
		bottom: 20rpx;
		width: 80%;
		left: 50%;
		margin-left: -40%;
		border: 1px $u-type-error solid;
		color: $u-type-error;
		border-radius: 100rpx;
		height: 88prx;
		line-height: 88rpx;
		text-align: center;
	}
	.add-photo {
		position: fixed;
		width: 100rpx;
		height: 100rpx;
		z-index: 9;
		bottom: 40rpx;
		right: 40rpx;
	}
	.photo-cover {
		box-shadow: 0 0px 6px #ddd;
		height: 400rpx;
		position: relative;
		.cover-info {
			padding: 0 30rpx;
			background: rgba(0, 0, 0, 0.6);
			position: absolute;
			height: 100rpx;
			width: 100%;
			z-index: 9;
			bottom: 0rpx;
			left: 0rpx;
		}
	}
	.photo-img {
		box-shadow: 2px 2px 4rpx #ddd;
		float: left;
		margin-bottom: 30rpx;
		width: 30%;
		margin-left: 2.5%;
		height: 250rpx;
		background-color: #ffff;
		position: relative;
		.check-icon {
			position: absolute;
			z-index: 9;
			top: 10rpx;
			right: 10rpx;
			width: 48rpx;
			height: 48rpx;
			background: url(http://canpointtest.com/mini-img/auto-no-check.png) no-repeat;
			background-size: 48rpx 48rpx;
			&.act {
				background: url(http://canpointtest.com/mini-img/choose-ok.png) no-repeat;
				background-size: 48rpx 48rpx;
			}
		}
	}
}
</style>
