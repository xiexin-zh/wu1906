<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h u-bg-fff u-padd-b20">
			<view class="publish-wrap">
				<view class="input-box u-padd-20 u-bd-b"><textarea class="area-top u-font-01" maxlength="100" placeholder="这一刻的想法..." v-model="formData.content"></textarea></view>
				<view class="img-box">
					<view class="u-font-1 u-padd-20">{{ type === '1' ? '上传图片（最多9张）' : '上传视频（最多1个）' }}</view>
					<video-upload
						class="u-fx-f1 u-padd-l20 u-padd-r10 u-padd-b20"
						:schoolCode="userInfo.schoolCode"
						:types="type === '1' ? 'image' : 'video'"
						:uploadCount="type === '1' ? 9 : 1"
						:upload_max="500"
						@success="success"
						@delImage="delImage"
						@progress="progress"
					></video-upload>
				</view>
			</view>
		</scroll-view>
		<view class="footer-btn u-fx-ac">
			<u-button
				@click="confirm"
				:type="upLoadType === true ? 'primary' : ''"
				:class="upLoadType === true ? 'u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg' : 'u-fx-f1 u-mar-l u-mar-r u-type-info-dark-bg'"
			>
				发表
			</u-button>
		</view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import { store, actions } from './store/index.js';
import hostEnv from '../../config/index.js';
import vConsole from 'vconsole'
export default {
	components: {},
	data() {
		return {
			formData: {
				content: '',
				uploadUrl: '',
				photoList: [],
				videoList: [],
				type: ''
			},
			upLoadType: true
		};
	},
	computed: {
		userInfo: () => store.userInfo 
	},
	created() {
		new vConsole()
		// this.uploadUrl = `${hostEnv.protal_api_11009}/study/theme/file/uploadFile?schoolCode=${store.userInfo.schoolCode}`;
		this.type = this.$tools.getQuery().get('type');
		this.userType = this.$tools.getQuery().get('category');
	},
	async mounted() {
		console.log(uni.getStorageSync('bindInfo'));
	},
	methods: {
		success(e) {
			console.log(e);
			if (this.type === '1') {
				this.formData.photoList.push(e.url);
			} else {
				this.formData.videoList.push(e.url);
			}
		},
		progress(value) {
			console.log(value);
			this.upLoadType = value;
		},
		delImage(value) {
			console.log(value);
			if (this.type === '1') {
				const index = this.formData.photoList.findIndex(list => {
					return list === value.url;
				});
				this.formData.photoList.splice(index, 1);
			} else {
				const index = this.formData.videoList.findIndex(list => {
					return list === value.url;
				});
				this.formData.videoList.splice(index, 1);
			}
			// actions.delFile(value.id);
		},
		async confirm() {
			if (!this.upLoadType) {
				return;
			}
			if (this.formData.content === '' && this.formData.photoList.length === 0) {
				this.$tools.toast('请发布动态');
				return;
			}
			if (!this.upLoadType) {
				this.$tools.toast('请等待上传完成');
				return;
			}
			let attachList = [];
			const req = {
				momentsMsg: this.formData.content,
				category: this.userType === '3' ? '3' : '1',
				createUsercode: store.userInfo.userCode,
				createUsername: store.userInfo.userName,
				photoUrl: this.userType === '3' ? uni.getStorageSync('bindInfo').photoUrl : store.userInfo.photoUrl,
				schoolCode: store.userInfo.schoolCode,
				classCode: uni.getStorageSync('bindInfo').classCode,
				className: uni.getStorageSync('bindInfo').className,
				gradeCode: uni.getStorageSync('bindInfo').gradeCode,
				gradeName: uni.getStorageSync('bindInfo').gradeName,
				attachList:
					this.type === '1'
						? this.formData.photoList.map(el => {
								return {
									schoolCode: store.userInfo.schoolCode,
									type: '1',
									url: el
								};
						  })
						: this.formData.videoList.map(el => {
								return {
									schoolCode: store.userInfo.schoolCode,
									type: '2',
									url: el
								};
						  })
			};
			if (this.userType === '3') {
				(req.childrenCode = uni.getStorageSync('bindInfo').userCode),
					(req.childrenName = uni.getStorageSync('bindInfo').userName),
					(req.relationship = uni.getStorageSync('bindInfo').relationship);
			}
			console.log(req, 2222);
			const res = await actions.addNewMoment(req);
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
	height: calc(100vh - 100rpx);
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
