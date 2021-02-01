<template>
	<view class="class-detail">
		<scroll-view scroll-y="true" class="scroll-h">
			<detail-show :detail="detail"></detail-show>
			<view class="u-padd">
				<approval-step :data-list="dataList"></approval-step>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import DetailShow from '../../component/DetailShow.vue'
import { store, actions } from '../store/index.js'
export default {
	components: {
		DetailShow
	},
	data() {
		return {
			detail: {
			},
			dataList: [],
			id: ''
		}
	},
	mounted() {
		this.id = this.$tools.getQuery().get("id")
		this.getDetail()
	},
	methods: {
		async getDetail(id) {
			const res = await actions.dormApplicationDetail({id: this.id})
			this.detail = {
				userName: res.data.applicantName,
				typeName: '调宿',
				reason: res.data.reason
			}
			this.dataList = res.data.outApproverDtoList.map(el => {
				return {
					dateTime: el.approvalTime ? this.$tools.getDateTime(el.approvalTime, 'dateTime') : '',
					label: '审批人',
					labelName: el.approverName, // 如果是多个用逗号隔开
					statusName: el.status === '1' ? '待审批' : el.status === '2' ? '审批通过' : el.status === '3' ? '审批未通过' : el.status === '4' ? '审批中' : '', // 如果是多个用逗号隔开
					status: el.status === '2' ? 1 : 0,// 此状态只有两种值，1：为已审批的  0：为其他状态
					photoUrl: el.approverPhoto
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.class-detail {
	.scroll-h {
		height: calc(100vh - 100rpx);
	}
}
</style>
