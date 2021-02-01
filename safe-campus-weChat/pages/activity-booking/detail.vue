<template>
	<view class="u-page">
		<view class="nav-tab"><tab-menu :data-list="tabList" @change="changeMenu"></tab-menu></view>
		<view class="dropdown u-fx-jsb u-fx-ac">
			<view class="u-fx-ac">
				<text>签到状态：</text>
				<ms-dropdown-menu><ms-dropdown-item v-model="value0" :list="typeList"></ms-dropdown-item></ms-dropdown-menu>
			</view>
			<view class="">
				<text class="u-type-error">未签到：{{ unSignCount }}人</text>
				<text class="mar-l20">已签到：{{ signCount }}人</text>
			</view>
		</view>
		<no-data class="mar-t20" v-if="signList.length === 0" msg="暂无数据"></no-data>
		<scroll-view v-if="current === 0" scroll-y="true" @scrolltolower="loadMore" class="class-style scroll-h">
			<view class="approve-list" v-for="(item, i) in signList" :key="i">
				<view class="detail u-fx">
					<view class="process-type">
						<u-tag v-if="item.signStatus === '2'" type="success" text="已签到" />
						<u-tag v-if="item.signStatus === '1'" type="error" text="未签到" />
					</view>
					<view class="info">
						<view class="list">
							<view class="name u-main-color">
								{{ item.userName }}
								<text class="u-tips-color">{{ item.workNo }}</text>
							</view>
							<view class="u-fx-jsb">
								<text class="u-tips-color u-font-02">{{ item.orgName }}</text>
							</view>
							<view v-if="item.signStatus === '2'" class="u-fx-jsb u-tips-color u-font-02">
								<text>签到设备：{{ item.deviceName }}</text>
								<text>{{ item.signTime | getToDate() }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<scroll-view v-else scroll-y="true" @scrolltolower="loadMore" class="class-style scroll-h">
			<view class="approve-list" v-for="(item, i) in signList" :key="i">
				<view class="detail u-fx">
					<view class="process-type">
						<u-tag v-if="item.signStatus === '2'" type="success" text="已签到" />
						<u-tag v-if="item.signStatus === '1'" type="error" text="未签到" />
					</view>
					<view class="info">
						<view class="list">
							<view class="name u-main-color">
								{{ item.userName }}
								<text class="u-tips-color">{{ item.workNo }}</text>
							</view>
							<view class="u-fx-jsb">
								<view class="u-tips-color">{{ item.gradeName }}{{ item.className }}</view>
								<view v-if="item.signStatus === '2'" class="u-main-color time">
									<text>{{ item.signTime | getToDate() }}</text>
								</view>
							</view>
							<view v-if="item.signStatus === '2'" class="u-tips-color">签到设备：{{ item.deviceName }}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import noData from '@/components/no-data/no-data.vue';
import eventBus from '@u/eventBus.js';
import { store, actions } from './store/index.js';
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
export default {
	data() {
		return {
			pageList: {
				page: 1,
				size: 20
			},
			morePage: false,
			current: 0,
			tabList: [
				{
					name: '其他人员'
				},
				{
					name: '班级'
				}
			],
			value0: '0',
			typeList: [
				{
					text: '全部',
					value: '0'
				},
				{
					text: '已签到',
					value: '1'
				},
				{
					text: '未签到',
					value: '2'
				}
			],
			signList: [],
			unSignCount: 0,
			signCount: 0
		};
	},
	components: {
		msDropdownMenu,
		msDropdownItem,
		noData
	},
	watch: {
		value0(val, oldval) {
			if (val !== oldval) {
				this.pageList.page = 1;
				this.showList();
			}
		}
	},
	mounted() {
		this.id = this.$tools.getQuery().get('id');
		this.showList();
	},
	methods: {
		changeMenu(current) {
			this.current = current;
			this.pageList.page = 1;
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
				id: this.id,
				type: this.current === 0 ? '2' : '1',
				signStatus: this.value0 === '0' ? '' : this.value0 === '1' ? '2' : '1'
			};
			const res = await actions.getSignDetail(req);
			this.unSignCount = res.data.unSignCount;
			this.signCount = res.data.signCount;
			if (tag) {
				this.signList = this.signList.concat(res.data.list.list);
			} else {
				this.signList = res.data.list.list;
			}
			this.morePage = res.data.list.hasNextPage;
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
.scroll-h {
	height: calc(100vh - 200rpx);
	margin-top: 20rpx;
}
.approve-list {
	background-color: $uni-bg-color;
	border-radius: 16rpx;
	padding: $u-mp-20;
	margin: $u-mp-20;
	position: relative;
	&:first-child {
		margin-top: 0;
	}
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
		width: 100%;
		.list {
			view {
				margin: 10rpx 0;
			}
			.name,
			.time {
				text {
					margin-left: 20rpx;
				}
			}
			.mar-b0 {
				margin: 10rpx 0 0 0;
			}
		}
	}
}
.dropdown {
	padding: 20rpx 20rpx 0rpx 20rpx;
	font-size: 12px;
	.dropdown-menu {
		border: 1rpx solid #ddd;
		border-radius: 8rpx;
	}
	/deep/ .dropdown-item__selected {
		padding: 10rpx 30rpx;
	}
}
</style>
