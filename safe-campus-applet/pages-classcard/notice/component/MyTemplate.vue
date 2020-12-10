<template>
	<view class="my-template">
		<no-data v-if="templateList.length === 0"></no-data>
		<view class="template-item" v-for="(item, index) in templateList" :key="index">
			<view class="u-fx-ac u-padd-20">
				<u-image width="150rpx" height="140rpx" src="http://canpointtest.com/mini-img/my-template-bg.png"></u-image>
				<view class="u-fx-f1 u-mar-l30">
					<view class="u-font-1 u-bold">{{ item.templateTitle }}</view>
					<view class="u-te u-content-color u-padd-t10">{{ item.templateBody }}</view>
					<view class="u-tips-color u-font-01 u-mar-t10">创建时间：{{ item.createTime }}</view>
				</view>
			</view>
			<view class="u-fx-ac template-btn u-tx-c u-tips-color">
				<view class="u-fx-f1 u-bd-r u-fx-ac u-fx-jc" @tap="delTem(item.id)">
					<view class="del-icon u-mar-r10"></view>删除模板
				</view>
				<view class="u-fx-f1 u-fx-ac u-fx-jc" @tap="chooseTem(item)">
					<view class="choose-icon u-mar-r10"></view>选择使用
			  </view>
			</view>
		</view>
	</view>
</template>

<script>
import NoData from '../../component/NoData.vue'
import { store, actions } from '@store'
import eventBus from '@u/eventBus'
export default {
	components: {
		NoData
	},
	data() {
		return {
			templateList: []
		};
	},
	mounted () {
		this.getNoticeTem()
	},
	methods: {
		async getNoticeTem () {
			const res = await actions.getNoticeTem({
				ownerCode: store.userInfo.userCode,
				pageNum: 1,
				pageSize: 30,
				schoolCode: 'CANPOINT',
				templateTitle: '',
				templateType: '',
				topStatus: ''
			})
			this.templateList = res.data.records
		},
		delTem (id) {
			this.$tools.delTip('确定删除此模板吗?', async () => {
				await actions.delNoticeTem(id)
				this.$tools.toast('删除成功')
				this.$tools.goNext(() => {
					this.getNoticeTem()
				})
			})
		},
		async chooseTem (item) {
			this.$tools.showLoading('获取中...')
			const res = await actions.getTemplateInfo(item.id)
			// 判断是新增还是选择模板的操作
			const type = uni.getStorageSync('chooseType')
			uni.setStorageSync('noticeTemplateInfo', res.data)
			// 新建通知
			if (type === 'add') {
				uni.setStorageSync('chooseNoticeType', -1)
				this.$tools.redirectTo({
					url: '/pages-classcard/notice/createNotice',
					title: '创建通知公告'
				})
			} else {
				// 从通知中选择模板
				eventBus.$emit('chooseTem')
				this.$tools.goBack()
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.my-template {
	margin: 0 30rpx;
	.template-item {
		border-radius: $u-border-radius;
		background-color: #fff;
		margin-bottom: 30rpx;
		.del-icon {
			width: 36rpx;
			height: 36rpx;
			background: url(http://canpointtest.com/mini-img/del-icon.png) no-repeat center;
			background-size: 36rpx 36rpx;
		}
		.choose-icon {
			width: 36rpx;
			height: 36rpx;
			background: url(http://canpointtest.com/mini-img/auto-no-check.png) no-repeat center;
			background-size: 36rpx 36rpx;
		}
		.template-btn {
			height: 95rpx;
			line-height: 95rpx;
			background-color: #f9f9fb;
		}
	}
}
</style>
