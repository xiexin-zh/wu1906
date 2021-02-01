<template>
	<view class="u-page u-bg-fff">
		<u-subsection v-if="userType !== '1'" :list="tabList" :current="current" @change="tabChange" active-color="#2979ff"></u-subsection>
		<!-- <u-tabs v-if="userType !== '1'" class="padd-b10" :list="tabList" :current="current" @change="tabChange"></u-tabs> -->
		<view class="calendar"><uni-calendar @monthSwitch="monthSwitch" :selected="selected" :end-date="endDate" @change="change"></uni-calendar></view>
		<view v-if="current === 0" class="title u-fx-jsb">
			<text>今日上报 {{ total }} 次</text>
			<text @click="nowReport(1)">立即上报</text>
		</view>
		<view v-else class="u-bd-1px"></view>
		<scroll-view v-if="current === 0" scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
			<no-data v-if="dataList.length === 0" msg="暂无上报记录"></no-data>
			<steps v-else :talk="dataList"></steps>
		</scroll-view>
		<view class="report" v-else>
			<view class="subsection">
				<u-subsection 
				  v-if="list.length > 0"
					style="height:60rpx;" 
					:list="list" 
					:current="curNow"
					mode="subsection" 
					font-size="12"
					active-color="#3193FD"
					@change="typeChange($event)">
				</u-subsection>
			</view>
			<view class="u-fx-jsa">
				<view class="info u-fx-ac-jc" @click="countDetail(1, dataCount.reported)">
					<text>上报</text>
					<text>{{ dataCount.reported }} 人</text>
				</view>
				<view class="info u-fx-ac-jc" @click="countDetail(0, dataCount.notReported)">
					<text>未上报</text>
					<text>{{ dataCount.notReported }} 人</text>
				</view>
				<view class="info u-fx-ac-jc err" @click="countDetail(2, dataCount.fever)">
					<text>发热</text>
					<text>{{ dataCount.fever }} 人</text>
				</view>
			</view>
		</view>
		<u-popup ref="popup" mode="center" length="75%" border-radius="8" :mask-close-able="false">
			<no-data v-if="reportCountList.length === 0" msg="暂无记录"></no-data>
			<view v-else class="common-btn bg-top">{{ title }}{{ count }}人</view>
			<scroll-view v-if="reportCountList.length !== 0" scroll-y="true" class="scroll" @scrolltolower="loadMoreStudent">
				<view class="student-list">
					<view class="u-fx-jsb u-fx-ac" v-for="(item, i) in reportCountList" :key="i" @click="reportDetail(item)">
						<view class="student u-fx-ac">
							<image :src="item.photoUrl ? item.photoUrl : errorImg" />
							<span>{{ item.userName }}</span>
						</view>
						<text>{{ title }}</text>
					</view>
				</view>
			</scroll-view>
			<view class="common-btn" @click="confirm">确定</view>
		</u-popup>
	</view>
</template>

