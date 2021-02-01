<template>
	<view class="u-page">
		<u-popup v-model="showPopTag" mode="top">
			<view class="search">
				<view class="u-mar-20 u-bold">人员类型</view>
				<view class="money-num u-fx u-mar-20">
					<view
						@click="changeChoose('userType', item, index)"
						:class="
							userTypeCurrent === index
								? 'u-padd-20 u-padd-t10 u-padd-b10 u-bd-1px u-mar-r20 u-color u-type-primary-bg u-type-white u-border-radius '
								: 'u-type-info-light-bg u-padd-20 u-padd-t10 u-padd-b10 u-bd-1px u-mar-r20 u-border-radius'
						"
						v-for="(item, index) in userTypeList"
						:key="index"
					>
						{{ item.val }}
					</view>
				</view>
				<view class="u-mar-20 u-bold">进出类型</view>
				<view class="money-num u-fx u-mar-20">
					<view
						@click="changeChoose('accessType', item, index)"
						:class="
							accessTypeCurrent === index
								? 'u-padd-20 u-padd-t10 u-padd-b10 u-bd-1px u-mar-r20 u-color u-type-primary-bg u-type-white u-border-radius '
								: 'u-type-info-light-bg u-padd-20 u-padd-t10 u-padd-b10 u-bd-1px u-mar-r20 u-border-radius'
						"
						v-for="(item, index) in accessTypeList"
						:key="index"
					>
						{{ item.val }}
					</view>
				</view>
				<view class="u-fx-ac u-mar-t40">
					<u-button @click="cancle" type="primary" class="u-fx-f1 u-bg-fff u-main-color u-button-bd">清除筛选</u-button>
					<u-button @click="confirm" type="primary" class="u-fx-f1 u-type-primary-dark-bg">确定</u-button>
				</view>
			</view>
		</u-popup>
		<view class="head u-padd-t10">
			<view class="u-fx-ac">
				<uni-search-bar class="name-search" @input="cancelSearch" cancelButton="none" placeholder="搜索姓名" @confirm="search"></uni-search-bar>
				<u-icon class="u-icon-40" size="40" color="#fff" name="list-dot" @click="showPopTag = !showPopTag"></u-icon>
			</view>
			<button plain class="date-search u-mar-20 u-mar-t10" @click="onShowDatePicker('rangetime')">
				<view class="u-placeholder-color u-fx-jsa" v-if="rangetime && rangetime.length !== 0">
					<text>{{ rangetime[0] | gmtToDate('date') }}</text>
					<text>~</text>
					<text>{{ rangetime[1] | gmtToDate('date') }}</text>
				</view>
				<view v-else class="u-placeholder-color u-fx-jsa">
					<text>开始时间</text>
					<text>~</text>
					<text>结束时间</text>
				</view>
				<view v-if="rangetime.length !== 0" class="clear" @click.stop="clear"><uni-icons color="#fff" class="u-type-info" size="20" type="clear" /></view>
			</button>
		</view>
		<view class="">
			<mx-date-picker
				:show="showPicker"
				:type="type"
				:value="value"
				:show-tips="true"
				:begin-text="'开始'"
				:end-text="'结束'"
				:show-seconds="true"
				@confirm="onSelected"
				@cancel="onSelected"
			/>
		</view>
		<view class="list u-bg-fff u-mar-20 u-padd-20">
			<view class="th u-fx-jsa u-fx-ac u-fx-jc u-mar-b20">
				<text class="left">姓名</text>
				<view class="md u-fx-ac u-fx-jc">
					<text>时间</text>
					<view class="icon u-fx-ver"></view>
				</view>
				<text class="right u-padd-l20">进/出</text>
			</view>
			<scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
				<no-data msg="暂无出入记录~" v-if="recordList.length === 0"></no-data>
				<view v-else>
					<view v-for="(item, i) in recordList" :key="i" class="tbody u-bd-b u-fx-jsb u-fx-ac" @click="goDetail(item)">
						<text class="left">{{ item.userName }}</text>
						<text class="md">{{ getDateTime(new Date(item.accessTime), 'datetime') }}</text>
						<text class="right u-text-center">{{ item.accessType == '1' ? '进' : '出' }}</text>
						<view class="rit-icon"></view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue';
