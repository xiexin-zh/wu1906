<template>
	<view class="home">
		<scroll-view scroll-y="true" class="scroll-h u-fx-ver ">
			<view class="do-exe-cont ">
				<view class="exe   u-font-02 u-content-color u-padd-l20">
					<view class="tab-title u-tips-color u-bold-500 u-fx-je">
						总分：&nbsp;100分
					</view>
					<view class="img-box  u-mar-t20  u-fx-jc">
						<view class="bg u-type-white" v-if="randomDoEsc">
							<view class="number">{{getRight}}</view>
							<view class="text">分</view>
						</view>
					</view>
					<view class="tabs  u-font-02 u-content-color u-fx-ac u-fx-jsb ">
						<view class="item u-fx-ac-jc"  v-if="randomDoEsc">
							<view class="number u-font-2 u-bold">{{allLength}}</view>
							<view class="text u-tips-color u-mar-t10"> 试题(道) </view>
						</view>
						<view class="item u-fx-ac-jc"  v-if="randomDoEsc">
							<view class="number  u-font-2 u-bold">{{hasLength}}</view>
							<view class="text u-tips-color u-mar-t10"> 答题(道) </view>
						</view>
						<view class="item u-fx-ac-jc"  v-if="randomDoEsc">
							<view class="number  u-font-2 u-bold">{{getPercent}}%</view>
							<view class="text u-tips-color u-mar-t10"> 正确率 </view>
						</view>
					</view>
				</view>
				<view class="row  u-mar-t30">
					<div class="text u-bold-500">
						本次答题时间: {{store.endTime-store.startTime | iosReplace}}
					</div>
					<div class="list-box u-mar-t20 u-fx u-fx-wp">
						<div class="list u-type-primary u-fx-ac-jc" 
						:class="[{'active':item.isSelected}]" 
						v-for="(item,index) in randomDoEsc" :key="index">
						{{index+1}}</div>
					</div>
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
	import UImage from '../../../uview/components/u-image/u-image.vue';
	export default {
		components: {
			DropdownMenu,
			UImage,
		},
		data() {
			return {
				value: 'orange',
			};
		},
		computed: {
			userInfo() {
				return store.userInfo;
			},
			store() {
				return store;
			},
			randomDoEsc() {
				return store.randomDoEsc;
			},
			allLength(){
				return store.randomDoEsc.length
			},
			hasLength(){
				let a = store.randomDoEsc.filter(el=>{
					if(Object.keys(el).includes("checked")){
						return true
					}
				})
				return a.length||0
			},
			getRight(){
				let right = store.randomDoEsc.filter(v=>v.isSelected).length
				let fenmu = store.randomDoEsc.length
				let oneList = 100/fenmu
				return right*oneList
			},
			getPercent(){
				let right = store.randomDoEsc.filter(v=>v.isSelected).length
				let all = store.randomDoEsc.length
				return parseInt((right/all)*100) 
			}
		},
		async created() {

		},
		mounted() {
			eventBus.$on("getList", () => {
				this.showList();
			});
		},
		methods: {
			
		},
	};
</script>
<style lang="scss" scoped>
	.home {
		.scroll-h {
			height: calc(100vh - 128rpx);
			background: url(/mobile-img/bg_header1.png) top no-repeat;
			background-size: 100% 234rpx;

			.do-exe-cont {
				padding: 68rpx 30rpx 0rpx 30rpx;

				.exe {
					padding: 20rpx;
					top: 294rpx;
					left: 30rpx;
					background: #ffffff;
					box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(20, 7, 0, 0.1);
					border-radius: 15rpx;

					.img-box {
						.bg {
							position: relative;
							width: 309rpx;
							height: 194rpx;
							background: url(/mobile-img/fenshu.png) no-repeat;
							background-size: 100% 100%;

							.number {
								position: absolute;
								top: 46rpx;
								left: 114rpx;
								font-size: 53rpx;
								font-family: DIN;
								font-weight: bold;
							}

							.text {
								position: absolute;
								top: 74rpx;
								left: 182rpx;

								.arrow-up {
									display: inline-block;
									width: 0;
									height: 0;
									border-top: 30px solid transparent;
									border-bottom: 30px solid transparent;
									border-left: 30px solid #000;
								}
							}
						}
					}

					.tabs {
						padding: 40rpx 72rpx;
						top: 294rpx;
						left: 30rpx;
					}
				}

				.list-box {
					.list {
						width: 48rpx;
						height: 48rpx;
						border: 1rpx solid red;
						color:red;
						border-radius: 50%;
						margin: 10rpx;
						&.active{
							border: 1rpx solid 	#0084FF;
							color: #0084FF;
						}
					}
					
				}
			}
		}

		.btn-box {
			width: 100%;
			padding: 0rpx 50rpx;
			position: absolute;
			bottom: 200rpx;

			.item {}
		}
	}
</style>
