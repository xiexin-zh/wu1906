<template>
	<view class="class-detail">
		<scroll-view scroll-y="true" class="scroll-h">
			<detail-show :detail="detail"></detail-show>
			<view class="u-padd">
				<approval-step :data-list="dataList"></approval-step>
			</view>
		</scroll-view>
		<view class="footer-btn u-fx-ac" v-if="show">
			<u-button class="u-fx-f1 u-mar-l u-mar-r u-type-info-dark-bg u-type-white" @click="operate(0)">拒绝</u-button>
			<u-button type="primary" class="u-fx-f1 u-mar-r u-type-primary-dark-bg" @click="operate(1)">通过</u-button>
			<u-button type="primary" class="u-mar-r u-type-primary-dark-bg" @click="operate(2)">同意并转交</u-button>
		</view>
		<teacher-tree v-if="show" isRadio :teacherTag="teacherTag" v-show="teacherTag" :schoolInfo="schoolInfo" @close="teacherClose"
		 @confirm="teacherSelcet" :classChecked="[]">
		</teacher-tree>
	</view>
</template>

<script>
import DetailShow from '../../component/DetailShow.vue'
import eventBus from '@u/eventBus';
import { store, actions } from '../store/index.js'
import teacherTree from "@/components/teacher-tree/teacher-tree"
export default {
	components: {
		DetailShow,
		teacherTree
	},
	data() {
		return {
			detail: {
			},
			dataList: [],
			id: '',  
			code: '',
			teacherTag: false,
			schoolInfo: {
				schoolYearId: 0,
				schoolCode: "",
			},
			show: false
		}
	},
	created() {
		this.schoolInfo.schoolCode = store.userInfo.schoolCode;
    this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId;
	},
	mounted() {
		this.show = this.$tools.getQuery().get("status") === '1'
		this.id = this.$tools.getQuery().get("id");
		this.code = this.$tools.getQuery().get("code");
		this.getDetail()
	},
	methods: {
		async getDetail(id) {
			const req = {
				applicationCode: this.code,
				schoolCode: store.userInfo.schoolCode
			}
			const res = await actions.dormApproverDetail(req)
			this.detail = {
				userName: res.data.applicantName,
				typeName: '调宿',
				reason: res.data.reason
			}
			this.dataList = res.data.outApproverDtoList.map(el => {
				return {
					photoUrl: el.approverPhoto,
					dateTime: el.approvalTime ? this.$tools.getDateTime(el.approvalTime, 'dateTime') : '',
					label: '审批人',
					labelName: el.approverName, // 如果是多个用逗号隔开
					statusName: el.status === '1' ? '待审批' : el.status === '2' ? '审批通过' : el.status === '3' ? '审批未通过' : el.status === '4' ? '审批中' : '', // 如果是多个用逗号隔开
					status: el.status === '2' ? 1 : 0,// 此状态只有两种值，1：为已审批的  0：为其他状态
					photoUrl: el.approverPhoto
				}
			})
		},
		teacherClose() {
			this.teacherTag = false;
		},
		teacherSelcet(value) {
			if(value.length === 0 ){
				this.$tools.toast("请选择人员")
				return
			}
			this.teacherTag = false;
			this.approvalList = [];
			this.approvalList = value.map((el) => {
				return {
					applicationCode: this.code,
					approverCode: el.userCode,
					approverName: el.userName,
					approverPhoto: el.photoUrl, // 照片
					status: '4',
					schoolCode: store.userInfo.schoolCode,
					schoolName: store.userInfo.schoolName,
					parentId: this.id
				}
			})
			actions.agreeDormApprover(this.approvalList[0]).then((res) => {
				this.$tools.toast("操作成功");
				this.$tools.goNext(() => {
					eventBus.$emit('getList')
					this.$tools.goBack()
				})
			});
		},
		operate (type) {
			if (type === 1 || !type) {
				const title = type ? '通过' : '拒绝'
				const req = {
					applicationCode: this.code,
					approverCode: store.userInfo.userCode,
					approverName: store.userInfo.userName,
					approverPhoto: store.userInfo.photoUrl,
					parentId: this.id,
					schoolCode: store.userInfo.schoolCode,
					schoolName: store.userInfo.schoolName,
					status: type ? '2' : '3'
				}
				this.$tools.confirm(`确定${title}这条调宿申请吗?`, () => {
					actions.refuseDormApprover(req).then(res => {
						this.$tools.toast('操作成功')
						this.$tools.goNext(() => {
							eventBus.$emit('getList')
							this.$tools.goBack()
						})
					})
				})
			} else {
				this.teacherTag = true
			}
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
