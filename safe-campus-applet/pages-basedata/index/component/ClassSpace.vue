<template>
	<view class="class-space">
		<view class="space-tab u-fx-ac">
			<view class="space-item act" @click="_getClassSpace()">班级空间</view>
		</view>
		<no-data v-if="spaceList.length === 0" msg="暂未发布班级动态哦~"></no-data>
		<view class="space-list u-fx" v-for="notice in spaceList" :key="notice.id">
			<view>
				<u-image border-radius="100%" width="75rpx" height="75rpx" :src="notice.photoUrl || 'http://canpointtest.com/mini-img/auto-user-icon.png'"></u-image>
			</view>
			<view class="u-mar-l u-fx-f1">
				<view class="u-font-1">{{ notice.createUserName }}</view>
				<view class="u-padd-t10 u-tips-color u-font-01">{{ notice.createTime }}</view>
				<view class="u-te2 u-mar-t10 u-content-color">{{ notice.themeTitle }}</view>
				<view class="msg-type u-fx-ac" @tap="goDetail(notice)">
					<u-image :src="getTypeIcon(notice.relationType)" width="64rpx" height="64rpx"></u-image>
					<view class="u-te u-mar-l30">{{ notice.titleName }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import baseData from '@u/base-data'
	import NoData from '../../component/NoData.vue'
	import { store, actions } from '@store'
	import eventBus from '@u/eventBus'
	export default {
		components: {
			NoData
		},
		computed: {
			currentUserType: () => store.currentUserType,
			currentBindClass: () => store.currentBindClass,
			currentBindStudent: () => store.currentBindStudent,
			userInfo: () => store.userInfo
		},
		data() {
			return {
				baseData,
				appList: [
					{
						title: '通知公告'
					},
					{
						title: '作业'
					}
				],
				spaceList: []
			}
		},
		mounted () {
			// 切换班级或学生后重新初始化
			eventBus.$on('initClassSpace', () => {
				this._getClassSpace()
			})
			this._getClassSpace()
		},
		methods: {
			getTypeIcon(type) {
				if (type === 1) {
					return 'http://canpointtest.com/mini-img/tzgg-icon.png'
				} else if (type === 2) {
					return 'http://canpointtest.com/mini-img/zy-icon.png'
				}
			},
			async _getClassSpace () {
				if (!this.baseData.getClassCode()) return
				const res = await actions.getClassSpace({
					orgCode: this.baseData.getClassCode(),
					pageNum: 1,
					pageSize: 10,
					schoolCode: this.userInfo.schoolCode,
					userCode: this.baseData.getUserCode(),
					userIdent: this.currentUserType === '4' ? 1 : 2
				})
				this.spaceList = res.data ? res.data.records : [] 
			},
			goDetail(item) {
				if (item.relationType === 1) {
					uni.setStorageSync('noticeDetail', item)
					this.$tools.navTo({
						url: '/pages-classcard/notice/noticeDetail',
					});
				} else {
					uni.setStorageSync('taskCode', item.relationCode)
					this.$tools.navTo({
						url: '/pages-classcard/task/taskDetail',
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.class-space {
		background-color: #fff;
		.space-tab {
			border-bottom: 2rpx $u-border-color solid;
			height: 85rpx;
			line-height: 85rpx;
			.space-item {
				margin-left: 40rpx;
				margin-right: 20rpx;
			}
			.act {
				color: $u-type-primary;
				font-weight: bold;
				border-bottom: 4rpx $u-type-primary solid;
			}
		}
		.space-list {
			padding: 30rpx;
			border-bottom: 1rpx $u-border-color solid;
		}
		.msg-type {
			height: 115rpx;
			padding: 20rpx;
			margin-top: 20rpx;
			background-color: #f3f3f5;
			border-radius: $u-border-radius;
		}
	}
</style>
