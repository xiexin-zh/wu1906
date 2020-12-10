<template>
	<view class="create-notice">
		<u-picker v-model="isShowTime" :default-time="dateTime" mode="time" :params="params" @confirm="chooseTime"></u-picker>
		<u-select v-model="isShowType" :list="noticeTypeList" @confirm="chooseType"></u-select>
		<view class="u-fx-ac u-padd-30 u-bd-b u-type-white-bg">
			<text>发送对象：</text>
			<view class="u-fx-f1 u-tx-r u-content-color" @tap="chooseUser">{{ userObjct }}</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="notice-tem u-bd-b u-padd-l30 u-padd-r30 u-padd-t u-padd-b u-fx-ac u-type-white-bg">
			<view class="u-fx-f1 u-te u-mar-r"><u-input placeholder="请输入标题" v-model="noticeTitle"></u-input></view>
			<view class="tem-icon" @tap="chooseTem">模板</view>
		</view>
		<view class="notice-content u-type-white-bg">
			<u-input placeholder="请输入内容" :clearable="false" class="u-content-color" maxlength="3000" height="350" v-model="noticeBody" type="textarea" />
			<view class="u-tx-r u-tips-color">{{ noticeBody.length }}/3000</view>
		</view>
		<view class="u-mar-t u-type-white-bg">
			<upload-file v-if="noticeType !== 4" :key="key" ref="uploadFile" :file-list = 'annexInfoDTOS'></upload-file>
			<view v-if="!isEdit">
				<view class="u-fx-ac u-padd-30 u-bd-t">
					<view>通知类型</view>
					<view class="u-fx-f1 u-tx-r u-content-color" @tap="isShowType = true">{{ noticeTypeName }}</view>
					<view class="rit-arrow"></view>
				</view>
				<view class="u-fx-ac u-padd-30 u-bd-t">
					<view>定时发送设置</view>
					<view class="u-fx-f1 u-tx-r"><u-switch v-model="timingStatus"></u-switch></view>
				</view>
				<view class="u-fx-ac u-padd-30 u-bd-t" v-if="timingStatus">
					<view class="time-icon"><u-image width="36rpx" height="36rpx" src="http://canpointtest.com/mini-img/time-icon.png" mode=""></u-image></view>
					<view class="u-mar-l10">定时发送时间</view>
					<view @tap="chooseTimeType(1)" class="u-fx-f1 u-tx-r u-content-color">{{ timingTime }}</view>
					<view class="rit-arrow"></view>
				</view>
				<view v-if="noticeType === 4">
					<view class="u-fx-ac u-padd-30 u-bd-t">
						<view>是否在班牌全屏展示</view>
						<view class="u-fx-f1 u-tx-r"><u-switch v-model="screenStatus"></u-switch></view>
					</view>
					<view class="u-fx-ac u-padd-30 u-bd-t" v-if="screenStatus">
						<view class="time-icon"><u-image width="36rpx" height="36rpx" src="http://canpointtest.com/mini-img/time-icon.png" mode=""></u-image></view>
						<view class="u-mar-l10">开始时间</view>
						<view @tap="chooseTimeType(2)" class="u-fx-f1 u-tx-r u-content-color">{{ screenStartTime }}</view>
						<view class="rit-arrow"></view>
					</view>
					<view class="u-fx-ac u-padd-30 u-bd-t u-bd-b" v-if="screenStatus">
						<view class="time-icon"><u-image width="36rpx" height="36rpx" src="http://canpointtest.com/mini-img/time-icon.png" mode=""></u-image></view>
						<view class="u-mar-l10">结束时间</view>
						<view @tap="chooseTimeType(3)" class="u-fx-f1 u-tx-r u-content-color">{{ screenEndTime }}</view>
						<view class="rit-arrow"></view>
					</view>
					<view class="u-tips-color u-padd-l30 u-padd-t u-padd-b u-font-01" v-if="screenStatus">开启后，公告将在班级绑定的班牌中全屏展示</view>
				</view>
			</view>
		</view>
		<view class="u-fx-ac u-mar-t40 u-mar-l40 u-mar-r40 u-padd-b40">
			<view class="second-btn u-fx-f1" @tap="_addNoticeTem">存为我的模板</view>
			<view class="primary-btn u-fx-f1 u-mar-l40" @tap="_addNotice">{{ isEdit ? '保存修改' : '提交'}}</view>
		</view>
	</view>
