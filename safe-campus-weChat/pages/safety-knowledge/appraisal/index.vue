<template>
	<view class="home">
		<scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
			<view class="header-bg u-type-white u-fx-jsb">
				<view class="u-fx-ac-jc item">
					<view class="number u-mar-b30 u-bold">{{rightNum}}</view>
					<view class="text">答对题数</view>
				</view>
				<view class="u-fx-ac-jc item">
					<u-circle-progress inactive-color="#469ff2" :percent="90" active-color="#fff" border-width="10" width="210"
					 bg-color="transparent" duration="2000">
						<view class="u-progress-content u-fx-ac-jc">
							<view class="number u-mar-b10">{{totalNum?(rightNum/totalNum)*100:0}}%</view>
							<view class="text">已完成题库</view>
						</view>
					</u-circle-progress>
				</view>
				<view class="u-fx-ac-jc item">
					<view class="number u-mar-b30">{{wrongNum}}</view>
					<view class="text">答错题数</view>
				</view>
				<view class="tabs u-font-02 u-content-color u-fx-ac u-fx-jsb u-padd-l40">
					<view class="item u-fx-ac-jc" @click="router('randomDoEsc')">
						<image style="width: 100rpx; height: 100rpx" src="/mobile-img/icon_suiji.png"></image>
						<view class="text u-mar-t10"> 随机做题 </view>
					</view>
					<view class="item u-fx-ac-jc" @click="router('specialDoEsc')">
						<image style="width: 100rpx; height: 100rpx" src="/mobile-img/icon_zhuangxian.png"></image>
						<view class="text u-mar-t10"> 专项做题 </view>
					</view>
					<view class="item u-fx-ac-jc" @click="router('hardDoEsc')">
						<image style="width: 100rpx; height: 100rpx" src="/mobile-img/icon_nanti.png"></image>
						<view class="text u-mar-t10"> 难题攻克 </view>
					</view>
				</view>
			</view>
			<view class="content ">
				<view class="item u-fx-jsb " @click="router('unifyExam')">
					<view class="left u-fx u-fx-ac u-bold-500">
						<!-- <u-icon size='30' name="/mobile-img/icon_tongyikaoshi.png" class="u-mar-r10"></u-icon> -->
						<u-icon size='30' name="/mobile-img/icon_monikaoshi.png" class="u-mar-r20"></u-icon>
						统一考试
					</view>
					<u-icon class="left" name="arrow-right"></u-icon>
				</view>
				<view class="item u-mar-t20 u-fx-jsb" @click="router('simulateExam')">
					<view class="left u-fx u-fx-ac u-bold-500">
						<u-icon size='30' name="/mobile-img/icon_monikaoshi.png" class="u-mar-r20"></u-icon>
						模拟考试
					</view>
					<u-icon class="left" name="arrow-right"></u-icon>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	import eventBus from "@u/eventBus";
	import DropdownMenu from "../component/DropdownMenu.vue";
	import {
		store,
		actions,
		setStore,
	} from "../store/index.js";
	export default {
		components: {
			DropdownMenu,
		},
		data() {
			return {
				current: 0,
				rightNum: 0,
				totalNum: 0,
				wrongNum: 0,
			};
		},
		computed: {
			userInfo() {
				return store.userInfo;
			},
		},
		async created() {

		},
		mounted() {
			eventBus.$on("getList", () => {
				this.showList();
			});
			this._statistics()
		},
		methods: {
			async _statistics() {
				let req = {
					schoolCode: store.userInfo.schoolCode,
					userCode: store.userInfo.userCode,
				}
				const res = await actions.statistics(req);
				let {
					rightNum,
					totalNum,
					wrongNum
				} = res.data
				this.rightNum = rightNum || 0
				this.totalNum = totalNum || 0
				this.wrongNum = wrongNum || 0
			},
			async router(type) {
				let title,testType
				if(type==='randomDoEsc'){
					title = '随机做题'
					testType = '1'
				}else if (type==='hardDoEsc'){
					title = '难题攻克'
					testType = '2'
				}else if (type==='unifyExam'){
					title = '统一考试'
					testType = '3'
				}else if (type==='simulateExam'){
					title = '模拟考试'
					testType = '4'
				}
				if(type==='specialDoEsc'){
					this.$tools.navTo({
						url: `./specialDoEsc`,
					});
				}else{
					this.searchExec(testType)
					this.$tools.navTo({
						url: `./randomDoEsc?type=${type}&index=0`,
						title: title,
					});
				}
			},
			async searchExec(testType){
				let req = {
					testType: testType,
					schoolCode: store.userInfo.schoolCode,
				};
				let res = await actions.doEsc(req);
				this._setStore('randomDoEsc',res.data) 
				this._setStore('startTime',new Date().getTime()) //存储开始做题时间
			},
			_setStore(key, data) {
				setStore({
					key: key,
					data: data
				})
			},
		},
	};
</script>
<style lang="scss" scoped>
	.home {
		.scroll-h {
			height: calc(100vh - 0rpx);
			.header-bg {
				height: 400rpx;
				background: url(/mobile-img/bg_header.png) top no-repeat;
				background-size: 100% 100%;
				padding: 47rpx 64rpx 0rpx 64rpx;
				.item {
					height: 210rpx;

					.number {
						font-size: 36rpx;
						font-family: DIN;
						font-weight: bold;
					}
				}

				.tabs {
					padding: 0 72rpx;
					position: absolute;
					top: 294rpx;
					left: 30rpx;
					width: 690rpx;
					height: 240rpx;
					background: #ffffff;
					box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(20, 7, 0, 0.1);
					border-radius: 15rpx;
				}
			}

			.content {
				padding: 160rpx 30rpx 0rpx 30rpx;

				.item {
					height: 104rpx;
					background: #ffffff;
					border: 1rpx solid #fafbfd;
					box-shadow: 0rpx 10rpx 30rpx 0rpx rgba(9, 28, 62, 0.06);
					border-radius: 8rpx;
					padding: 0rpx 30rpx;
				}
			}
		}
	}
</style>
