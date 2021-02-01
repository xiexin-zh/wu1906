<template>
	<view class="u-page u-bg-fff">
		<choose-child @change="childInfo"></choose-child>
		<view class="calendar"><uni-calendar @monthSwitch="monthSwitch" :selected="selected" :end-date="endDate" @change="change"></uni-calendar></view>
		<view class="title u-fx-jsb">
			<text>今日上报 {{ total }} 次</text>
			<text @click="nowReport(1)">立即上报</text>
		</view>
		<no-data v-if="dataList.length === 0" msg="暂无上报记录"></no-data>
		<scroll-view v-else scroll-y="true" class="scroll-h" @scrolltolower="loadMore"><steps :talk="dataList"></steps></scroll-view>
	</view>
</template>

<script>
import chooseChild from '@/components/choose-child/choose-child.vue';
import noData from '@/components/no-data/no-data.vue';
import eventBus from '@u/eventBus';
import { store, actions } from './store/index.js';
import steps from './steps.vue';
export default {
	data() {
		return {
			errorImg: '/mobile-img/person-auto.png',
			dataList: [],
			day: this.$tools.getDateTime(new Date(), 'date'),
			endDate: this.$tools.getDateTime(new Date(), 'date'),
			startDay: this.$tools.getDateTime(new Date(), 'date'),
			endDay: this.$tools.getDateTime(new Date(), 'date'),
			selected: [],
			userCode: '',
			userName: '',
			classCode: '',
			gradeCode: '',
			pageList: {
				page: 1,
				size: 15
			},
			morePage: false,
			total: 0
		};
	},
	components: {
		chooseChild,
		noData,
		steps
	},
	async mounted() {
		console.log(store);
		var date = new Date(),
			y = date.getFullYear(),
			m = date.getMonth();
		this.startDay = this.$tools.getDateTime(new Date(y, m, 1), 'date');
		this.endDay = this.$tools.getDateTime(new Date(y, m + 1, 0), 'date');
		this.userCode = store.childList[0].userCode;
		this.userName = store.childList[0].userName;
		this.gradeCode = store.childList[0].gradeCode;
		this.classCode = store.childList[0].classCode;
		eventBus.$on('getList', () => {
			this.showList();
			this.feverList();
		});
		this.showList();
		this.feverList();
	},
	methods: {
		childInfo(item) {
			if (item.userCode !== this.userCode) {
				this.userCode = item.userCode;
				this.gradeCode = item.gradeCode;
				this.classCode = item.classCode;
				this.userName = item.userName;
				this.showList();
				this.feverList();
			}
		},
		// 异常日期
		async feverList() {
			this.selected = []
			const req = {
				userCode: this.userCode,
				schoolCode: store.userInfo.schoolCode,
				startDay: this.startDay,
				endDay: this.endDay
			};
			const res = await actions.getDayFever(req);
			if(res.data.length === 0){
				return
			}
			res.data.forEach(ele => {
				this.selected.push({	
					date: ele,
					info: '发热',
					staue: false
				})
			})
		},
		//  疫情日报
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				...this.pageList,
				userCode: this.userCode,
				schoolCode: store.userInfo.schoolCode,
				day: this.day,
				classCode: this.classCode,
				gradeCode: this.gradeCode
			};
			const res = await actions.getDaily(req);
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
		//切换日期
		change(data) {
			this.day = data.fulldate;
			this.showList();
		},
		//切换月份
		monthSwitch(e) {
			console.log(e.year + '-' + e.month);
			this.startDay = this.$tools.getDateTime(new Date(e.year, e.month - 1, 1), 'date');
			this.endDay = this.$tools.getDateTime(new Date(e.year, e.month, 0), 'date');
			console.log(this.startDay);
			this.feverList();
		},
		nowReport() {
			this.$tools.navTo({
				url: `./form?name=${this.userName}&code=${this.userCode}`
			});
		},
		reportDetail(record) {
			this.$tools.navTo({
				url: './detail?id=' + record.id
			});
		}
	}
};
</script>

<style lang="scss">
.padd-b10 {
	padding-bottom: 10rpx;
}
.scroll-h {
	height: calc(100vh - 900rpx);
}
.scroll {
	height: calc(78vh - 100rpx);
}
.title {
	padding: 30rpx 20rpx 20rpx 20rpx;
	background-color: $u-bg-color;
	text:nth-child(1) {
		font-size: 28rpx;
	}
	text:nth-child(2) {
		font-size: 24rpx;
		color: $u-type-primary;
	}
}
</style>
