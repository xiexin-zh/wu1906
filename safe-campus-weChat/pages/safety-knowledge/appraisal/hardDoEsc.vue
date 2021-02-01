<template>
	<view class="home">
		<scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
			<view class="header-bg u-type-white u-fx-jsb">
				<view class="u-fx-ac-jc item">
					难题攻克
					<view class="number u-mar-b30 u-bold">88</view>
					<view class="text">答对题数</view>
				</view>
				<view class="u-fx-ac-jc item">
					<u-circle-progress inactive-color="#469ff2" :percent="90" active-color="#fff" border-width="10" width="210"
					 bg-color="transparent" duration="2000">
						<view class="u-progress-content u-fx-ac-jc">
							<view class="number u-mar-b10">90%</view>
							<view class="text">已完成题库</view>
						</view>
					</u-circle-progress>
				</view>
				<view class="u-fx-ac-jc item">
					<view class="number u-mar-b30">2</view>
					<view class="text">答错题数</view>
				</view>
				<view class="tabs u-font-02 u-content-color u-fx-ac u-fx-jsb u-padd-l40">
					<view class="item u-fx-ac-jc">
						<image style="width: 100rpx; height: 100rpx" src="/mobile-img/icon_suiji.png"></image>
						<view class="text u-mar-t10"> 随机做题 </view>
					</view>
					<view class="item u-fx-ac-jc">
						<image style="width: 100rpx; height: 100rpx" src="/mobile-img/icon_zhuangxian.png"></image>
						<view class="text u-mar-t10"> 专项做题 </view>
					</view>
					<view class="item u-fx-ac-jc">
						<image style="width: 100rpx; height: 100rpx" src="/mobile-img/icon_nanti.png"></image>
						<view class="text u-mar-t10"> 难题攻克 </view>
					</view>
				</view>
			</view>
			<view class="content red">
				<view class="item u-fx-jsb " @click="router('统一考试')">
					<view class="left u-fx u-fx-ac u-bold-500">
						<!-- <u-icon size='30' name="/mobile-img/icon_tongyikaoshi.png" class="u-mar-r10"></u-icon> -->
						<u-icon size='30' name="/mobile-img/icon_monikaoshi.png" class="u-mar-r20"></u-icon>
						统一考试
					</view>
					<u-icon class="left" name="arrow-right"></u-icon>
				</view>
				<view class="item u-mar-t20 u-fx-jsb"  @click="router('模拟考试')">
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
		actions
	} from "../store/index.js";
	// import UImage from "../../../uview/components/u-image/u-image.vue";
	// import UIcon from "../../../uview/components/u-icon/u-icon.vue";
	export default {
		components: {
			DropdownMenu,
			// UImag,
			// UIcone,
		},
		data() {
			return {
				current: 0,
				resourceNames: [{
						text: "文件类型",
						value: "0",
					},
					{
						text: "看一看",
						value: "1",
					},
					{
						text: "玩一玩",
						value: "2",
					},
					{
						text: "读一读",
						value: "3",
					},
					{
						text: "听一听",
						value: "4",
					},
				],
				firstData: [],
				secondData: [],
				allSecondData: [],
				categoryId: "",
				dataList: [],
				morePage: false,
				searchObj: {
					fileType: "",
					categoryId: "",
					resourceName: "",
				},
				pageList: {
					page: 1,
					size: 10,
				},
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
		},
		methods: {
		
			async showList(tag = false) {
				if (tag) {
					this.pageList.page += 1;
				} else {
					this.pageList.page = 1;
				}
				this.searchObj.categoryId = this.secondId || this.firstId;
				let req = {
					...this.pageList,
					...this.searchObj,
					schoolCode: store.userInfo.schoolCode,
				};
				let res = await actions.klgLocalList(req);
				this.total = res.data.total;
				if (tag) {
					this.dataList = this.dataList.concat(res.data.records);
				} else {
					this.dataList = res.data.records;
				}
				this.morePage = res.data.pages > res.data.current;
			},
			loadMore() {
				if (!this.morePage) {
					this.$tools.toast("数据已加载完毕");
					return;
				}
				this.showList(true);
			},
			router(record) {
				this.$tools.navTo({
					url: `./detail?id=${record.id}`,
				});
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
