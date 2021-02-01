<template>
	<view class="site u-page">
		<dropdown-menu @valueOptStatu="valueOptStatu" @valueTime="valueTime" @valueStatu="valueStatu" @searchChange="searchChange"></dropdown-menu>
		<no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
		<scroll-view scroll-y="true" v-else class="scroll-h">
			<view class="approve-list u-mar-20" v-for="(item, i) in dataList" :key="i">
				<view class="detail u-fx u-padd-20 u-mar-b20">
					<view class="process-type">
						<!-- v-if="item.optStatus" -->
						<!-- <u-icon name="more-dot-fill" v-if="item.optStatus==1" color="#2979ff" size="28" @click="operation(item)"></u-icon> -->
						<!-- <u-icon name="more-dot-fill" v-else color="#666" size="28"></u-icon> -->
					</view>
					<view class="info u-fx-ac" @click="seeDetail(item.id, item.applicationCode, item.schoolCode, item.optStatus)">
						<view class="list u-fx-f1 u-line3">
							<view class="name u-main-color u-font-1">{{ item.applicantName }}</view>
							<!-- <view class="name u-main-color u-font-1">{{ item.placeName }}</view> -->
							<view class="u-tips-color">发起人：{{ item.parentName }}</view>
							<view class="u-tips-color">描述：{{ item.reason }}</view>
							<view class="u-tips-color u-mar-b">
								状态：
								<text :style="{ color: item.status === '1' ? '#2979ff' : item.status === '2' ? '#19be6b' : item.status === '3' ? '#fa3534' : '#ff9900' }">
									{{ item.status | approveState }}
								</text>
							</view>
							<view class="u-tips-color u-padd-t time-detail u-bd-t">
								<!-- gmtToDate('date') -->
								<view class="leave-time">{{ item.applicationTime | gmtToDate('dateTime') }}</view>
								<view class="leave-detail">查看详情 ></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import DropdownMenu from '../component/DropdownMenu.vue';
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from '../store/index.js';
export default {
	components: {
		DropdownMenu,
		noData
	},
	data() {
		return {
			value0: '0',
			showOperation: false,
			//操作数据
			operationData: {},
			searchObj: {
				day: '7',
				applicationStatus: '', // (string, optional): 申请审批状态 ,
				approverCode: store.userInfo.userCode, //(string, optional): 审批人编码 ,
				optStatus: '', //(string, optional): 操作状态 ,
				schoolCode: store.userInfo.schoolCode //(string, optional): 学校编码 ,
			},
			pageList: {
				page: 1,
				size: 20
			},
			formData: {
				visitorName: '',
				phone: '',
				cause: '',
				accessStartTime: this.$tools.getDateTime(new Date(), 'dateTimeWithOutSecond')
			},
			morePage: false,
			dataList: [],
			//选择教职工
			teacherTag: false,
			disabled: false,
			schoolInfo: {
				schoolYearId: store.schoolYear.schoolYearId,
				schoolCode: store.userInfo.schoolCode
			},
			teacherList: []
		};
	},
	created() {},
	async mounted() {
		eventBus.$on('getList', () => {
			this.showList();
		});
		this.showList();
	},
	methods: {
		async showList(tag = false) {
			const res = await actions.approverList(this.searchObj);
			this.total = res.data.total;
			this.dataList = res.data || [];
			// this.morePage = res.data.hasNextPage;
		},

		//操作
		// operation(item) {
		// 	this.showOperation = true
		// 	this.operationData = item
		// 	// this.$tools.navTo({
		// 	// 	url: './detail?id=' + id
		// 	// });
		// },
		//详情
		seeDetail(id, applicationCode, schoolCode, optStatus) {
			this.$tools.navTo({
				url: `./detail?id=${id}&applicationCode=${applicationCode}&schoolCode=${schoolCode}&optStatus=${optStatus}`
			});
		},

		//同意并转交
		async consentCare(id, applicationCode) {
			this.teacherTag = true;
			this.ApproverParameters = id;
		},
		//同意轉交选择教职工弹框
		close() {
			this.teacherTag = false;
		},
		confirm(value) {
			this.teacherList = value;
			this.ApproverParameters.approverCode = value.userCode;
			this.ApproverParameters.approverName = value.userName;
			this.teacherTag = false;
		},
		async pass() {
			const res = await actions.updateApprover({ ...this.operationData, status: '0' });
			this.$tools.toast('审批通过', 'success');
			this.showOperation = false;
			this.showList();
		},
		async noPass() {
			const res = await actions.updateApprover({ ...this.operationData, status: '1' });
			this.$tools.toast('审批不通过', 'success');
			this.showOperation = false;
			this.showList();
		},
		valueOptStatu(val) {
			this.searchObj.optStatus = val;
			this.showList();
		},
		valueTime(val) {
			this.searchObj.day = val;
			this.showList();
		},
		valueStatu(val) {
			this.searchObj.applicationStatus = val;
			this.showList();
		},
		searchChange(val) {
			console.log(val);
			this.searchObj = val;
			this.showList();
		},

		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		}
	}
};
</script>

<style lang="scss" scoped>
.approve-list {
	background-color: $uni-bg-color;
	border-radius: 16rpx;
	// margin: 20rpx;
	position: relative;
	.detail {
		padding: 20rpx;
		position: relative;
		.process-type {
			top: 10rpx;
			right: 20rpx;
			position: absolute;
			font-size: 48rpx;
			z-index: 100;
		}
		.info {
			width: 100%;
			.list {
				.time-detail {
					margin: 0rpx;
					width: 100%;
					display: flex;
					justify-content: space-between;
				}
				.mar-b0 {
					margin: 10rpx 0 0 0;
				}
			}
		}
	}
}
.popup {
	.cell {
		height: 80rpx;
	}
}
.scroll-h {
	height: calc(100vh - 90rpx);
}
</style>
