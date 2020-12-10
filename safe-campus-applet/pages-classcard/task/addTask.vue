<template>
	<view class="add-task">
		<u-select v-model="isShowType" :list="answerTypeList" @confirm="chooseType"></u-select>
		<view class="u-fx-ac u-padd-20 u-bd-b u-type-white-bg">
			<text>发送对象：</text>
			<view class="u-fx-f1 u-tx-r u-content-color" @tap="chooseUser">{{ userObjct }}</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="notice-tem u-bd-b u-padd-l20 u-padd-r20 u-padd-t u-padd-b u-fx-ac u-type-white-bg">
			<view class="u-fx-f1 u-te u-mar-r u-letter-1"><u-input v-model="homeworkTitle" placeholder="请输入作业标题"></u-input></view>
		</view>
		<view class="notice-content u-type-white-bg">
			<u-input :clearable="false" class="u-content-color" maxlength="3000" height="350" placeholder="请输入作业简要内容" v-model="homeworkBody" type="textarea" />
			<view class="u-tx-r u-tips-color">{{ homeworkBody.length >= 200 ? 200 : homeworkBody.length }}/200</view>
		</view>
		<subject-name v-model="subject"></subject-name>
		<view class="u-type-white-bg u-mar-t"><upload-file :key="key" ref="uploadFile" :file-list="annexInfoDTOS"></upload-file></view>
		<view class="u-type-white-bg">
			<view class="u-fx-ac u-padd-20 u-bd-t">
				<view>是否容许学生互看作业</view>
				<view class="u-fx-f1 u-tx-r"><u-switch v-model="shareStatus"></u-switch></view>
			</view>
			<set-time ref="jzTime" title="是否设置截止时间"></set-time>
			<view class="u-fx-ac u-padd-20 u-bd-t">
				<view>是否自动奖励小红花</view>
				<view class="u-fx-f1 u-tx-r"><u-switch v-model="rewardStatus"></u-switch></view>
			</view>
		</view>
		<view class="u-mar-t u-type-white-bg">
			<view>
				<view class="u-fx-ac u-padd-20 u-bd-t" @tap="moreSet = !moreSet">
					<view class="u-fx-f1">更多设置</view>
					<view :class="['rit-arrow down_icon', { top_icon: moreSet }]"></view>
				</view>
				<view v-show="moreSet">
					<set-time ref="dsTime" title="定时布置设置"></set-time>
					<view class="u-fx-ac u-padd-20 u-bd-t">
						<view>是否上传答案</view>
						<view class="u-fx-f1 u-tx-r"><u-switch v-model="answerStatus"></u-switch></view>
					</view>
					<view class="u-padd" v-if="answerStatus">
						<upload-file ref="uploadFileTask" :file-list="answerAnnexs"></upload-file>
						<view class="u-tips-color u-tx-c u-font-01">您可以上传作业相关的图片和视频答案供学生参考</view>
					</view>
				</view>
			</view>
		</view>
		<view class="u-fx-ac u-mar-t40 u-mar-l40 u-mar-r40 u-padd-b40">
			<view class="primary-btn u-fx-f1 u-mar-l40" @tap="_addTask">{{ isEdit ? '保存修改' : '发布作业' }}</view>
		</view>
		<view v-if="false" class="u-tx-c u-padd-b20 u-tips-color u-font-01">退出页面前保存为草稿，下次进入可直接使用草稿~</view>
	</view>
</template>

