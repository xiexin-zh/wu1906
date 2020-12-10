<template>
	<view class="system-template">
		<view class=""><u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs></view>
		<no-data v-if="templateList.length === 0"></no-data>
		<view class="u-auto u-padd-t40">
			<view @tap="chooseTem(item)" class="template-item" v-for="(item, index) in templateList" :key="index">
				<image class="template-img" :src="item.templateUrl"></image>
				<view class="u-te u-padd-t20">{{ item.templateTitle }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import { actions } from '@store'
import eventBus from '@u/eventBus'
import NoData from '../../component/NoData.vue'
export default {
	components: {
		NoData
	},
	data() {
		return {
			list: [
				{
					key: 0,
					name: '推荐模板'
				},
				{
					key: 1,
					name: '温馨提示'
				},
				{
					key: 2,
					name: '班级通知'
				},
				{
					key: 3,
					name: '预防通知'
				},
				{
					key: 4,
					name: '节假日'
				}
			],
			current: 0,
			templateList: []
		};
	},
	mounted () {
		this.getNoticeTem()
	},
	methods: {
		async getNoticeTem () {
			const res = await actions.getNoticeTem({
				ownerCode: '',
				pageNum: 1,
				pageSize: 30,
				schoolCode: 'CANPOINT',
				templateTitle: '',
				templateType: this.current || '',
				topStatus: this.current === 0 ? 1 : ''
			})
			this.templateList = res.data.records
		},
		change(index) {
			this.current = index
			this.getNoticeTem()
		},
		chooseTem (item) {
			// 判断是新增还是选择模板的操作
			const type = uni.getStorageSync('chooseType')
			uni.setStorageSync('noticeTemplateInfo', item)
			// 新建通知
			if (type === 'add') {
				uni.setStorageSync('chooseNoticeType', -1)
				this.$tools.redirectTo({
					url: '/pages-classcard/notice/createNotice',
					title: '创建通知公告'
				})
			} else {
				// 从模板中选择
				eventBus.$emit('chooseTem')
				this.$tools.goBack()
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.system-template {
	.template-item {
		width: 45%;
		float: left;
		margin-left: 3.33%;
		margin-bottom: 30rpx;
		.template-img {
			height: 240rpx;
			width: 100%;
			display: block;
			background-color: $u-bg-color;
		}
	}
}
</style>
