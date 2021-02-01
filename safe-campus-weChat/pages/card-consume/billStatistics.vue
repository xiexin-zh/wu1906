<template>
	<view class="statistics u-page">
		<choose-child v-if="userType === 1" @change="childInfo"></choose-child>
		<no-data v-if="noDatatag" msg="未开户，请联系相关人员开户~"></no-data>
		<view v-else>
			<view class="year-list">
				<view class="title">{{ yearTitle.split('-')[0] }}年</view>
				<view class="last-month u-fx u-fx-jsa">
					<view @click="searchMonth(month)" :class="{ act: yearTitle === month }" v-for="month in lastMonth" :key="month">{{ month.split('-')[1] }}月</view>
				</view>
			</view>
			<!-- <view class="attandence-title u-mar-t20 u-mar-l20">每日支出消费</view> -->
			<view class="u-mar-r20" id="total-pic"></view>
		</view>
	</view>
</template>

<script>
import chooseChild from '@/components/choose-child/choose-child.vue';
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from './store/index.js';
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
import 'echarts/lib/component/title'
require('echarts/lib/component/tooltip');
export default {
	components: {
		chooseChild,
		noData
	},
	data() {
		return {
			noDatatag: true,
			userType: 2, // 1.学生，2.教职工
			dataList: [],
			attandenceInfo: [],
			lastMonth: this.lastFiveMonth(),
			yearTitle: this.lastFiveMonth().pop(),
			num: ''
		};
	},
	mounted() {
		if (store.userInfo.typeCode === '4') {
			this.userType = 2;
			this.userCode = store.userInfo.userCode;
		} else if (store.userInfo.typeCode === '16') {
			this.userType = 1;
			this.userCode = store.childList[0].userCode;
		}
		this._getAccountInfo();
	},
	methods: {
		// 家长切换学生
		childInfo(item) {
			if (item.userCode !== this.userCode) {
				this.userCode = item.userCode;
				this._getAccountInfo();
			}
		},
		// 用户账户信息
		async _getAccountInfo() {
			const res = await actions.getAccountInfo({
				schoolCode: store.userInfo.schoolCode,
				userCode: this.userCode,
				userType: this.userType
			});
			if (!res.data || res.data.length === 0) {
				this.noDatatag = true;
				return;
			}
			this.noDatatag = false;
			this.searchMonth(this.yearTitle);
		},
		lastFiveMonth(num = 6) {
			var monthArr = [];
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 2;
			if (month > num) {
				for (var i = month - 1; i >= month - num; i--) {
					monthArr.push(year + '-' + (i > 9 ? i : '0' + i));
				}
			} else {
				var lastY = year - 1;
				var cMonth = month - 1;
				var lastM = num - (month - 1);
				for (let i = cMonth; i > 0; i--) {
					monthArr.push(year + '-' + (i > 9 ? i : '0' + i));
				}
				for (let i = 12; i > 12 - lastM; i--) {
					monthArr.push(lastY + '-' + (i > 9 ? i : '0' + i));
				}
			}
			return monthArr.reverse();
		},
		getDaysInOneMonth(year, month) {
			month = parseInt(month, 10);
			var d = new Date(year, month, 0);
			return d.getDate();
		},
		async searchMonth(month) {
			const xData = [];
			const yData = [];
			let days = this.getDaysInOneMonth(month.split('-')[0], month.split('-')[1]);
			for (var i = 1; i <= days; i++) {
				xData.push(month.split('-')[1] + '-' + (i > 9 ? i : '0' + i));
				yData.unshift(0);
			}
			this.yearTitle = month;
			const req = {
				dataTime: month,
				userCode: store.userInfo.userCode
			};
			const res = await actions.queryStatistics(req);
			if (res.data) {
				res.data.forEach(ele => {
					const index = xData.findIndex(list => {
						return list === ele.dayStr.substring(ele.dayStr.length - 5)
					})
					if (index !== -1) {
						yData[index] = ele.amountNum
					}
				})
				this.drawLine(yData, xData);
			}
		},
		drawLine(yData, xDate) {
			let myChart = echarts.init(document.getElementById('total-pic'));
			myChart.setOption({
				title: {
					text: '每日支出消费',
					padding: [20, 0, 0, 10],
					textStyle: {
						fontSize: 16,
						color: '#333'
					},
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						lineStyle: {
							width: 1,
							type: 'dashed'
						}
					},
					formatter: (params) => {
							 const day = new Date(this.yearTitle.split('-')[0], this.yearTitle.split('-')[1] - 1, params[0].name.split('-')[1]).getDay()
							 const weeks = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
					     return params[0].name + ' ' + weeks[day]  + ' 消费 ￥' + params[0].value  + '元'
					  }
				},
				color: ['#0084FF'],
				grid: {
					left: '3%',
					right: '5%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: xDate
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '消费',
						type: 'line',
						smooth: true,
						itemStyle: {
							normal: {
								areaStyle: {
									type: 'default',
									// 渐变色实现
									color: new echarts.graphic.LinearGradient(
										0.5,
										0,
										0.5,
										1, // 变化度
										// 三种由深及浅的颜色
										[
											{
												offset: 0,
												color: '#0084FF'
											},
											{
												offset: 1,
												color: '#fff'
											}
										]
									)
								}
							}
						},
						data: yData
					}
				]
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.u-page {
	background-color: #fff;
	color: $u-main-color;
}
.statistics {
	.year-list {
		background-color: $u-type-primary;
		.title {
			color: $uni-bg-color;
			font-size: 34rpx;
			font-weight: bold;
			text-align: center;
			padding: 30rpx 0 0rpx 0;
		}
		.last-month {
			padding: 20rpx 0 40rpx 0;
			& > view {
				color: $uni-bg-color;
				text-align: center;
				height: 80rpx;
				width: 80rpx;
				line-height: 80rpx;
				border-radius: 100%;
			}
			.act {
				background-color: $uni-bg-color;
				color: $u-type-primary;
				font-weight: bold;
			}
		}
	}
	.attandence-title {
		height: 60rpx;
		line-height: 60rpx;
		font-size: 32rpx;
	}
	#total-pic {
		height: 600rpx;
	}
}
</style>
