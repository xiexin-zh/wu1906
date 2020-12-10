<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h u-padd-b20">
			<view class="publish-wrap u-bg-fff">
				<view class="input-box u-padd-20 u-bd-b"><textarea class="area-top u-font-01" maxlength="100" placeholder="这一刻的想法..." v-model="content"></textarea></view>
				<view class="img-box">
					<view class="u-font-1 u-padd-20">{{ type === '0' ? '上传图片（最多9张）' : '上传视频（最多1个）' }}</view>
					<upload-file ref="uploadFile" :file-list="fileList" :max="type === '0' ? 9 : 1" :type="type === '0' ? 'image' : 'video'" @upLoadOK="upLoadOK"></upload-file>
				</view>
			</view>
			<view class="u-mar-40">
				<u-button @click="confirm" type="primary" class="primary-btn">发表</u-button>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import UploadFile from '../component/UploadFile.vue';
import eventBus from '@u/eventBus';
import { store, actions } from '@store';
export default {
	components: {
		UploadFile
	},
	data() {
		return {
			type: '',
			fileList: [],
			content: '',
			upLoadType: true
		};
	},
	computed: {
		userInfo: () => store.userInfo,
		currentUserType: () => store.currentUserType,
		currentBindClass: () => store.currentBindClass,
		currentBindStudent: () => store.currentBindStudent
	},
	onLoad: function (options) {
		this.type = options.type;
	},
	async mounted() {},
	methods: {
		upLoadOK(val) {
			this.upLoadType = val;
		},
		async confirm() {
			if (!this.upLoadType) {
				this.$tools.toast('上传中,请稍候');
				return;
			}
			let attachList = [];
			attachList = this.$refs.uploadFile.newFileList.map(item => {
				return {
					schoolCode: this.userInfo.schoolCode,
					type: this.type === '0' ? '1' : '2',
					url: item.annexUrl
				};
			});
			console.log(attachList);
			if (this.content === '' && attachList.length === 0) {
				this.$tools.toast('请发布动态');
				return;
			}
			const req = {
				momentsMsg: this.content,
				category: this.currentUserType === '16' ? '3' : '1',
				createUsercode: this.userInfo.userCode,
				createUsername: this.userInfo.userName,
				photoUrl: this.currentUserType === '16' ? this.currentBindStudent.photoUrl : this.userInfo.photoUrl,
				schoolCode: this.userInfo.schoolCode,
				classCode: this.currentUserType === '16' ? this.currentBindStudent.classCode : this.currentBindClass.classCode,
				className: this.currentUserType === '16' ? this.currentBindStudent.className : this.currentBindClass.className,
				gradeCode: this.currentUserType === '16' ? this.currentBindStudent.gradeCode : this.currentBindClass.gradeCode,
				gradeName: this.currentUserType === '16' ? this.currentBindStudent.gradeName : this.currentBindClass.gradeName,
				attachList
			};
			if (this.currentUserType === '16') {
				req.childrenCode = this.currentBindStudent.userCode;
				req.childrenName = this.currentBindStudent.userName;
				req.relationship = this.currentBindStudent.relationship;
			}
			console.log(req, 2222);
			const res = await actions.addNewMoment(req);
			this.$tools.toast('发布成功', 'success');
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
	height: calc(100vh);
}
.publish-wrap {
	.input-box {
		.area-top {
			width: 100%;
			min-height: 300rpx;
			caret-color: $uni-color-success;
		}
	}
}
</style>
