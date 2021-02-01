<template>
	<view class="home">
		<scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
			<view class="content ">
				<view class="item u-mar-b20 u-fx-jsb u-fx-ac" v-for="(item,index) in dataList" :key="index">
					<view class="left u-fx u-fx-ac u-bold ">
						专项试卷{{index}}
					</view>
					<view class="">
						<u-button type="primary" size='mini' shape="circle" @click="router('specialDoEsc',item.id)">
							开始做题
						</u-button>
					</view>
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
				dataList: []
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
			this.showList();
		},
		methods: {
			async showList(tag = false) {
				let res = await actions.paperList({
					schoolCode: this.userInfo.schoolCode
				});
				this.dataList = res.data
			},
			loadMore() {
				if (!this.morePage) {
					this.$tools.toast("数据已加载完毕");
					return;
				}
				this.showList(true);
			},
			router(type, id) {
				this.searchExec(id)
				this.$tools.goNext(() => {
					this.$tools.navTo({
						url: `./randomDoEsc?type=${type}&index=0&paperId=${id}`,
						title: '专项做题',
					});
				})
			},
			async searchExec(id) {
				let req = {
					paperId: id,
				};
				let res = await actions.doSpecialEsc(req);
				this._setStore('randomDoEsc', res.data)
				this._setStore('startTime', new Date().getTime()) //存储开始做题时间
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

			.content {
				padding: 20rpx 18rpx;

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
