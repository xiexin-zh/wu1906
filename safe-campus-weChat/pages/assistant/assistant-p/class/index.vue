<template>
	<view class="site">
		<dropdown-menu @value0Change="value0Change" @value1Change='value1Change' @searchChange="searchChange"></dropdown-menu>
		<no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
		<scroll-view scroll-y="true"  class="scroll-h" v-else>
			<view  class="approve-list" v-for="(item, i) in dataList" :key="item.id">
				<view class="detail u-fx">
					<view class="process-type">
						<u-icon name="more-dot-fill" v-if="item.status==1" color="#2979ff" size="28" @click="operation(item.id)"></u-icon>
					</view>
					<view class="info u-fx-ac">
						<view class="list u-fx-f1">
							<view class="name u-main-color u-font-1">{{ item.applicantName }}</view>
							<view class="u-tips-color">描述：{{item.reason}}</view>
							<view class="u-tips-color">状态：
									<text :style="{color: item.status === '1' ? '#2979ff' : item.status === '2' ? '#19be6b' : item.status === '3' ? '#fa3534' : '#ff9900'}">
										{{ item.status | approveState }}
									</text>
							</view>
							<view class="u-tips-color  time-detail u-bd-t" @click="seeDetail(item.id)">
								<view class="leave-time"> {{ item.applicationTime | gmtToDate('dateTime')}} </view>
								<view class="leave-detail"> 查看详情 > </view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="float-add-btn" @click="add()"></view>
		<u-popup v-model="showOperation" class="popup" mode="bottom">
			<view class="cell u-fx-ac-jc u-font-01 u-main-color u-bd-b" @click="edit()">
				修改
			</view>
			<view class="cell u-fx-ac-jc u-font-01 u-main-color " @click="recall">
				撤回
			</view>
			<view class="cell u-fx-ac-jc u-font-01 u-main-color u-bd-t" @click="showOperation=false">取消</view>
		</u-popup>
	</view>
</template>

<script>
	import eventBus from '@u/eventBus';
	import chooseChild from '@/components/choose-child/choose-child.vue';
	// import DropdownMenu from '../component/DropdownMenu.vue';
	import noData from '@/components/no-data/no-data.vue';
	import {
		store,
		actions,
	} from '../store/index.js';
	export default {
		components: {
			DropdownMenu: () => import('../component/DropdownMenu.vue'),
			noData,
			chooseChild
		},
		data() {
			return {
				showOperation: false,
				showOperationId: '',
				searchObj: {
					applicantCode: store.userInfo.userCode, //申请人编码
					applicationStatus: '', //申请审批状态
					schoolCode: store.userInfo.schoolCode, //学校编码
					startTime: '',
					endTime: '',
					day: ''
				},
				//当前孩子
				theChild: store.childList[0],
				pageList: {
					page: 1,
					size: 15
				},
				formData: {
					visitorName: '',
					phone: '',
					cause: '',
					accessStartTime: this.$tools.getDateTime(new Date(), 'dateTimeWithOutSecond')
				},
				morePage: false,
				dataList: [],
			};
		},
		async mounted() {
			eventBus.$on('getList', () => {
				this.showList();
			});
			this.showList();
		},
		methods: {
			
			value0Change(val) {
				this.searchObj.applicationStatus = val;
				this.showList();
			},
			value1Change(val) {
				this.searchObj.day = val;
				this.showList();
			},
			searchChange(val) {
				this.showList();
			},
			async showList(tag = false) {
				const res = await actions.getApplicationList(this.searchObj);
				this.dataList = res.data || {};
				this.total = res.data.total;
				this.morePage = true;
			},
			//操作
			operation(id) {
				this.showOperation = true
				this.showOperationId = id
			},
			//详情
			seeDetail(id) {
				this.$tools.navTo({
					url: './detail?id=' + id
				});
			},
			//修改
			edit() {
				let obj = this.dataList.find((item) => {
					return item.id = this.showOperationId
				})
				this.$tools.navTo({
					url: `./form?id=${this.showOperationId}&reason =${obj.reason}`
				});
				this.showOperation = false
			},
			//撤回
			recall() {
				this.$tools.confirm("确定撤回吗", () => {
					actions.ApplicationRecall({
						id: this.showOperationId
					}).then((res) => {
						this.$tools.toast("撤回成功", "success");
						this.showList();
					});
				});
				this.showOperation = false
			},
			add(type, id) {
				// type = (type === '已结束' || type === '使用中') ? '1' : type === '未使用' ? '2' : '0'
				this.$tools.navTo({
					url: `./form`,
					title: '调班申请'
				});
			}
		}
	};
</script>

<style lang="scss">
	.approve-list {
		background-color: $uni-bg-color;
		border-radius: 16rpx;
		margin: 20rpx;
		position: relative;

		.detail {
			padding: 20rpx;
			position: relative;

			.process-type {
				top: 10rpx;
				right: 20rpx;
				position: absolute;
				font-size: 48rpx;
				z-index: 1;
			}

			.info {
				width: 100%;

				.list {
					view {
						font-size: 28rpx;
						margin: 20rpx 0;
					}
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
