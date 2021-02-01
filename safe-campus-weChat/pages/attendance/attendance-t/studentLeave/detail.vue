<template>
	<view class="class-detail">
		<scroll-view scroll-y="true" class="scroll-h">
			<detail-show :detail="detail"></detail-show>
			<view class="u-padd">
				<approval-step :data-list="dataList"></approval-step>
			</view>
      <view class="u-padd">
				<approval-step :data-list="copyList"></approval-step>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import DetailShow from '../../component/DetailShow.vue'
import eventBus from '@u/eventBus';
import { store, actions } from '../store/index.js'
export default {
	components: {
		DetailShow
	},
	data() {
		return {
			detail: {},
			dataList: [],
			id: '',  
			teacherTag: false,
			copyList: []
		}
	},
	mounted() {
		this.id = this.$tools.getQuery().get("id");
		this.getDetail()
	},
	methods: {
    async getDetail () {
      const res = await actions.studentLeaveDetail(this.id)
      this.detail = res.data
      this.copyList = res.data.leaveCopyList.map(el => {
				return {
					dateTime: el.readTime ? this.$tools.getDateTime(el.readTime, 'dateTime') : '',
					label: '抄送人',
					labelName: el.userName, 
					statusName: el.state === '1' ? '已读' : '未读' , 
					state: el.state === '1' ? 1 : 0,// 此状态只有两种值，1：为已审批的  0：为其他状态
					photoUrl: el.photoUrl
				}
			})
      this.dataList = res.data.leaveApprovalAddDto.map(el => {
				return {
					dateTime: el.updateTime ? this.$tools.getDateTime(el.updateTime, 'dateTime') : '',
					label: '审批人',
					labelName: el.userName,
					statusName: el.state === '0' ? '待审批' : el.state === '1' ? '审批通过' : el.state === '2' ? '审批未通过' : el.state === '4' ? '审批中' : '',
					state: el.state === '1' ? 1 : 0,// 此状态只有两种值，1：为已审批的  0：为其他状态
					photoUrl: el.photoUrl
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
