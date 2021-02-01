<template>
	<view class="class-detail">
		<scroll-view scroll-y="true" class="scroll-h">
			<detail-show :detail="detail"></detail-show>
			<view class="u-padd">
				<approval-step :data-list="dataList"></approval-step>
			</view>
		</scroll-view>
		<view class="footer-btn u-fx-ac" v-if='showBtn'>
			<u-button class="u-fx-f1 u-mar-l u-mar-r u-type-info-dark-bg u-type-white"  @click="operate(0)">拒绝</u-button>
			<u-button type="primary" class="u-fx-f1 u-mar-r u-type-primary-dark-bg" @click="operate(1)">通过</u-button>
			<u-button type="primary" class="u-mar-r u-type-primary-dark-bg" @click="operate(2)">同意并转交</u-button>
		</view>
		<teacher-tree v-if='showBtn' isRadio :teacherTag="teacherTag" v-show="teacherTag" :schoolInfo="schoolInfo" @close="teacherClose"
		 @confirm="teacherSelcet" :classChecked="[]"></teacher-tree>
	</view>
</template>

<script>
import {
		store,
		actions
	} from "../store/index.js";
	import eventBus from "@u/eventBus";
	import DetailShow from '../../component/DetailShow.vue'
	import teacherTree from "@/components/teacher-tree/teacher-tree";
	export default {
		components: {
			DetailShow,
			teacherTree
		},
		data() {
			return {
				id: "",
				applicationCode:'',
				schoolCode:'',
				teacherTag:false,
				showBtn:false,
				detail: {},
				dataList: [],
				schoolInfo:{
					schoolCod:0,
					schoolYearId:''
				},
			};
		},
		created() {
			this.schoolInfo.schoolCode = store.userInfo.schoolCode;
      this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId;
			this.id = this.$tools.getQuery().get('id')
			this.applicationCode = this.$tools.getQuery().get('applicationCode')
			this.schoolCode = this.$tools.getQuery().get('schoolCode')
			this.getDetail();
		},
		mounted() {
			this.showBtn = this.$tools.getQuery().get("optStatus") === '1'
		},
		methods: {
			async getDetail() {
				let req = {
					applicationCode:this.applicationCode,
					schoolCode:this.schoolCode
				}
				const res = await actions.approverDetail(req);
				this.detail = {
					userName: res.data.applicantName,
					typeName: '调班',
					reason: res.data.reason
				}
				this.dataList = res.data.outApproverDtoList.map(el => {
					return {
						photoUrl: el.approverPhoto,
						dateTime:el.approvalTime ? this.$tools.getDateTime(el.approvalTime, 'dateTime') : '',
						label: '审批人',
						labelName: el.approverName, // 如果是多个用逗号隔开
						statusName: el.status === '1' ? '待审批' : el.status === '2' ? '审批通过' : el.status === '3' ? '审批未通过' : el.status === '4' ? '审批中' : '', // 如果是多个用逗号隔开
						status: el.status === '2' ? 1 : 0,// 此状态只有两种值，1：为已审批的  0：为其他状态
					}
				})
			},
			// 操作
			operate (type) {
				if (type === 1 || !type) {
					const title = type ? '通过' : '拒绝'
					const req = {
						applicationCode: this.applicationCode,
						approverCode: store.userInfo.userCode,
						status: type ? '2' : '3'
					}
					this.$tools.confirm(`确定${title}这条调班申请吗?`, () => {
						actions.updateApprover(req).then(res => {
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
						applicationCode:this.applicationCode,// (string, optional): 申请编码 ,
						approverCode:el.userCode,//  (string, optional)审批人编码 ,
						approverName :el.userName,//(string, optional) 审批人名称 ,
						approverPhoto:el.photoUrl,// (string, optional) 审批人照片 ,
						parentId :this.id,//(integer, optional) 上一级审批人 ,
						schoolCode: store.userInfo.schoolCode,// (string, optional)审批人学校 ,
						schoolName : store.userInfo.schoolName,//(string, optional)审批人学校 ,
						status: '4',// (string, optional)申请的审批状态
					};
				});
				actions.agreeForward(this.approvalList[0]).then((res) => {
					this.$tools.toast("操作成功", "success");
					this.$tools.goNext(() => {
						eventBus.$emit('getList')
						this.$tools.goBack()
					});
				})
			},
		},
	};
</script>
<style lang="scss" scoped>
	.top-content {
		color: #fff;
		.shift-box {
			margin-bottom: $u-mp-40;
			.btn {
				color: $u-type-primary-dark;
				.arrow-up {
					position: absolute;
					display: inline-block;
					right: 0;
					transform: translateX(-280%);
					width: 0;
					height: 0;
					border-right: 31rpx solid #fff;
					border-left: 0rpx solid transparent;
					border-top: 27rpx solid transparent;
					border-bottom: 26rpx solid transparent;
				}
			}
		}
		.describe-box{
			.describe-img{
				width: 60rpx;
				height: 60rpx;
				background-color: #fff;
				border-radius: 50%;
				color: $u-type-primary-dark;
			}
		}
	}

	.scroll-h {
		height: calc(100vh - 100rpx);
	}

	.pop {
		padding: 0 20px;
	}
</style>