import { store, actions } from '../store/index.js';
import noData from '@/components/no-data/no-data.vue';
export default {
	components: {
		MxDatePicker,
		noData
	},
	data() {
		return {
			showPicker: false,
			showPopTag: false,
			rangetime: [],
			type: 'rangetime',
			value: '',
			recordList: [],
			pageList: {
				page: 1,
				size: 20
			},
			morePage: false,
			searchObj: {},
			keyword: '',
			userType: '',
			accessType: '',
			userTypeCurrent: 0,
			accessTypeCurrent: 0,
			userTypeList: [
				{
					key: '',
					val: '全部'
				},
				{
					key: 4,
					val: '教职工'
				},
				{
					key: 8,
					val: '学生'
				},
				{
					key: 16,
					val: '家长'
				},
				{
					key: 32,
					val: '访客'
				}
			],
			accessTypeList: [
				{
					key: '',
					val: '全部'
				},
				{
					key: 1,
					val: '进'
				},
				{
					key: 2,
					val: '出'
				}
			]
		};
	},
	mounted() {
		this.showList();
	},
	methods: {
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				schoolCode: store.userInfo.schoolCode,
				...this.searchObj,
				accessType: this.accessType,
				userType: this.userType,
				userName: this.keyword,
				pageNum: this.pageList.page,
				pageSize: this.pageList.size
			};
			const res = await actions.getrecordList(req);
			if (tag) {
				this.recordList = this.recordList.concat(res.data.list);
			} else {
				this.recordList = res.data.list;
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
		changeChoose(type, money, index) {
			if (type === 'userType') {
				this.userType = this.userTypeList[index].key;
				this.userTypeCurrent = index;
			} else if (type === 'accessType') {
				this.accessType = this.accessTypeList[index].key;
				this.accessTypeCurrent = index;
			}
		},
		clear() {
			this.rangetime = [];
			this.searchObj = {};
			this.showList();
		},
		onShowDatePicker(type) {
			//显示
			this.type = type;
			this.showPicker = !this.showPicker;
			this.value = this[type];
		},
		onSelected(e) {
			this.showPicker = false;
			if (!e) {
				return;
			}
			this[this.type] = e.value;
			this.searchObj = {
				startTime: this.getDateTime(new Date(e.value[0])),
				endTime: this.getDateTime(new Date(e.value[1]))
			};
			this.showList();
		},
		confirm() {
			this.showList();
			this.showPopTag = false;
		},
		cancle() {
			this.userTypeCurrent = 0;
			this.accessTypeCurrent = 0;
			this.userType = '';
			this.accessType = '';
			this.showList();
			this.showPopTag = false;
		},
		search(value) {
			console.log(value);
			this.keyword = value.value;
			this.showList();
		},
		cancelSearch(value) {
			console.log(value);
			this.keyword = value.value;
			this.showList();
		},
		goDetail(item) {
			this.$tools.navTo({
				url:
					'./detail?userName=' +
					item.userName +
					'&userType=' +
					item.userType +
					'&snapPhoto=' +
					item.snapPhoto +
					'&accessPlace=' +
					item.accessPlace +
					'&accessType=' +
					item.accessType +
					'&accessTime=' +
					this.getDateTime(new Date(item.accessTime), 'datetime'),
				title: '查看出入详情'
			});
		},
		getDateTime(date, type) {
			if (date === '' || date === null) {
				return '--';
			}
			const d = new Date(date);
			const res =
				d.getFullYear() +
				'-' +
				(d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
				'-' +
				(d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) +
				' ' +
				(d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) +
				':' +
				(d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()) +
				':' +
				(d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds())
			if (type === 'datetime') {
				return res;
			} else {
				return res.substring(0, 10)
			}
		}
	}
};
</script>
<style lang="scss" scoped>
/deep/ .u-drawer {
	top: 110rpx;
}
/deep/ .u-mask-show {
	margin-top: 110rpx;
}
/deep/ .u-mask-zoom,
/deep/ .u-mask-show {
	transition: none !important;
}
.search {
	height: 100%;
	overflow: hidden;
	.money-num {
		.money-list {
			height: 40rpx;
			line-height: 40rpx;
			text-align: center;
		}
	}
	.u-button-bd {
		border-top: 1rpx solid #ddd;
	}
	/deep/ uni-button {
		border-radius: 0 !important;
	}
}
.u-icon-40 {
	font-size: 40rpx;
}
.head {
	height: 293rpx;
	background: url('http://canpointtest.com/mobile-img/inoutRecord.png') no-repeat;
	background-size: 100% 293rpx;
	button {
		font-size: 28upx;
	}
	.name-search {
		background-color: transparent;
		width: calc(100% - 60rpx);
	}
	.date-search {
		position: relative;
		border: 2rpx solid #fff;
		.u-placeholder-color {
			color: #fff;
		}
		.clear {
			align-items: center;
			line-height: 24px;
			position: absolute;
			right: 10rpx;
			top: 12rpx;
			z-index: 99;
			.u-type-info {
				font-size: 36rpx;
			}
		}
	}
}

.list {
	margin-top: -60rpx;
	font-size: 28rpx;
	border-radius: 16rpx;
	.th {
		background: $uni-color-primary;
		padding: 20rpx 0;
		border-radius: 8rpx;
		color: #fff;
	}
	.tbody {
		position: relative;
		padding: 24rpx 10rpx;
		background: $u-bg-color;
		border-radius: 8rpx;
	}
	.tbody:nth-child(even) {
		background: $uni-bg-color;
	}
	.left {
		width: 25%;
		text-align: center;
	}
	.md {
		width: calc(50% - 40rpx);
		text-align: center;
	}
	.right {
		width: 25%;
	}
	.u-text-center {
		text-align: center;
	}
}
.scroll-h {
	height: calc(100vh - 390rpx);
}
</style>
