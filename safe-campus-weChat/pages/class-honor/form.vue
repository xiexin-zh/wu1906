<template>
	<view>
		<u-picker @confirm="changeTime" v-model="dateTimeTag" mode="time"></u-picker>
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="u-fx-f1 u-bd-b item-list input-area">
				<view class="tip">荣誉名称：</view>
				<view class="u-fx-f1 u-mar u-mar-l0">
					<textarea :disabled="userType !== 1" class="item-input u-content-color" maxlength="50" v-model="formData.name" placeholder="请输入荣誉名称" />
				</view>
			</view>
			<view class="u-bd-b item-list" v-if="userType === 1 || fileList.length > 0">
				<view class="mar-b20">上传图片</view>
				<view class="u-fx-f1">
					<view class="u-fx-f1">
						<video-upload
							class="u-fx-f1 u-padd-l20 u-padd-r10 u-padd-b20"
							:schoolCode="userInfo.schoolCode"
							types="image"
							:disabled="userType !== 1"
							v-model="fileList"
							:uploadCount="1"
							:upload_max="10"
							@success="success"
							@delImage="delImage"
						></video-upload>
					</view>
				</view>
			</view>
			<view class="u-fx-ac u-bd-b item-list" @click="chooseTime">
				<view class="tip">获奖日期：</view>
				<view class="u-fx-f1 u-fx-je u-content-color">{{ formData.dateTime }}</view>
				<view class="rit-icon"></view>
			</view>
		</scroll-view>
		<view v-if="userType === 1" class="footer-btn u-fx-ac"><u-button @click="confirm" type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg">确定</u-button></view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import anUploadImg from '@/components/an-uploadImg/an-uploadImg';
import { store, actions } from './store/index.js';
import hostEnv from '../../config/index.js';
export default {
	components: {
		anUploadImg
	},
	data() {
		return {
			dateTimeTag: false,
			type: 0, // 0.新增，1编辑
			fileList: [],
			userType: 2, // 0.超管，1.班主任，2.教职工，3.家长
			formData: {
				name: '',
				dateTime: ''
			}
		};
	},
	computed: {
		userInfo: () => store.userInfo 
	},
	created() {
		this.type = this.$tools.getQuery().get('type');
		this.userType = parseInt(this.$tools.getQuery().get('userType'))
		if (this.type === '1') {
			this.id = this.$tools.getQuery().get('id');
			this.showData();
		}
	},
	async mounted() {},
	methods: {
		// 表单回填
		async showData() {
			const res = await actions.getClassHonorDetail(this.id);
			this.formData.name = res.data.content;
			this.formData.dateTime = this.$tools.getDateTime(res.data.awardTime, 'date');
			if (res.data.photoUrl) {
				this.fileList = [
					{
						url: res.data.photoUrl,
						id: res.data.photoId
					}
				]
			}
		},
		previewImage(e) {
			uni.previewImage({
				urls: this.fileList.map(el => {
					return el.url;
				})
			});
		},
		success(e) {
			console.log(e);
			this.photoId = e.id;
		},
		delImage(value) {
			console.log(value);
			const index = this.fileList.findIndex(list => {
				return list.url === value.url;
			});
			this.fileList.splice(index, 1);
			// actions.delFile(value.id || this.fileList[0].id);
		},
		chooseTime(){
			if(this.userType !== 1){
				return
			}
			this.dateTimeTag = true
		},
		changeTime(item) {
			this.formData.dateTime = `${item.year}-${item.month}-${item.day}`;
		},
		async confirm() {
			if (this.formData.name === '') {
				this.$tools.toast('请输入荣誉名称');
				return;
			}
			if (this.formData.dateTime === '') {
				this.$tools.toast('请选择获奖时间');
				return;
			}
			const req = {
				awardTime: this.formData.dateTime,
				content: this.formData.name,
				createUsercode: store.userInfo.userCode,
				createUsername: store.userInfo.userName,
				schoolYearId: store.schoolYear.schoolYearId,
				schoolCode: store.userInfo.schoolCode,
				gradeCode: uni.getStorageSync('bindInfo').gradeCode,
				classCode: uni.getStorageSync('bindInfo').classCode,
				gradeName: uni.getStorageSync('bindInfo').gradeName,
				className: uni.getStorageSync('bindInfo').className,
				photoUrl: this.fileList.length > 0 ? this.fileList[0].url : '',
				photoId: this.fileList.length > 0 ? this.photoId : ''
			};
			console.log(req);
			if (this.type === '0') {
				const res = await actions.addClassHonor(req);
			} else {
				req.id = this.id
				const res = await actions.editClassHonor(req);
			}
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
.tip::before {
	position: absolute;
	content: '*';
	color: red;
	left: 10rpx;
	width: 10rpx;
	height: 10rpx;
}
.u-mar-l0{
	margin-left: 0;
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
.input-area {
	height: 400rpx;
}
/deep/ .uni-textarea-textarea {
	border: 1rpx solid $u-border-color;
	padding: 20rpx;
	line-height: 50rpx;
	color: $u-content-color;
}
/deep/ .uni-textarea-placeholder {
	padding: 20rpx;
}
</style>
