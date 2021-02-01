<template>
	<view class="site u-page">
		<dropdown-menu @valueOptStatu="valueOptStatu" @valueTime="timeChange" @valueStatu="statusChange"></dropdown-menu>
		<no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
		<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h u-mar-t20" v-else>
			<view class="approve-list u-mar-b20 u-mar-l20 u-mar-r20" v-for="(item, i) in dataList" :key="i">
				<view class="detail u-fx u-padd-20 u-mar-b20">
					<view class="info u-fx-ac" @click="detail(item.applicationCode, item.id, item.optStatus)">
						<view class="list u-fx-f1 u-line3">
							<view class="name u-main-color u-font-1"> {{item.applicantName }} </view>
							<view class="u-tips-color">发起人：{{ item.parentName }}</view>
							<view class="u-tips-color">描述：{{ item.reason }}</view>
							<view class="u-tips-color u-mar-b">状态：
								<text :style="{color: item.status === '1' ? '#2979ff' : item.status === '2' ? '#19be6b' : item.status === '3' ? '#fa3534' : '#ff9900'}">
									{{ item.status | approveState }}
								</text>
							</view>
							<view class="u-tips-color u-padd-t time-detail u-bd-t">
								<view class="leave-time"> {{ item.applicationTime | gmtToDate('dateTime') }} </view>
								<view class="leave-detail"> 查看详情 > </view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- <u-popup v-model="showOperation" class="popup" mode="bottom">
			<view class="cell u-fx-ac-jc u-font-01 u-main-color u-bd-b" @click="consentCare(1)"> 同意并转交 </view>
			<view class="cell u-fx-ac-jc u-font-01 u-main-color " @click="pass(2)" > 审批通过 </view>
			<view class="cell u-fx-ac-jc u-font-01 u-main-color" @click="noPass(1)"> 审批不通过 </view>
			<view class="cell u-fx-ac-jc u-font-01 u-main-color u-bd-t" @click="showOperation=false">取消</view>
		</u-popup> -->
	</view>
</template>

<script>
	import eventBus from '@u/eventBus'
	import DropdownMenu from '../component/DropdownMenu.vue'
	import noData from '@/components/no-data/no-data.vue'
	import { store, actions } from '../store/index.js'
	export default {
		components: {
			DropdownMenu,
			noData
		},
		data() {
			return {
				showOperation: false,
				searchObj: {
					startTime: '',
					endTime: ''
				},
				pageList: {
					page: 1,
					size: 15
				},
				morePage: false,
				dataList: [],
				applicationStatus: '',
				day: ''
			};
		},
		async mounted() {
			eventBus.$on('getList', () => {
				this.showList();
			});
			this.showList();
		},
		methods: {
			//操作
			// operation(id) {
			// 	this.showOperation = true
			// 	this.detailId = id
			// },
			//详情
			detail(code, id, status) {
				this.$tools.navTo({
					url: `./detail?code=${code}&id=${id}&status=${status}`
				});
			},
			valueOptStatu (val) {
				this.optStatus = val
				this.showList()
			},
			timeChange (val) {
				this.day = val
				this.showList()
			},
			// 审批状态改变
			statusChange (val) {
				this.applicationStatus = val
				this.showList()
			},
			async showList(tag = false) {
				if (tag) {
					this.pageList.page += 1;
				} else {
					this.pageList.page = 1;
				}
				const req = {
					...this.pageList,
					applicationStatus: this.applicationStatus,
					day: this.day,
					optStatus: this.optStatus,
					schoolCode: store.userInfo.schoolCode,
					approverCode: store.userInfo.userCode
				};
				const res = await actions.getDormApprover(req)
				this.total = res.data.total
				if (tag) {
					this.dataList = this.dataList.concat(res.data.list)
				} else {
					this.dataList = res.data.list
				}
				this.morePage = res.data.hasNextPage
			},
			loadMore() {
				if (!this.morePage) {
					this.$tools.toast('数据已加载完毕')
					return
				}
				this.showList(true)
			}
		}
	}
</script>

<style lang="scss">
	.approve-list {
		background-color: $uni-bg-color;
		border-radius: 16rpx;
		position: relative;
		.detail {
			position: relative;
			.info {
				width: 100%;
				.list {
					.time-detail {
						margin: 0rpx;
						width: 100%;
						display: flex;
						justify-content: space-between;
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
		height: calc(100vh - 80rpx);
	}
</style>
