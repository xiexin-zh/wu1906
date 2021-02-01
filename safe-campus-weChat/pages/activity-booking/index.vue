<template>
	<view class="site u-page">
		<tab-menu :data-list="list" @change="tabChange"></tab-menu>
		<!-- <dropdown-menu @value0Change="value0Change" @searchChange="searchChange"></dropdown-menu> -->
		<no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
		<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h u-mar-t20">
			<view class="u-auto">
				<view class="approve-list" v-for="(item, i) in dataList" :key="i">
					<view class="detail u-fx" @click.stop="add(item.status, item.id)">
						<view class="process-type">
							<u-tag v-if="item.status === '使用中'" mode="dark" type="primary" text="进行中" />
							<u-tag v-if="item.status === '未使用'" mode="dark" type="success" text="未开始" />
							<u-tag v-if="item.status === '已结束'" mode="dark" type="info" text="已结束" />
						</view>
						<view class="info u-fx-ac">
							<view class="list u-fx-f1">
								<view class="name u-main-color">{{ item.description }}</view>
								<view class="u-tips-color">活动地点：{{ item.placeName }}</view>
								<view class="u-tips-color">活动时间：{{ item.reserveDate | gmtToDate('date') }} {{ item.startTime }}-{{ item.endTime }}</view>
								<view>
									<!-- <u-button v-if="item.status !== '未使用'" plain @click="goMeetRecord(item.id)" class="sign-num mar-button" type="primary" size="mini">活动心得</u-button> -->
									<u-button v-if="item.openSign === '1'" plain @click="goSignDetail(item.id)" class="sign-num mar-button" type="primary" size="mini">
										签到统计：{{ item.signNum }}/{{ item.totalNum }}
									</u-button>
									<u-button plain @click="goPoster(item)" class="sign-num mar-button" type="primary" size="mini">查看海报</u-button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view v-if="current === 0" class="float-add-btn" @click="add('0', '')"></view>
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
			list: [
				{
					name: '我发起的'
				},
				{
					name: '我参与的'
				}
			],
			current: 0,
			value0: '0',
			url: '',
			searchObj: {
				startTime: '',
				endTime: ''
			},
			pageList: {
				page: 1,
				size: 15
			},
			morePage: false,
			record: {},
			dataList: []
		};
	},
	async created() {
		eventBus.$on('getList', () => {
			this.showList();
		});
		this.showList();
	},
	methods: {
		tabChange(item) {
			this.current = item;
			this.showList();
		},
		value0Change(val) {
			this.value0 = val;
			this.showList();
		},
		searchChange(val) {
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
				type: '3'
			};
			if (this.current === 0) {
				req.createCode = store.userInfo.userCode;
			} else {
				req.participantsCode = store.userInfo.userCode;
			}
			const res = await actions.getReserveListMobile(req);
			res.data.list.map(el => {
				el.placeName = el.placeName.replace(/,/g, '-');
			});
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
		goPoster(record) {
			this.$tools.navTo({
				url: './poster?id=' + record.id
			});
		},
		goMeetRecord(id) {
			this.$tools.navTo({
				url: './meetRecord?id=' + id
			});
		},
		add(type, id) {
			type = type === '已结束' || type === '使用中' ? '1' : type === '未使用' ? '2' : '0';
			if (this.current === 1 && (type === '0' || type === '2')) {
				type = '1';
			}
			this.$tools.navTo({
				url: `./form?type=${type}&id=${id}`,
				title: '活动发布'
			});
		}
	}
};
</script>

<style lang="scss">
.approve-list {
	background-color: $uni-bg-color;
	border-radius: 16rpx;
	margin: 0rpx 20rpx 20rpx 20rpx;
	position: relative;
	.detail {
		padding: 20rpx;
	}
	.process-type {
		top: 0rpx;
		right: 10rpx;
		position: absolute;
		font-size: 48rpx;
	}
	.info {
		.list {
			view {
				font-size: 28rpx;
				margin: 20rpx 0;
			}
			.mar-button {
				margin: 10rpx 10rpx 0 0;
			}
		}
	}
	.sign-num {
		padding: 20rpx;
	}
}
.scroll-h {
	height: calc(100vh - 90rpx);
}
.poster {
	width: 100%;
	height: 100%;
	position: relative;
	background: url(http://canpointtest.com/mobile-img/poster.png) no-repeat;
	background-size: 100% 100%;
	.top {
		position: absolute;
		top: 90rpx;
		left: 100rpx;
		font-size: 28rpx;
		text-align: center;
		width: 400rpx;
	}
	.title {
		position: absolute;
		top: 140rpx;
		left: 100rpx;
		font-size: 38rpx;
		font-weight: bold;
		text-align: center;
		width: 400rpx;
	}
	.content {
		position: absolute;
		top: 250rpx;
		left: 120rpx;
		width: 360rpx;
		font-size: 24rpx;
		line-height: 48rpx;
		.text-bold {
			font-weight: bolder;
		}
		.scroll-y {
			height: 140rpx;
		}
	}
	.scan {
		position: absolute;
		bottom: 40rpx;
		width: 100%;
		color: #fff;
		font-size: 24rpx;
	}
}
/deep/ .u-close--top-right {
	top: 10rpx;
	right: 10rpx;
}
</style>