<script>
import noData from '@/components/no-data/no-data.vue';
import eventBus from '@u/eventBus';
import { store, actions } from './store/index.js';
import steps from './steps.vue';
export default {
	data() {
		return {
			errorImg: '/mobile-img/person-auto.png',
			tabList: [
				{
					name: '我的'
				},
				{
					name: '班级'
				}
			],
			current: 0,
			dataList: [],
			day: this.$tools.getDateTime(new Date(), 'date'),
			endDate: this.$tools.getDateTime(new Date(), 'date'),
			startDay: this.$tools.getDateTime(new Date(), 'date'),
			endDay: this.$tools.getDateTime(new Date(), 'date'),
			selected: [],
			title: '未上报',
			count: 0,
			pageList: {
				page: 1,
				size: 15
			},
			pageList2: {
				page: 1,
				size: 15
			},
			morePage: false,
			morePage2: false,
			total: 0,
			type: 0,
			userType: '1', //1教职工2班主任3校医
			dataCount: {
				reported: 0,
				notReported: 0,
				fever: 0
			},
			reportCountList: [],
			classCode: '',
			gradeCode: '',
			list: [],
			curNow: 0,
			thermometryDate: this.$tools.getDateTime(new Date(), 'date'),
			startTime: '',
			endTime: ''
		};
	},
	components: {
		steps,
		noData
	},
	async mounted() {
		let date = new Date(),
			y = date.getFullYear(),
			m = date.getMonth();
		this.startDay = this.$tools.getDateTime(new Date(y, m, 1), 'date');
		this.endDay = this.$tools.getDateTime(new Date(y, m + 1, 0), 'date');
		await this.getClassInfo();
		eventBus.$on('getList', () => {
			this.showList();
			this.feverList();
		});
		this.showList();
		this.feverList();
	},
	methods: {
		async planListGet() {
			const req = {
				schoolCode: store.userInfo.schoolCode,
        thermometryDate: this.thermometryDate
			}
			const res = await actions.getTempPlan(req)
			if(!res.data) return
			this.list = res.data.map(el => {
				return {
					...el,
					name:el.planName
				}
			})
			if (res.data.length > 0) {
				this.startTime =this.$tools.getDateTime(res.data[0].startTime, 'second', 's')
				this.endTime =this.$tools.getDateTime(res.data[0].endTime, 'second', 's')
				this.showList()
			} else {
				this.dataCount = {
					reported: 0,
					notReported: 0,
					fever: 0
				}
			}
		},
		async getClassInfo() {
			// 验证是否是校医
			const req = {
				userCode: store.userInfo.userCode,
				schoolCode: store.userInfo.schoolCode
			};
			const res = await actions.isXY(req);
			if (res.data) {
				this.userType = '3';
				this.tabList[1].name = '学校';
			} else {
				// 获取绑定的班级信息
				const res = await actions.getClassInfo({
					SchoolCode: store.userInfo.schoolCode,
					userType: store.userInfo.typeCode,
					userCode: store.userInfo.userCode
				});
				if (res.data.classCode) {
					this.userType = '2';
					this.classCode = res.data.classCode;
					this.gradeCode = res.data.gradeCode;
				} else {
					this.userType = '1';
				}
			}
		},
		// 异常日期
		async feverList() {
			this.selected = [];
			const req = {
				schoolCode: store.userInfo.schoolCode,
				startDay: this.startDay,
				endDay: this.endDay
			};
			if (this.current === 0) {
				req.userCode = store.userInfo.userCode;
			} else {
				req.userCode = null;
				if (this.userType === '2') {
					req.classCode = this.classCode;
					req.gradeCode = this.gradeCode;
				} else if (this.userType === '3') {
					req.classCode = null;
					req.gradeCode = null;
				}
			}
			const res = await actions.getDayFever(req);
			if (res.data.length === 0) {
				return;
			}
			res.data.forEach(ele => {
				this.selected.push({
					date: ele,
					info: '发热',
					staue: false
				});
			});
		},
		//  疫情日报
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			if (this.current === 0) {
				const req = {
					...this.pageList,
					userCode: store.userInfo.userCode,
					schoolCode: store.userInfo.schoolCode,
					day: this.day
				};
				const res = await actions.getDaily(req);
				this.total = res.data.total;
				if (tag) {
					this.dataList = this.dataList.concat(res.data.list);
				} else {
					this.dataList = res.data.list;
				}
				this.morePage = res.data.hasNextPage;
			} else {
				const req = {
					...this.pageList,
					schoolCode: store.userInfo.schoolCode,
					day: this.day,
					startTime: this.startTime,
					endTime: this.endTime,
				};
				if (this.userType === '2') {
					req.classCode = this.classCode;
					req.gradeCode = this.gradeCode;
				} else if (this.userType === '3') {
					req.classCode = null;
					req.gradeCode = null;
				}
				const res = await actions.getReportCount(req);
				this.dataCount = res.data;
			}
		},
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
		//切换选项卡
		tabChange(index) {
			this.current = index;
			this.feverList();
			if (index === 0) {
				this.showList()
			} else {
				this.planListGet()
			}
			// this.showList();
		},
		//切换日期
		change(data) {
			this.day = data.fulldate;
			if (this.current === 1) {
				this.thermometryDate = data.fulldate;	
				this.list = []
				this.planListGet();
			} else {
				this.showList();
			}			
		},
		//切换月份
		monthSwitch(e) {
			console.log(e.year + '-' + e.month);
			this.startDay = this.$tools.getDateTime(new Date(e.year, e.month - 1, 1), 'date');
			this.endDay = this.$tools.getDateTime(new Date(e.year, e.month, 0), 'date');
			this.feverList();
		},
		nowReport() {
			this.$tools.navTo({
				url: './form'
			});
		},
		reportDetail(record) {
			if (this.title === '未上报') {
				return;
			}
			this.$tools.navTo({
				url: './detail?userCode=' + record.userCode + '&date=' + this.day
			});
		},
		async countDetail(type = 0, count) {
			this.reportCountList = [];
			this.count = count;
			this.type = type;
			this.title = type === 0 ? '未上报' : type === 1 ? '上报' : '发热';
			this.pageList2.page = 1;
			this.showReportCount();
			this.$refs.popup.open();
		},
		async showReportCount(tag = false) {
			if (tag) {
				this.pageList2.page += 1;
			} else {
				this.pageList2.page = 1;
			}
			const req = {
				...this.pageList2,
				schoolCode: store.userInfo.schoolCode,
				day: this.day,
				startTime: this.startTime,
				endTime: this.endTime
			};
			if (this.userType === '2') {
				req.classCode = this.classCode;
				req.gradeCode = this.gradeCode;
			} else if (this.userType === '3') {
				req.classCode = null;
				req.gradeCode = null;
			}
			if (this.type === 0) {
				req.enableRecord = false;
			} else if (this.type === 1) {
				req.enableRecord = true;
			} else if (this.type === 2) {
				req.enableFever = true;
				req.enableRecord = true;
			}
			const res = await actions.getReportByState(req);
			if (tag) {
				this.reportCountList = this.reportCountList.concat(res.data.list);
			} else {
				this.reportCountList = res.data.list;
			}
			this.morePage2 = res.data.hasNextPage;
		},
		loadMoreStudent() {
			if (!this.morePage2) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showReportCount(true);
		},
		confirm() {
			this.$refs.popup.close();
		},
		// 测温计划点击切换
		typeChange (index) {
			const data = this.list[index]
			this.startTime =this.$tools.getDateTime(data.startTime, 'second', 's')
			this.endTime =this.$tools.getDateTime(data.endTime, 'second', 's')
			this.showList()
		}
	}
};
</script>

<style lang="scss">
.padd-b10 {
	padding-bottom: 10rpx;
}
.scroll-h {
	height: calc(100vh - 970rpx);
}
.scroll {
	height: calc(58vh - 100rpx);
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
.report {
	margin: 20rpx 0 0 10rpx;
	.info {
		background-color: $u-bg-color;
		border-radius: $u-border-radius;
		padding: 40rpx 60rpx;
		text:first-child {
			margin-bottom: 10rpx;
		}
	}
	.err {
		color: $u-type-error;
	}
}
.student-list {
	// margin: 20rpx 40rpx;
	view {
		padding: 10rpx 0;
		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 100%;
			margin-right: 20rpx;
		}
	}
	.err {
		color: $u-type-error;
	}
}
.bg-top {
	background-color: $u-bg-color;
	color: $u-main-color;
}
.subsection{
	margin: 30rpx;
}
</style>
