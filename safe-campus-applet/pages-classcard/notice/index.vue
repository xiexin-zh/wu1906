<template>
	<view :class="['notice-list', {'padd-bottom' : currentUserType === '4'}]">
		<view class="u-fx-jc" v-if="false"><view class="date-tip">今日消息</view></view>
		<no-data v-if="noticeList.length === 0" top="150" msg="多种通知类型可供选择" autoImg="http://canpointtest.com/mini-img/auto-no-notice.png" tips="还可以添加图片,视频哦~" width="332" height="300"></no-data>
		<view @tap="goDetail(notice)" class="notice-item u-fx-ver" v-for="notice in noticeList" :key="notice.id">
			<view class="u-fx-ac u-fx-f1">
				<image class="user-icon" :src="notice.photoUrl"></image>
				<view class="u-fx-f1 u-mar-l30">
					<view class="u-fx-ac">
						<u-tag :text="getNoticeType(notice.noticeType)" size="mini" :bg-color="getNoticeBg(notice.noticeType)" color="#fff" border-color="#fff" />
						<text class="u-bold u-padd-l">{{ notice.noticeTitle }}</text>
					</view>
					<view class="u-tips-color u-font-01 u-mar-t10">{{ notice.createUserName }}老师：{{ notice.createTime }}</view>
					<view class="u-mar-t10 u-content-color u-font-01" v-if="notice.timingStatus === 1">
						定时时间：{{ notice.timingTime }} <u-tag class="u-mar-l10 u-font-02" text="定时通知" size="mini" shape="circle" />
					</view>
				</view>
			</view>
			<view class="u-te2 u-content-color u-mar-t20">{{ notice.noticeBody}}</view>
		</view>
		<view v-if="currentUserType === '4'" @click="addNotice" class="add-btn u-fx-ac u-padd-l40 u-padd-r40"><view class="primary-btn u-fx-f1 u-mar-l40 u-mar-r40">新增通知</view></view>
	</view>
</template>

<script>
import { store, actions } from '@store';
import NoData from '../component/NoData.vue'
import baseData from '@u/base-data'
import eventBus from '@u/eventBus'
export default {
	components: {
		NoData
	},
	computed: {
		userInfo: () => store.userInfo,
		currentUserType: () => store.currentUserType,
		currentBindClass: () => store.currentBindClass,
		currentBindStudent: () => store.currentBindStudent
	},
	data() {
		return {
			baseData,
			pageList: {
				pageNum: 1,
				pageSize: 20
			},
			noticeList: []
		};
	},
	onPullDownRefresh() {
		this.pageList.pageNum = 1
		this.getNoticeList()
		setTimeout(() => {
			uni.stopPullDownRefresh()
		}, 1500);
	},
	onReachBottom() {
		this.pageList.pageNum ++
		this.getNoticeList(true)
	},
	mounted() {
		eventBus.$on('initNotice', () => {
			this.pageList.pageNum = 1
			this.getNoticeList()
		})
		this.getNoticeList()
	},
	methods: {
		getNoticeBg (type) {
			if (type === 1) {
				return '#2b85e4'
			} else if (type === 2) {
				return '#dd6161'
			} else if (type === 3) {
				return '#18b566'
			} else if (type === 4) {
				return '#f29100'
			}
		},
 		getNoticeType (type) {
			return baseData.getNoticeTypeName(type)
		},
		/**
		 * @description 获取通知列表
		 */
		async getNoticeList(tag) {
			const res = await actions.getNoticeList({
				endTime: '',
				noticeTitle: '',
				noticeType: '',
				...this.pageList,
				orgCode: this.baseData.getClassCode(),
				schoolCode: this.userInfo.schoolCode,
				startTime: '',
				userCode: this.baseData.getUserCode(),
				userIdent: this.currentUserType === '4' ? 1 : 2
			})
			if (tag) {
				if (res.data.records.length === 0) {
					this.$tools.toast('数据已加载完毕')
				}
				this.noticeList = this.noticeList.concat(res.data.records)
			} else {
				this.noticeList = res.data.records
			}
		},
		goDetail(item) {
			uni.setStorageSync('noticeDetail', item)
			this.$tools.navTo({
				url: '/pages-classcard/notice/noticeDetail?id=' + item.noticeCode,
			});
		},
		addNotice() {
			uni.setStorageSync('chooseType', 'add');
			this.$tools.navTo({
				url: '/pages-classcard/notice/noticeTemplate'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.notice-list {
	padding: 30rpx 30rpx 0rpx;
	&.padd-bottom {
		padding-bottom: 130rpx
	}
	.date-tip {
		border-radius: 100rpx;
		margin: 20rpx auto;
		display: inline-block;
		background-color: #dbdbdb;
		height: 40rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		padding: 0 20rpx;
		color: #fff;
	}
	.notice-item {
		margin-bottom: 30rpx;
		height: 230rpx;
		background-color: #fff;
		border-radius: $u-border-radius;
		padding: 20rpx;
		.user-icon {
			width: 84rpx;
			height: 84rpx;
			display: block;
			border-radius: 100%;
			background-color: $u-bg-color;
		}
	}
	.add-btn {
		background-color: $u-bg-color;
		height: 120rpx;
		width: 100%;
		position: fixed;
		z-index: 99;
		bottom: 0rpx;
		left: 0rpx;
	}
}
</style>
