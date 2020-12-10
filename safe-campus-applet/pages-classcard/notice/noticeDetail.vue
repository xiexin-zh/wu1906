<template>
	<view class="notice-detail" v-show="showPage">
		<view class="u-type-white-bg u-padd-30">
			<view class="u-font-1 u-bold u-tx-c">{{ detail.noticeTitle }}</view>
			<view class="u-fx-jc u-padd-b30">
				<u-image height="10rpx" width="613rpx" src="http://canpointtest.com/mini-img/notice-line.png"></u-image>
			</view>
			<view class="content u-padd-t30">
				{{ detail.noticeBody }}
			</view>
			<file-show :file-list="detail.annexInfoDTOS"></file-show>
			<view class="u-tips-color u-tx-r u-padd-t">{{ detail.createUserName }}</view>
			<view class="u-tips-color u-tx-r u-padd-t">{{ detail.createTime }}</view>
			<view v-if="currentUserType === '4'" class="u-fx-ac u-fx-jsb u-padd-t30 u-bd-t u-mar-t30">
				<view>
				</view>
				<view class="u-tips-color u-fx-ac">
					<view @tap="editNotice" class="edit-icon"></view>
					<view @tap="delNotice" class="del-icon"></view>
				</view>
			</view>
		</view>
		<view>
			<view class="u-padd-30 u-mar-t u-fx-ac u-type-white-bg" @click="seeNotice">
				<text class="u-fx-f1">已查看{{detail.readNum}}人，未查看{{detail.noReadNum}}人</text>
				<view class="rit-arrow"></view>
			</view>
		</view>
		<view v-if="currentUserType === '16'" class="notice-ok ub-bd-t u-fx-ac">
			<view class="u-fx-f1 u-bg-color u-font-01 u-padd-10 u-tips-color u-border-radius">
				此通知为重要通知，请点击确认收到~
			</view>
			<view class="submit-ok" @tap="_replyNoticeStatus">确认收到</view>
		</view>
	</view>
</template>

<script>
	import { store, actions } from '@store'
	import eventBus from '@u/eventBus'
	import baseData from '@u/base-data'
	import FileShow from '../component/FileShow.vue'
	import BackHome from '../component/BackHome.vue'
	export default {
		computed: {
			userInfo: () => store.userInfo,
			bindStudentList: () => store.bindStudentList,
			currentUserType: () => store.currentUserType
		},
		components: {
			BackHome,
			FileShow
		},
		data () {
			return {
				baseData,
				showPage: false,
				detail: {}
			}
		},
		mounted () {
			eventBus.$on('editOk', () => {
				this._getNoticeDetail()
			})
			this._getNoticeDetail()
		},
		methods: {
			async _replyNoticeStatus () {
				const { relationCode, noticeCode } = uni.getStorageSync('noticeDetail')
				this.$tools.showLoading('回复中...')
				await actions.replyNoticeStatus({
					noticeCode: noticeCode || relationCode,
					receiptMsg: '我已知晓',
					userCode: this.baseData.getUserCode()
				})
				this.$tools.toast('回复成功')
			},
			/**
			 * @description 获取通知详情
			 */
			async _getNoticeDetail () {
				const { relationCode, noticeCode } = uni.getStorageSync('noticeDetail')
				const res = await actions.getNoticeDetail({
					identFlag: this.currentUserType === '4' ? 1 : 2,
					noticeCode: noticeCode || relationCode,
					userCode: this.baseData.getUserCode()
				})
				this.showPage = true
				this.detail = res.data
			},
			editNotice (item) {
				// 存储编辑标识
				uni.setStorageSync('isEditNotice', this.detail)
				this.$tools.navTo({
					url: '/pages-classcard/notice/createNotice'
				})
			},
			delNotice () {
				this.$tools.delTip('确定删除吗?', async () => {
					this.$tools.showLoading('删除中...')
					await actions.delNotice(this.detail.id)
					this.$tools.toast('删除成功')
					this.$tools.goNext(() => {
						eventBus.$emit('initNotice')
						this.$tools.goBack()
					})
				})
			},
			seeNotice () {
				if (this.currentUserType === '16') return
				this.$tools.navTo({
					url: '/pages-classcard/notice/seeNotice?readNum='+ this.detail.readNum + '&noReadNum=' + this.detail.noReadNum  + '&noticeCode=' + this.detail.noticeCode
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.notice-detail {
		.content {
			line-height: 50rpx;
			color: $u-content-color;
		}
		.notice-img {
			width: 100%;
			height: 200rpx;
			margin: 30rpx 20rpx;
			display: block;
		}
		.edit-icon {
			width: 60rpx;
			height: 42rpx;
			background: url(http://canpointtest.com/mini-img/edit-icon.png) no-repeat center;
			background-size: 42rpx 42rpx;
		}
		.del-icon {
			width: 60rpx;
			height: 42rpx;
			background: url(http://canpointtest.com/mini-img/del-icon.png) no-repeat center;
			background-size: 42rpx 42rpx;
			margin-left: 30rpx;
		}
		.notice-ok {
			width: 100%;
			padding: 0 20rpx;
			position: fixed;
			z-index: 999;
			bottom: 0rpx;
			left: 0rpx;
			height: 100rpx;
			background-color: $u-type-white;
			.submit-ok {
				width: 120rpx;
				height: 50rpx;
				font-size: 24rpx;
				line-height: 50rpx;
				text-align: center;
				margin-left: 20rpx;
				background-color: $u-type-primary;
				color:#fff;
				border-radius: $u-border-radius;
			}
		}
	}
</style>
