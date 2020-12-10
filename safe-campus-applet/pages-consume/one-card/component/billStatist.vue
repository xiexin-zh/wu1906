<template>
	<view class="statistics u-page">
		<no-data v-if="noDatatag" msg="未开户，请联系相关人员开户~"></no-data>
		<view v-else>
			<view class="year-list">
				<view class="title">{{ yearTitle.split('-')[0] }}年</view>
				<view class="last-month u-fx u-fx-jsa">
					<view @click="searchMonth(month)" :class="{ act: yearTitle === month }" v-for="month in lastMonth" :key="month">{{ month.split('-')[1] }}月</view>
				</view>
			</view>
			<view class="qiun-charts u-padd-t20" >
				<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" disable-scroll="true" @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
			</view>
		</view>
	</view>
</template>

<script>
import NoData from '../../component/NoData.vue';
import { store, actions } from '@store';
import uCharts from '../../../u-charts/u-charts.min.js';
var _self;
var canvaLineA = null;
export default {
	components: {
		NoData
	},
	data() {
		return {
			noDatatag: true,
			lastMonth: this.lastFiveMonth(),
			yearTitle: this.lastFiveMonth().pop(),
			num: '',
			cWidth: '',
			cHeight: '',
			pixelRatio: 1
		};
	},
	created() {
		_self = this;
		this.accountInfo = uni.getStorageSync('accountInfo');
		if (!this.accountInfo) {
			this.noDatatag = true;
			return;
		}
		this.noDatatag = false;
		this.cWidth = uni.upx2px(750);
		this.cHeight = uni.upx2px(600);
		this.searchMonth(this.yearTitle);
	},
	methods: {
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
				userCode: this.accountInfo.userCode
			};
			const res = await actions.queryStatistics(req);
			if (res.data) {
				res.data.forEach(ele => {
					const index = xData.findIndex(list => {
						return list === ele.dayStr.substring(ele.dayStr.length - 5);
					});
					if (index !== -1) {
						yData[index] = ele.amountNum;
					}
				});
				let LineA = { categories: [], series: [] };
				LineA.categories = xData;
				LineA.series = [{ name: '每日消费支出', data: yData }];
				console.log(LineA)
				_self.showLineA('canvasLineA', LineA);
			}
		},
		showLineA(canvasId, chartData) {
			canvaLineA = new uCharts({
				$this: _self,
				canvasId: canvasId,
				type: 'line',
				fontSize: 11,
				padding: [15, 15, 0, 15],
				legend: {
					show: true,
					padding: 10,
					lineHeight: 11,
					margin: 5
				},
				dataLabel: true,
				dataPointShape: true,
				dataPointShapeType: 'hollow',
				background: '#FFFFFF',
				pixelRatio: _self.pixelRatio,
				categories: chartData.categories,
				series: chartData.series,
				animation: true,
				enableScroll: true, //开启图表拖拽功能
				xAxis: {
					disableGrid: false,
					type: 'grid',
					gridType: 'dash',
					itemCount: 6,
					scrollShow: true,
					scrollAlign: 'left'
				},
				yAxis: {
					//disabled:true
					gridType: 'dash',
					//splitNumber: 8,
					//min: 10,
					//max: 180,
					format: val => {
						return val.toFixed(2) + '元';
					}
				},
				width: _self.cWidth * _self.pixelRatio,
				height: _self.cHeight * _self.pixelRatio,
				extra: {
					line: {
						type: 'straight'
					}
				}
			});
		},
		touchLineA(e) {
			canvaLineA.scrollStart(e);
		},
		moveLineA(e) {
			canvaLineA.scroll(e);
		},
		touchEndLineA(e) {
			canvaLineA.scrollEnd(e);
			//下面是toolTip事件，如果滚动后不需要显示，可不填写
			canvaLineA.touchLegend(e);
			canvaLineA.showToolTip(e, {
				format: function(item, category) {
					return category + ' ' + item.name + ':' + item.data;
				}
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
	.qiun-charts {
		width: 750upx;
		height: 600upx;
		background-color: #ffffff;
	}

	.charts {
		width: 750upx;
		height: 600upx;
		background-color: #ffffff;
	}
}
</style>