<script>
import UploadFile from '../component/UploadFile.vue';
import SubjectName from './component/SubjectName.vue';
import SetTime from './component/SetTime.vue';
import baseData from '@u/base-data';
import eventBus from '@u/eventBus';
import { store, actions } from '@store';
export default {
	components: {
		UploadFile,
		SubjectName,
		SetTime
	},
	computed: {
		userInfo: () => store.userInfo,
		currentBindClass: () => store.currentBindClass
	},
	data() {
		return {
			key: 0,
			baseData,
			isEdit: false,
			moreSet: false,
			chooseList: [],
			userObjct: '全部学生',
			homeworkTitle: '',
			homeworkBody: '',
			rewardStatus: false,
			subject: {
				subjectCode: '',
				subjectName: ''
			},
			shareStatus: false,
			isShowType: false,
			annexInfoDTOS: [],
			answerType: 1,
			answerName: '无限制',
			answerTypeList: [
				{
					value: 1,
					label: '无限制'
				},
				{
					value: 2,
					label: '至少反馈图片'
				},
				{
					value: 3,
					label: '至少反馈视频'
				}
			],
			answerAnnexs: [],
			answerStatus: false
		};
	},
	mounted() {
		// 监听人员选择
		eventBus.$on('chooseOk', res => {
			this.chooseList = res;
			this.userObjct = res.length > 0 ? `已选择${res.length}位学生成员` : '全部学生';
		});
		// 判断是否为编辑
		const isEditTask = uni.getStorageSync('isEditTask');
		if (isEditTask) {
			this.isEdit = true
			this.id = isEditTask.id
			uni.removeStorageSync('isEditTask')
			this.homeworkCode = isEditTask.homeworkCode
			this.chooseList = isEditTask.userInfoDTOS || [],
			this.homeworkBody = isEditTask.homeworkBody
			this.homeworkTitle = isEditTask.homeworkTitle
			this.subject = {
				subjectCode: isEditTask.subjectCode,
				subjectName: isEditTask.subjectName
			}
			this.annexInfoDTOS = isEditTask.annexInfoDTOS
			this.answerAnnexs = isEditTask.answerAnnexs
			this.key++
			this.shareStatus = isEditTask.shareStatus === 1 ? true : false
			this.$refs.jzTime.status = isEditTask.cutOffStatus === 1 ? true : false
			this.$refs.jzTime.dateTime = isEditTask.cutOffTime
			this.rewardStatus = isEditTask.rewardStatus === 1 ? true : false
			this.$refs.dsTime.status = isEditTask.timingStatus === 1 ? true : false
			this.$refs.dsTime.dateTime = isEditTask.timingTime
			this.answerStatus = isEditTask.answerStatus === 1 ? true : false
		} else {
			this.homeworkTitle = `${this.$tools.getDateTime().substr(0, 10).replace(/-/g, '.')}${this.$tools.getWeek()}作业记录`;
		}
	},
	methods: {
		// 跳转选择成员
		chooseUser() {
			uni.setStorageSync('chooseStudent', this.chooseList);
			this.$tools.navTo({
				url: '/pages-classcard/notice/chooseObject'
			});
		},
		/**
		 * @des 选择通知类型
		 */
		chooseType(item) {
			this.answerType = item[0].value;
			this.answerName = item[0].label;
		},
		/**
		 * @description 提交通知
		 */
		async _addTask() {
			console.log(this.subject)
			if (this.homeworkTitle === '') {
				this.$tools.toast('请输入作业标题');
				return;
			} else if (this.homeworkBody === '') {
				this.$tools.toast('请输入作业内容');
				return;
			} else if (this.subject.subjectCode === '') {
				this.$tools.toast('请选择作业科目')
				return
			}
			if (this.isLoading) return;
			this.isLoading = true;
			this.$tools.showLoading('发布中...');
			try {
				await actions.addUpdateTask({
					answerAnnexs: this.answerStatus ? this.$refs.uploadFileTask.newFileList : [],
					answerStatus: this.answerStatus ? 1 : 2,
					classCode: baseData.getClassCode(),
					id: this.isEdit ? this.id : 0,
					photoUrl: this.userInfo.photoUrl,
					annexInfoDTOS: this.$refs.uploadFile.newFileList,
					createUserCode: this.userInfo.userCode,
					createUserName: this.userInfo.userName,
					cutOffStatus: this.$refs.jzTime.status ? 1 : 2,
					cutOffTime: this.$refs.jzTime.status ? this.$refs.jzTime.dateTime : '',
					homeworkBody: this.homeworkBody,
					homeworkTitle: this.homeworkTitle,
					id: this.id || 0,
					homeworkCode: this.homeworkCode || '',
					publishTime: '',
					remindStatus: 2,
					rewardStatus: this.rewardStatus ? 1 : 0,
					schoolCode: this.userInfo.schoolCode,
					shareStatus: this.shareStatus ? 1 : 2,
					subjectCode: this.subject.subjectCode,
					subjectName: this.subject.subjectName,
					submitType: 1,
					timingStatus: this.$refs.dsTime.status ? 1 : 2,
					timingTime: this.$refs.dsTime.status ? this.$refs.dsTime.dateTime : '',
					userInfoDTOS: this.chooseList
				})
				this.isLoading = false;
				if (this.isEdit) {
					this.$tools.toast('编辑成功');
					this.$tools.goNext(() => {
						eventBus.$emit('editTaskOk');
						this.$tools.goBack();
					});
					return;
				} else {
					this.$tools.redirectTo({
						url: '/pages-classcard/task/taskSuccess'
					})
				}
				eventBus.$emit('initTask');
			} catch (err) {
				console.log(err)
				this.isLoading = false;
			}
		},
		goAnswer() {
			this.$tools.navTo({
				url: '/pages-classcard/task/taskAnswer'
			});
		},
		saveDraft() {},
	}
};
</script>

<style lang="scss" scoped>
.add-task {
	.down_icon {
		transform: rotate(90deg);
	}
	.top_icon {
		transform: rotate(-90deg);
	}
	.notice-content {
		background-color: #fff;
		height: 420rpx;
		padding: 20rpx 30rpx;
		line-height: 30rpx;
	}
}
</style>
