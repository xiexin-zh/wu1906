<template>
	<view class="qui-page">
		<choose-child @change="childInfo"></choose-child>
		<view class="head">
			<button type="default" @click="onShowDatePicker('rangetime')">
				<text v-if="this.rangetime.length !== 0">{{ rangetime[0] | gmtToDate('date') }}~{{ rangetime[1] | gmtToDate('date') }}</text>
				<text v-else>选择日期时间范围搜索</text>
			</button>
			<view v-if="this.rangetime.length !== 0" class="clear" @click="clear"><uni-icons class="u-type-info" size="24" type="clear" /></view>
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
		<view class="list">
			<view class="th qui-fx-jsa qui-fx-ac qui-fx-jc">
				<text class="left">查寝时间</text>
				<view class="md qui-fx-ac qui-fx-jc">
					<text>地点</text>
					<view class="icon qui-fx-ver"></view>
				</view>
				<text class="right">状态</text>
			</view>
			<no-data msg="暂无出入记录~" v-if="recordList.length === 0"></no-data>
			<scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
				<view v-for="(item, i) in recordList" :key="i" class="tbody qui-bd-b qui-fx-jsb qui-fx-ac">
					<text class="left">{{ getDateTime(new Date(item.accessTime)) }}</text>
					<text class="md">{{ item.accessType == '1' ? '进' : '出' }}</text>
					<text class="right">{{ item.accessPlace }}</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
import chooseChild from '@/components/choose-child/choose-child.vue';
import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue';
import { store, actions } from '../store/index.js';
import noData from '@/components/no-data/no-data.vue';
export default {
	components: {
		chooseChild,
		MxDatePicker,
		noData
	},
	data() {
		return {
			showPicker: false,
			rangetime: [],
			type: 'rangetime',
			value: '',
			recordList: [],
			pageList: {
				page: 1,
				size: 15
			},
			morePage: false,
			searchObj: {},
			userCode: ''
		};
	},
	mounted() {
		this.userCode = store.childList[0].userCode;
		this.showList();
	},
	methods: {
		childInfo(item) {
			if (item.userCode !== this.userCode) {
				this.userCode = item.userCode;
				this.showList();
			}
		},
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				schoolCode: store.userInfo.schoolCode,
				userCode: this.userCode,
				ruleGroupType: 2,
				...this.searchObj,
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
			if (e) {
				this[this.type] = e.value;
			}
			this.searchObj = {
				startTime: this.getDateTime(new Date(e.value[0])),
				endTime: this.getDateTime(new Date(e.value[1]))
			};
			this.showList();
		},
		getDateTime(date, type) {
			if (date === '' || date === null) {
				return '--';
			}
			const d = new Date(date);
			return (
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
			);
		}
	}
};
</script>
<style lang="scss" scoped>
.head {
	height: 80rpx;
	position: relative;
	button {
		margin: 20upx;
		font-size: 28upx;
	}
	.clear {
		align-items: center;
		line-height: 24px;
		padding-left: 5px;
		position: absolute;
		right: 30rpx;
		top: 16rpx;
	}
}

.list {
	padding: 25rpx 20rpx;
	font-size: 28rpx;
	.th {
		background: #7b92f5;
		padding: 20rpx 0;
		border-radius: 8rpx;
		color: #fff;
	}
	.tbody {
		position: relative;
		padding: 25rpx 10rpx;
		background: $uni-bg-color;
	}
	.tbody:nth-child(even) {
		background: $u-bg-color;
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
		text-align: center;
	}
}
.scroll-h {
	height: calc(100vh - 240rpx);
}
</style>
