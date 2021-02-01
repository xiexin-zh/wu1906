<template>
	<view class="class-detail">
		<scroll-view scroll-y="true" class="scroll-h">
			<detail-show :detail="detail"></detail-show>
			<view class="u-padd"><approval-step :data-list="dataList"></approval-step></view>
		</scroll-view>
	</view>
</template>

<script>
import { store, actions } from '../store/index.js';
import eventBus from '@u/eventBus';
import DetailShow from '../../component/DetailShow.vue';
export default {
	components: {
		DetailShow
	},
	data() {
		return {
			id: '',
			detail: {},
			dataList: []
		};
	},
	created() {
		let id = this.$tools.getQuery().get('id');
		if (!id) return;
		this.getDetail(id);
	},
	methods: {
		async getDetail(id) {
			const res = await actions.ApplicationDetail({
				id: id
			});
			this.detail = {
				userName: res.data.applicantName,
				typeName: '调班',
				reason: res.data.reason
			};
			this.dataList = res.data.outApproverDtoList.map(item => {
				return {
					photoUrl: item.approverPhoto,
					dateTime: item.approvalTime ? this.$tools.getDateTime(item.approvalTime, 'dateTime') : '',
					label: '审批人',
					labelName: item.approverName, // 如果是多个用逗号隔开
					statusName: item.status === '1' ? '待审批' : item.status === '2' ? '审批通过' : item.status === '3' ? '审批未通过' : item.status === '4' ? '审批中' : '', // 如果是多个用逗号隔开
					status: item.status === '2' ? 1 : 0,// 此状态只有两种值，1：为已审批的  0：为其他状态
				}
			})
			},
	}
};
</script>

<style lang="scss" scoped>
.class-detail {
	.scroll-h {
		height: calc(100vh - 100rpx);
	}
}
</style>
