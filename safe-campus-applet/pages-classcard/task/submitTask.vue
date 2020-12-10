<template>
	<view class="task-answer">
		<view class="u-type-white-bg u-padd-b20">
			<view class="task-title u-font-1 u-padd">{{title}}</view>
			<view class="u-tips-color u-padd u-font-01">
				<u-input :clearable="false" class="u-content-color" maxlength="3000" height="200" placeholder="请填写完成情况" v-model="remarks" type="textarea" />
			</view>
			<view><upload-file ref="uploadFile" :file-list="annexInfoDTOS"></upload-file></view>
			<view class="u-tips-color u-padd u-font-01">备注：请上传完成作业的图片或视频，供老师查看批阅</view>
		</view>
		<view class="primary-btn submit-task" @tap="_submitTask">确定提交</view>
	</view>
</template>

<script>
import UploadFile from '../component/UploadFile.vue';
import { store, actions } from '@store';
import baseData from '@u/base-data'
import eventBus from '@u/eventBus'
export default {
	components: {
		UploadFile
	},
	computed: {
		userInfo: () => store.userInfo
	},
	data() {
		return {
			baseData,
			remarks: '',
			title: uni.getStorageSync('replyTaskInfo').homeworkTitle,
			annexInfoDTOS: []
		};
	},
	methods: {
		async _submitTask() {
			try {
				if (this.remarks === '') {
					this.$tools.toast('请填写完成情况')
					return
				}
				if (this.isLoading) return
				this.isLoading = true
				this.$tools.showLoading('提交中...')
				await actions.submitTask({
					annexInfoDTOS: this.$refs.uploadFile.newFileList,
					classCode: this.baseData.getClassCode(),
					firstStatus: 0,
					homeworkCode: uni.getStorageSync('taskCode'),
					id: uni.getStorageSync('replyTaskInfo').replyId,
					recordCode:uni.getStorageSync('replyTaskInfo').recordCode,
					remarks: this.remarks,
					schoolCode: this.userInfo.schoolCode,
					studentCode: this.baseData.getUserCode(),
					subjectCode: uni.getStorageSync('replyTaskInfo').subjectCode
				});
				this.$tools.toast('提交成功')
				this.$tools.goNext(() => {
					eventBus.$emit('editTaskOk')
					this.$tools.goBack()
				})
			} catch (err) {
				this.isLoading = false
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.task-answer {
	.submit-task {
		width: 85%;
		margin: 60rpx auto;
	}
}
</style>
