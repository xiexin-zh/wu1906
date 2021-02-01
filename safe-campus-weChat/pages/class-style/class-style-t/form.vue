<template>
	<view>
		<scroll-view scroll-y="true" @scrolltolower="showList(true)" class="scroll-h">
			<view class="u-fx-ac u-bd-b item-list" v-if="type === '0'">
				<view class="tip">相册名称：</view>
				<view class="u-fx-f1"><input class="item-input al-r" maxlength="10" v-model="formData.albumName" placeholder="请输入" /></view>
			</view>
			<view class="u-bd-b item-list" v-if="type === '1'">
				<view class="tip mar-b20">上传附图：</view>
				<view class="u-fx-f1"><an-upload-img total="50" :schoolCode="schoolCode" v-model="formData.photoList" class="upload"></an-upload-img></view>
				<view class="u-light-color mar-t20">每个相册最多保存50张照片。</view>
			</view>
		</scroll-view>
		<view class="common-btn" @click="confirm">提交</view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import anUploadImg from '@/components/an-uploadImg/an-uploadImg';
import { store, actions } from './store/index.js';
export default {
	components: {
		anUploadImg
	},
	data() {
		return {
			type: '',
			id: '',
			classCode: '',
			schoolYearId: '',
			canSubmit: true,
			formData: {
				albumName: '',
				photoList: []
			}
		};
	},
	computed: {
		schoolCode: () => store.userInfo.schoolCode
	},
	created() {
		this.type = this.$tools.getQuery().get('type');
		this.id = this.$tools.getQuery().get('id');
		this.schoolYearId = uni.getStorageSync("classInfo").schoolYearId;
		this.classCode = uni.getStorageSync("classInfo").classCode;
		console.log(this.classCode)
	},
	async mounted() {
	},
	methods: {
		async confirm() {
			if(!this.canSubmit){
				return
			}
			this.canSubmit = false
			if (this.type === '0') {
				console.log(this.formData.albumName)
				if (this.formData.albumName == '') {
					this.$tools.toast('请填写相册名称');
					this.canSubmit = true
					return
				}
				const req = {
					schoolCode: store.userInfo.schoolCode,
					albumName: this.formData.albumName,
					schoolYearId: this.schoolYearId,
					classCode: this.classCode
				};
				console.log(req, 2222);
				const res = await actions.addNewAlbum(req);
				this.$tools.toast('提交成功', 'success');
				this.$tools.goNext(() => {
					this.canSubmit = true
					eventBus.$emit('getList');
					this.$tools.goBack();
				});
			} else {
				if(this.formData.photoList.length === 0){
					this.$tools.toast('请选择图片');
					this.canSubmit = true
					return
				}
				const photoList = this.formData.photoList.map(el => {
					return el.url
				});
				let urlList = []
				photoList.forEach(item => {
					urlList.push(item)
				})
				const req = {
					query: this.id + '/' + store.userInfo.schoolCode,
					data: urlList
				}
				const res = await actions.addPhotos(req);
				this.$tools.toast('提交成功', 'success');
				this.$tools.goNext(() => {
					this.canSubmit = true
					eventBus.$emit('getList');
					this.$tools.goBack();
				});
			}
		}
	}
};
</script>

<style lang="scss">
.scroll-h {
	height: calc(100vh - 88rpx);
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
