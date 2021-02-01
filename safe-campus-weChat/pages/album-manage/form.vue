<template>
	<view>
		<scroll-view scroll-y="true" @scrolltolower="showList(true)" class="scroll-h">
			<view class="u-bd-b item-list">
				<view class="tip mar-b20">上传照片：</view>
				<view class="u-fx-f1"><an-upload-img :schoolCode="schoolCode" total="50" v-model="formData.photoList" class="upload"></an-upload-img></view>
			</view>
		</scroll-view>
		<view class="common-btn u-mar-20" @click="confirm">提交</view>
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
		this.id = this.$tools.getQuery().get('id');
	},
	async mounted() {
	},
	methods: {
		async confirm() {
			if (this.formData.photoList.length === 0) {
				this.$tools.toast('请选择图片');
				return;
			}
			const photoList = this.formData.photoList.map(el => {
				return el.url
			});
			const req = {
				albumId: this.id,
				photoSrcList: photoList,
				createUsercode: store.userInfo.userCode,
				createUsername: store.userInfo.userName
			};
			const res = await actions.addPhotos(req);
			this.$tools.toast('提交成功', 'success');
			this.$tools.goNext(() => {
				eventBus.$emit('getList');
				this.$tools.goBack();
			});
		}
	}
};
</script>

<style lang="scss">
.scroll-h {
	height: calc(100vh - 128rpx);
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
