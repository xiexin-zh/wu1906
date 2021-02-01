<template>
	<view class="site u-page">
		<dropdown-menu @value0Change="value0Change" @value1Change="value1Change"></dropdown-menu>
		<no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
		<scroll-view scroll-y="true" class="scroll-h u-mar-t20" v-else>
			<view class="approve-list u-mar-b20 u-mar-l20 u-mar-r20" v-for="(item, i) in dataList" :key="i">
				<view class="detail u-fx u-padd-20 u-mar-b20">
					<view class="info u-fx-ac">
						<view class="list u-fx-f1 u-line3">
							<view class="name u-main-color u-font-1 u-fx-jsb u-fx-ac">
								{{ item.applicantName }}
								<view v-if="item.status === '1'">
									<u-icon name="more-dot-fill" color="#2979ff" size="28" @click="operation(item.id)"></u-icon>
								</view>
							</view>
								<view class="u-tips-color">描述：{{ item.reason }}</view>
								<view class="u-tips-color u-mar-b">状态：
									<text :style="{color: item.status === '1' ? '#2979ff' : item.status === '2' ? '#19be6b' : item.status === '3' ? '#fa3534' : '#ff9900'}">
										{{ item.status | approveState }}
									</text>
								</view>
							<view class="u-tips-color u-padd-t time-detail u-bd-t" @click="seeDetail(item.id)">
								<view class="leave-time"> {{ item.applicationTime | gmtToDate('dateTime')}} </view>
								<view class="leave-detail"> 查看详情 > </view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="float-add-btn" @click="add(0)"></view>
		<u-popup v-model="showOperation" class="popup" mode="bottom">
			<view class="cell u-fx-ac-jc u-font-01 u-main-color u-bd-b" @click="add(1)"> 修改 </view>
			<view class="cell u-fx-ac-jc u-font-01 u-main-color " @click="del" > 撤回 </view>
			<view class="cell u-fx-ac-jc u-font-01 u-main-color u-bd-t" @click="showOperation=false">取消</view>
		</u-popup>
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
				pageList: {
					page: 1,
					size: 30
				},
				dataList: [],
				applicationStatus: '',
				day: '',
				detailId: ''
			};
		},
		async mounted() {
			eventBus.$on('getList', () => {
				this.showList();
			});
			this.showList()
		},
		methods: {
			async showList() {
				const req = {
					...this.pageList,
					applicationStatus: this.applicationStatus,
					day: this.day,
					schoolCode: store.userInfo.schoolCode,
					applicantCode: store.userInfo.userCode,
				};
				const res = await actions.getDormApplication(req)
				this.total = res.data.total
				this.dataList = res.data.list
			},
			add (type) {
				this.showOperation = false
				const url = type ? `./form?id=${this.detailId}` : `./form`  
				this.$tools.navTo({
					url: url
				})
			},
			//操作
			operation (id) {
				this.showOperation = true
				this.detailId = id
			},
			//详情
			seeDetail (id) {
				this.$tools.navTo({
					url: `./detail?id=${id}`
				})
			},
			// 撤回
			del() {
				this.showOperation = false
				this.$tools.confirm('确定撤回这条调宿申请吗?', () => {
					actions.delDormApplication({id: this.detailId}).then(res => {
						this.$tools.toast('操作成功')
						this.showList()
					})
				})
			},
			value0Change(val) {
				this.applicationStatus = val
				this.showList()
			},
			value1Change (val) {
				this.day = val
				this.showList()
			}
		}
	};
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
		height: calc(100vh - 100rpx);
	}
</style>
