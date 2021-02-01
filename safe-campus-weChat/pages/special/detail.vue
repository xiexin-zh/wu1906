<template>
	<view class="detail u-page">
		<no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
		<scroll-view scroll-y="true" class="scroll-h" v-else>
			<view class="detail-top u-fx-ac-jc">
				<view class="u-font-3 u-type-white"> {{ dataList.taskName }} </view>
				<view class="u-font-2 u-mar-t20 u-mar-b20">
					<u-tag :text="dataList.schoolName" shape="circle" />
				</view>
				<view class="u-font-01 u-type-white"> 检查时间：{{ dataList.checkTime }} </view>
			</view>
			<view class="detail-content u-type-white-bg u-padd-20 u-mar-b20 u-mar-l20 u-mar-r20">
				<view class="check-name u-type-white"> 检查项目 </view>
				<ul class="detail-list u-fx">
					<li class="u-tx-c u-fx-ac-jc" v-for="(list,index) in titleList" :key="index"> {{ list }} </li>
				</ul>
				<view class="u-fx">
					<ul class="detail-info info-wth info-bd u-fx-ver">
						<li class="u-tx-c u-fx-ac-jc" :style="{flex: list.standardList.length}" v-for="(list,index) in dataList.itemList" :key="index"> {{ list.name }} </li>
					</ul>
					<ul class="detail-info u-fx-f1">
						<li class="u-tx-c u-fx-ac-jc u-padd-10" v-for="item in standardList" :key="item.id"> {{ item.itemName }} </li>
					</ul>
					<ul class="detail-info info-wth" v-if="state !== '1'">
						<li class="u-tx-c u-fx-ac-jc" v-for="item in standardList" :key="item.id"> {{ item.selfResult === '1' ? '符合' : '不符合' }} </li>
					</ul>
					<ul class="detail-info info-wth" v-if="state !== '2'">
						<li class="u-tx-c u-fx-ac-jc" v-for="item in standardList" :key="item.id"> {{ item.examineResult === '1' ? '符合' : '不符合' }} </li>
					</ul>
					<ul class="detail-info info-wth" v-if="state === '4'">
						<li class="u-tx-c u-fx-ac-jc" v-for="item in standardList" :key="item.id"> {{ item.inspectionResult === '1' ? '符合' : '不符合' }} </li>
					</ul>
				</view>
			</view>
			<view class="check-content u-type-white-bg u-mar-t40 u-mar-l20 u-mar-r20 u-padd-t20 u-padd-b20">
				<view class="check-name u-type-white"> 流水记录 </view>
				<view class="step">
          <view class="u-padd-l20" v-if="dataList.processList.length === 0">暂无数据</view>
					<view
            v-else
						class="step-list u-fx-ac"
						v-for="(data, index) in dataList.processList"
						:key="index"
					>
						<view class="left-w" style="position: relative;">
							<view class="tips"></view>
						</view>
						<view
							class="u-fx-ac u-fx-f1 step-item u-padd-20 u-type-white-bg u-border-radius"
						>
							<view class="u-fx-f1 u-mar-l">
								<view class="u-mar-t10">{{ data.content }}</view>
							</view>
							<view class="u-padd-l40">{{ data.time | gmtToDate("dateTime") }}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import eventBus from '@u/eventBus'
	import noData from '@/components/no-data/no-data.vue'
	import { store, actions } from './store/index.js'
	export default {
		components: {
			noData
		},
		data() {
			return {
				dataList: [ ],
				titleList: [ ], 
				standardList: [ ],
				state: ''
			};
		},
		async mounted() {
			this.taskId = this.$tools.getQuery().get('id')
			this.state = this.$tools.getQuery().get('state')
			this.titleList = 
				this.state === '4' ? ['检查项目','检查标准','自查结果','小组结果','督查结果'] :
				this.state === '3' ? ['检查项目','检查标准','自查结果','小组结果'] :
				this.state === '2' ?  	['检查项目','检查标准','自查结果'] : []
			eventBus.$on('getList', () => {
				this.showList()
			})
			this.showList()
		},
		methods: {
			detail(item) {
				this.$tools.navTo({
					url: `./submit?&id=${item.id}`
				})
			},
			async showList() {
				const res = await actions.getSpecialDetail(this.taskId)
				this.dataList = res.data
				this.standardList = []
				res.data.itemList.map(el => {
					el.standardList.map(item => {
						this.standardList.push(item)
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.detail {
		.scroll-h {
			height: calc(100vh - 20rpx);
			.detail-top {
				height: 400rpx;
				background: url(/mobile-img/special-bg.png) no-repeat;
				background-size: 100% 100%;
				padding-bottom: 100rpx;
			}
			.detail-content {
				margin-top: -90rpx;
				position: relative;
				border-radius: $u-border-radius;
				padding-top: 60rpx;
			.detail-list {
				li {
					width: 80rpx;
					border: 1px solid #eee;
					height: 100rpx;
					border-left: none;
					&:nth-child(1) {
						border-left: 1px solid #eee;
					}
					&:nth-child(2) {
						flex: 1;
					}
				}
			}
		}
		.info-wth {
			li {
				width: 80rpx;
			}
		}
		.detail-info {
			li {
				height: 160rpx;
				border-bottom: 1px solid #eee;
				border-right: 1px solid #eee;
				overflow-y: scroll;
			}
		}
		.info-bd {
			border-left: 1px solid #eee;
		}
	}
	.check-content {
		position: relative;
		.step-list {
			border-left: 1px $u-light-color solid;
			margin: 0 $u-mp-30;
			.tips {
				z-index: 99;
				top: -10rpx;
				position: absolute;
				left: -12rpx;
				width: 20rpx;
				height: 20rpx;
				border-radius: 100%;
				background-color: $u-type-primary;
			}
			min-height: 120rpx;
		}
	}
}
.check-name {
	width: 260rpx;
	height: 70rpx;
	line-height: 60rpx;
	text-align: center;
	background: url(/mobile-img/special-title.png) no-repeat;
	background-size: 100% 100%;
	position: absolute;
	top: -62rpx;
	transform: translate(-50%, 50%);
	left: 50%;
	letter-spacing: 3rpx;
}
</style>
