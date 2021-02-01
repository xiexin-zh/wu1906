<template>
	<view class="site u-page">
		<dropdown-menu @value0Change="value0Change" @searchChange="searchChange"></dropdown-menu>
		<no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
		<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
			<view class="u-auto">
				<view class="approve-list" v-for="(item, i) in dataList" :key="i">
					<view class="detail u-fx" @click.stop="add(item.status, item.id)">
						<view class="process-type">
							<u-tag v-if="item.status === '使用中'" mode="dark" type="primary" text="使用中" />
							<u-tag v-if="item.status === '未使用'" mode="dark" type="success" text="未使用" />
							<u-tag v-if="item.status === '已结束'" mode="dark" type="info" text="已结束" />
						</view>
						<view class="info u-fx-ac">
							<view class="list u-fx-f1">
								<view class="name u-main-color u-font-1">场地：{{ item.placeName }}</view>
								<view class="u-tips-color">场地类型：{{ item.placeType | getPlaceType() }}</view>
								<view class="u-tips-color">预订时间：{{ item.reserveDate | gmtToDate('date')}} {{ item.startTime }}-{{ item.endTime }}</view>
								<view v-if="item.openSign === '1'">
									<u-button plain @click="goSignDetail(item.id)" class="sign-num mar-b0" type="primary" size="mini">签到统计：{{ item.signNum }}/{{ item.totalNum }}</u-button >
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="float-add-btn" @click="add('0', '')"></view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import DropdownMenu from './component/DropdownMenu.vue';
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from './store/index.js';
export default {
	components: {
		DropdownMenu,
		noData
	},
	data() {
		return {
			value0: '0',
			searchObj: {
				startTime: '',
				endTime: ''
			},
			pageList: {
				page: 1,
				size: 15
			},
			morePage: false,
			dataList: []
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
			console.log(val);
			this.value0 = val;
			this.showList();
		},
		searchChange(val) {
			console.log(val);
			this.searchObj = val;
			this.showList();
		},
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				...this.pageList,
				startDate: this.searchObj.startTime,
				endDate: this.searchObj.endTime,
				placeType: this.value0 === '0' ? '' : this.value0,
				schoolCode: store.userInfo.schoolCode,
				createCode: store.userInfo.userCode,
				type: '1'
			};
			const res = await actions.getReserveListMobile(req);
			res.data.list.map(el => {
				el.placeName = el.placeName.replace(/,/g, '-')
			})
			this.total = res.data.total;
			if (tag) {
				this.dataList = this.dataList.concat(res.data.list);
			} else {
				this.dataList = res.data.list;
			}
			this.morePage = res.data.hasNextPage;
		},
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
		goSignDetail(id) {
			this.$tools.navTo({
				url: './detail?id=' + id
			});
		},
		add(type, id) {
			type = (type === '已结束' || type === '使用中') ? '1' : type === '未使用' ? '2' : '0'
			this.$tools.navTo({
				url: `./form?type=${type}&id=${id}`,
				title: '场地预订'
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
	}
	.process-type {
		top: 10rpx;
		right: 20rpx;
		position: absolute;
		font-size: 48rpx;
	}
	.info {
		.list {
			view {
				font-size: 28rpx;
				margin: 20rpx 0;
			}
			.mar-b0 {
				margin: 10rpx 0 0 0;
			}
		}
	}
	.sign-num{
		padding: 20rpx;
	}
}
.scroll-h {
	height: calc(100vh - 90rpx);
}
</style>
