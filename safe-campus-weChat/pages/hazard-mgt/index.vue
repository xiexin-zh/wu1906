<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h " @scrolltolower="loadMore">
			<view class="u-shadow u-fx-ver  u-padd-30  u-border-radius tab-box u-fx-f1">
				<view class="u-mar-b30">
					<u-subsection @change="change" active-color="#2979ff" :list="typeList" mode="subsection" :current="current"></u-subsection>
				</view>
				<no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
				<view v-else class="card u-type-white-bg u-border-radius u-shadow u-padd-20 u-mar-b20 u-fx" 
				@click="assignDanger(item.id,item.state,item.leaderCode,item.handlerCode)"
				 v-for="(item,index) in dataList" :key="index">
					<view class="img-box">
						<image v-if='item.reportUserPhotoUrl' class="u-user-img u-border-radius-all" :src="item.reportUserPhotoUrl"></image>
						<image v-else  class="u-user-img u-border-radius-all" src="http://canpointtest.com/mobile-img/Default_touxiang@2x.png" alt="" />
					</view>
					<view class="cont-box  u-wh u-mar-l20">
						<view class="cont-title u-font-1 u-mar-b10  u-fx u-bold">{{item.reportName}}
							<view class="doorkeeper">
								(暂无职务)
							</view>
							<!-- 上报需指派 -->
							<view class="red-text" v-if="userInfo.userCode==item.leaderCode&&item.state=='1'">
								<image class="del-add-img " src="/mobile-img/assigned.png"></image>
							</view>
							<view class="red-text" v-if="userInfo.userCode==item.handlerCode&&item.state=='2'">
								<image class="del-add-img " src="/mobile-img/dealwith.png"></image>
							</view>
							<view class="red-text" v-if="userInfo.userCode==item.leaderCode&&item.state=='3'">
								<image class="del-add-img " src="/mobile-img/acceptance.png"></image>
							</view>
						</view>
						<view class="time-text u-mar-b20 u-font-02">
							{{item.createTime | gmtToDate}}
						</view>
						<view class="cont-text u-wh u-of">
							{{item.description}}
						</view>
						<view class="imgs-box wh u-fx u-mar-t20 u-mar-b20">
							<image  v-for="(url,index) in splice3(item.dangerPhotoUrls)" :key="index" class="img  u-mar-r20"
							  :src="url" mode=""></image>
						</view>
						<view class="cont-footer u-fx u-type-primary u-fx-ac u-font-02 ">
							<!-- <u-icon name="http://canpointtest.com/mobile-img/study-ground-icon2.png" size="32" class="u-mar-r20"></u-icon>
						上传人：{{ studyInfo.ownerName }}
							ico_danger.png -->
							<u-icon size="20rpx" name="http://canpointtest.com/mobile-img/ico_danger.png" class="u-icon u-mar-r10">
							</u-icon>
							<view class="" v-if="item.state != '3'">
								{{ item.state | getDangerState }}
							</view>
							<view class="time" v-show="item.state == '2'">
								需要处理时间:&nbsp;{{ item.handleDuration }}小时
							</view>
							<view class="time" v-show="item.state == '3'">
								{{ item.handerName }}已处理:&nbsp;{{ item.optTime - item.createTime| getHour }}小时
							</view>
							<view class="time" v-show="item.state == '4'">
								总耗时:&nbsp;{{(item.optTime - item.createTime) | getHour}}小时
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="footer-btn u-fx-ac u-bg-color">
			<u-button @tap="addDager" type="primary" class="u-fx-f1 u-mar-l u-mar-r">
				上报隐患
			</u-button>
		</view>
	</view>
</template>

<script>
	import eventBus from "@u/eventBus";
	import {
		store,
		actions
	} from "./store/index.js";
	export default {
		data() {
			return {
				current: 0,
				state: 1,
				dataList: {},
				typeList: [{
						name: "新上报",
					},
					{
						name: "已指派",
					},
					{
						name: "已处理",
					},
					{
						name: "已验收",
					},
				],
				morePage: false,
				show: false,
				indexList: {},
				pageList: {
					page: 1,
					size: 5,
				},
				morePage: false,
			};
		},
		computed: {
			userInfo() {
				return store.userInfo;
			},
			
			
		},
		mounted() {
			let queryState = this.$tools.getQuery().get("state");
			if (queryState) {
				this.state = queryState;
			}
			eventBus.$on("getList", () => {
				this.showList();
			});
			this.showList();
		},
		methods: {
			splice3(urls){
				if(!(urls||'')) return []
				if(urls.length<=3) return urls
				urls.length=3 
				return urls
			},
			loadMore() {
				if (!this.morePage) {
					this.$tools.toast("数据已加载完毕");
					return;
				}
				this.showList(true);
			},
			async showList(tag = false) {
				if (tag) {
					this.pageList.page += 1;
				} else {
					this.pageList.page = 1;
				}
				let req = {
					...this.pageList,
					schoolCode: store.userInfo.schoolCode,
					state: this.state + "",
				};
				const res = await actions.getDangerIndex(req);
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
			addDager() {
				this.$tools.navTo({
					url: `./addDanger`,
					title: "",
				});
			},
			//指派隐患
			assignDanger(id, state, leaderCode, handlerCode) {
				console.log(state);
				this.$tools.navTo({
					url: `./assignDetail?id=${id}&state=${state}&leaderCode=${leaderCode}&handlerCode=${handlerCode}`,
					id: id,
				});
			},
			change(index) {
				this.current = index;
			},
		},
		watch: {
			state(val) {
				this.current = val - 1;
			},
			current(val) {
				this.state = val + 1;
				this.showList();
			},
		},
	};
</script>

<style lang="scss" scoped>
	.scroll-h {
		height: calc(100vh - 120rpx);

		.cont-title {
			position: relative;
			.red-text {
				width: 100rpx;
				height: 100rpx;
				position: absolute;
				right: 0;
				top: 0;
				.del-add-img {
					width: 100% !important;
					height: 100% !important;
				}
			}
		}
		.imgs-box{
			.img{
				height: 160rpx;
				width: 160rpx;
			}
		}
		.time-text {
			color: #909399;
		}

		.u-icon {
			width: 23rpx;
			height: 23rpx;
		}

		.add-top {
			height: 200rpx;
		}
	}
</style>
