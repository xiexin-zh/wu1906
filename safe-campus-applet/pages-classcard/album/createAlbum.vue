<template>
	<view class="createAlbum">
		<view class="u-bd-b u-padd-l20 u-padd-r20 u-padd-t u-padd-b u-fx-ac u-type-white-bg">
			<view class="u-fx-f1 u-te u-mar-r"><u-input v-model="albumName" placeholder="请输入相册主题"></u-input></view>
		</view>
		<view class="u-type-white-bg u-padd">
			<u-input :clearable="false" class="u-content-color" maxlength="100" height="200" placeholder="请输入相册描述" v-model="albumDes" type="textarea" />
			<view class="u-tx-r u-tips-color">{{ albumDes.length >= 100 ? 100 : albumDes.length }}/200</view>
		</view>
		<view class="u-mar-t u-type-white-bg">
			<upload-file ref="uploadFile" :file-list="fileList"></upload-file>
		</view>
		<view class="u-mar-40">
			<view class="primary-btn" @tap="_addAlbum">创建</view>
		</view>
		<view class="tips u-tips-color u-padd-40 u-font-01">
			温馨提示：您创建相册的同时可以上传图片，建议一次班级活动创建一个相册，方便管理和查看
		</view>
	</view>
</template>

<script>
	import eventBus from '@u/eventBus'
	import { store, actions } from '@store'
	import UploadFile from '../component/UploadFile.vue';
	export default {
		components: {
			UploadFile
		},
		data () {
			return {
				fileList: [],
				albumName: '',
				albumDes: ''
			}
		},
		methods: {
			/**
			 * @description  创建相册
			 */
			async _addAlbum () {
				if (this.albumName === '') {
					this.$tools.toast('请输入相册主题')
					return
				}
				const res = await actions.addAlbum({
					albumName: this.albumName,
					schoolYearId: store.schoolYear.id,
					schoolYear: store.schoolYear.schoolYear,
					gradeCode: store.currentBindClass.gradeCode,
					classCode: store.currentBindClass.classCode,
					teacherName: store.userInfo.userName,
					schoolCode: store.userInfo.schoolCode
				})
				if (this.$refs.uploadFile.newFileList.length === 0) {
					this.$tools.toast('创建成功')
					this.$tools.goNext(() => {
						eventBus.$emit('addAlbumOk')
						this.$tools.goBack()
					})
				} else {
					this._uploadPhoto(res.data.id)
				}
			},
			/**
			 * @description  上传图片
			 */
			async _uploadPhoto(id) {
				await actions.uploadPhoto({
					query: id,
					data: this.$refs.uploadFile.newFileList.map(item => {
						return item.annexUrl
					})
				})
				this.$tools.toast('创建成功')
				this.$tools.goNext(() => {
					eventBus.$emit('addAlbumOk')
					this.$tools.goBack()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.create-album {
		
	}
</style>