</template>

<script>
import UploadFile from '../component/UploadFile.vue';
import baseData from '@u/base-data'
import eventBus from '@u/eventBus';
import { store, actions } from '@store';
export default {
	components: {
		UploadFile
	},
	computed: {
		userInfo: () => store.userInfo,
		currentBindClass: () => store.currentBindClass
	},
	data() {
		return {
			baseData,
			key: 0,
			dateTime: this.$tools.getDateTime().substr(0, 16),
			screenStatus: false,
			screenStartTime: this.$tools.getDateTime().substr(0, 16),
			screenEndTime: this.$tools.getDateTime().substr(0, 16),
			isEdit: false,
			chooseList: [],
			userObjct: '全部成员',
			noticeTitle: '',
			noticeBody: '',
			timingStatus: false,
			isShowTime: false,
			isShowType: false,
			timingTime: this.$tools.getDateTime().substr(0, 16),
			params: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true
			},
			noticeType: 1,
			noticeTypeName: '普通通知-可统计已读未读',
			annexInfoDTOS: [],
			noticeTypeList: [
				{
					value: 1,
					label: '普通通知-可统计已读未读'
				},
				{
					value: 2,
					label: '重要通知-需家长确认收到'
				},
				{
					value: 3,
					label: '回执通知-可收集回执内容'
				},
				{
					value: 4,
					label: '通知公告'
				}
			]
		};
	},
	mounted() {
		// 监听人员选择
		eventBus.$on('chooseOk', res => {
			this.chooseList = res
			this.userObjct = res.length > 0 ? `已选择${res.length}位学生成员` : '全部成员';
		});
		// 监听模板选择
		eventBus.$on('chooseTem', () => {
			this.setTemplate()
		});
		// 判断是否为编辑
		const isEditNotice = uni.getStorageSync('isEditNotice')
		if (isEditNotice) {
			uni.removeStorageSync('isEditNotice')
			this.isEdit = true
			this.id = isEditNotice.id
			this.noticeBody = isEditNotice.noticeBody
			this.noticeTitle = isEditNotice.noticeTitle
			this.chooseList = isEditNotice.noticeReceiptMsgs
			this.annexInfoDTOS = isEditNotice.annexInfoDTOS
			this.key++
			this.timingStatus = isEditNotice.timingStatus === 1 ? true : false
			this.timingTime = isEditNotice.timingTime || this.$tools.getDateTime().substr(0, 16)
			this.noticeType = isEditNotice.noticeType
			return
		}
		const chooseNoticeType = uni.getStorageSync('chooseNoticeType')
		// _noticeType：-1 选取模板进入， 其他时为选择类型进入
		if (chooseNoticeType === -1) {
			this.setTemplate()
		} else {
			const noticeTypeName = this.noticeTypeList[chooseNoticeType].label;
			this.noticeTitle = `${this.userInfo.userName}老师发布的${noticeTypeName.split('-')[0]}`;
			this.noticeType = this.noticeTypeList[chooseNoticeType].value;
			this.noticeTypeName = noticeTypeName;
		}
	},
	methods: {
		// 设置模板
		setTemplate () {
			const data = uni.getStorageSync('noticeTemplateInfo')
			this.noticeBody = data.templateBody;
			this.noticeTitle = data.templateTitle;
			this.annexInfoDTOS = data.annexInfoDTOS || [];
		},
		// 跳转选择成员
		chooseUser() {
			uni.setStorageSync('chooseStudent', this.chooseList);
			this.$tools.navTo({
				url: './chooseObject'
			});
		},
		// 跳转模板选择
		chooseTem() {
			uni.setStorageSync('chooseType', 'choose');
			this.$tools.navTo({
				url: '/pages-classcard/notice/chooseTemplate'
			});
		},
		/**
		 * @des 选择通知类型
		 */
		chooseType(item) {
			uni.setStorageSync('noticeType', item[0].value)
			this.noticeType = item[0].value;
			this.noticeTypeName = item[0].label;
		},
		chooseTimeType (type) {
			this.type = type
			this.isShowTime = true
			if (type === 1) {
				this.dateTime = this.timingTime
			} else if (type === 2) {
				this.dateTime = this.screenStartTime
			} else if (type === 3) {
				this.dateTime = this.screenEndTime
			}
		},
		chooseTime(time) {
			const dateTime = `${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}`
			if (this.type === 1) {
				this.timingTime = dateTime
			} else if ( this.type === 2) {
				this.screenStartTime = dateTime
			} else if (this.type === 3) {
				this.screenEndTime = dateTime
			}
		},
		/**
		 * @description 提交通知
		 */
		async _addNotice() {
			if (this.noticeTitle === '') {
				this.$tools.toast('请输入通知标题');
				return;
			} else if (this.noticeBody === '') {
				this.$tools.toast('请输入通知内容');
				return;
			}
			if (this.isLoading) return;
			this.isLoading = true;
			this.$tools.showLoading('发布中...');
			const params = {
					id: this.isEdit ? this.id : 0,
					photoUrl: this.userInfo.photoUrl,
					annexInfoDTOS: this.noticeType === 4 ? [] : this.$refs.uploadFile.newFileList,
					createUserCode: this.userInfo.userCode,
					createUserName: this.userInfo.userName,
					noticeBody: this.noticeBody,
					noticeTitle: this.noticeTitle,
					noticeType: this.noticeType,
					themeTitle: `${this.userInfo.userName}发布了一条${this.baseData.getNoticeTypeName(this.noticeType)}, 请注意查看~`,
					orgCode: this.currentBindClass.classCode,
					schoolCode: this.userInfo.schoolCode,
					timingStatus: this.timingStatus ? 1 : 2,
					timingTime: this.timingTime,
					userInfoDTOS: this.chooseList,
					screenStatus: this.screenStatus ? 1 : 2,
					screenStartTime: this.screenStartTime,
					screenEndTime: this.screenEndTime,
				}
				console.log(params)
				await actions.createNotice(params);
				this.isLoading = false;
				if (this.isEdit) {
					this.$tools.toast('编辑成功')
					this.$tools.goNext(() => {
						eventBus.$emit('editOk')
						this.$tools.goBack()
					})
					return
				}
				eventBus.$emit('initNotice')
				uni.setStorageSync('noticeType', this.noticeType)
				this.$tools.redirectTo({
					url: '/pages-classcard/notice/publishSuccess'
				});
		},
		/**
		 * @description 添加我的模板信息
		 */
		async _addNoticeTem() {
			if (this.noticeTitle === '') {
				this.$tools.toast('请输入通知标题');
				return;
			} else if (this.noticeBody === '') {
				this.$tools.toast('请输入通知内容');
				return;
			}
			if (this.isLoading) return;
			this.isLoading = true;
			this.$tools.showLoading('模板保存中...');
			try {
				await actions.addNoticeTem({
					annexInfoDTOS: this.$refs.uploadFile.newFileList,
					createTime: new Date().getTime(),
					id: '',
					ownerCode: this.userInfo.userCode,
					schoolCode: 'CANPOINT',
					templateBody: this.noticeBody,
					templateCode: '',
					templateTitle: this.noticeTitle,
					templateType: '',
					templateUrl: '',
					topStatus: ''
				});
				this.isLoading = false;
				this.$tools.toast('保存成功');
			} catch (err) {
				this.isLoading = false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.create-notice {
	.notice-content {
		background-color: #fff;
		height: 420rpx;
		padding: 20rpx 30rpx;
		line-height: 30rpx;
	}
	.tem-icon {
		background: url(http://canpointtest.com/mini-img/module-icon.png) no-repeat;
		background-size: 36rpx 36rpx;
		color:#999;
		padding-left: 40rpx;
	}
	.time-icon {
		width: 36rpx;
		height: 36rpx;
		display: block;
	}
}
</style>
