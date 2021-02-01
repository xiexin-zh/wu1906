<template>
	<view class="">
		<uni-search-bar placeholder="输入资源名称搜索" @confirm="search"></uni-search-bar>
		<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
			<view class="u-auto">
				<no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
				<view class="list u-padd-20 u-mar-20 u-bg-fff u-border-radius" v-for="(item, i) in dataList" :key="item.id" @click="goDetail(item.id)">
					<view class="u-fx-jsb u-fx-ac">
						<view class="u-fx u-fx-ac">
							<view class="sub u-mar-r20 u-border-radius u-fx-ac-jc">
								<image src="http://canpointtest.com/mobile-img/study-ground-icon4.png" mode=""></image>
							</view>
							<view class="info">
								<view class="title u-main-color u-bold u-mar-b10 u-te">{{ item.gardenName }}</view>
								<view class="u-tips-color u-font-02 u-mar-b10 u-fx-ac">
									上传人：{{ item.createUserName }}
									<view class="u-fx-ac u-mar-l20 u-border-radius-big u-type-primary u-type-primary-light-bg u-padd-l20 u-padd-r20 u-font-02">
										<image src="http://canpointtest.com/mobile-img/study-ground-icon5.png" class="u-mar-r10 u-icon-20">
											</u-icon>
											{{ item.resNum }}
									</view>
								</view>
								<view class="u-tips-color u-font-02 u-mar-b10 u-te">上传时间：{{ item.createTime | gmtToDate('no-second') }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import eventBus from '@u/eventBus';
	import noData from '@/components/no-data/no-data.vue';
	import {
		store,
		actions
	} from '../store/index.js';
	export default {
		name: 'StudyGround-P',
		components: {
			noData
		},
		data() {
			return {
				name: '',
				pageList: {
					page: 1,
					size: 20
				},
				morePage: false,
				schoolYearId: '',
				dataList: []
			};
		},
		watch: {},
		created() {
			this.getSchoolYearId()
		},
		mounted() {
			eventBus.$on('getList', () => {
				this.showList();
			});
		},
		methods: {
			async getSchoolYearId() {
				const req = {
					schoolCode: store.userInfo.schoolCode
				}
				const res = await actions.getSchoolYear(req)
				this.schoolYearId = res.data.list[0].id
				this.showList();
			},
			search(value) {
				console.log(value);
				this.name = value.value;
				this.showList();
			},
			async showList(tag = false) {
				if (tag) {
					this.pageList.page += 1;
				} else {
					this.pageList.page = 1;
				}
				const req = {
					...this.pageList,
					gardenName: this.name,
					schoolCode: store.userInfo.schoolCode,
					schoolYearId: this.schoolYearId,
					tabType: '2',
					userCode: store.userInfo.userCode,
					currentUserType: '2'
				};
				const res = await actions.getStudyList(req);
				if (tag) {
					this.dataList = this.dataList.concat(res.data.records);
				} else {
					this.dataList = res.data.records;
				}
				this.morePage = res.data.current < res.data.pages;
			},
			loadMore() {
				if (!this.morePage) {
					this.$tools.toast('数据已加载完毕');
					return;
				}
				this.showList(true);
			},
			goDetail(id) {
				this.$tools.navTo({
					url: `../component/detail?id=${id}&type=p`
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.search-list {
		height: 100rpx;
		width: 100%;
		padding: 20rpx;
		position: relative;

		.search-icon {
			margin-left: 20rpx;
			color: $u-type-primary;
		}
	}

	.scroll-h {
		height: calc(100vh - 120rpx);
	}

	.list {
		.sub {
			color: $u-type-primary;
			background-color: $u-type-primary;
			padding: 30rpx 36rpx;

			image {
				width: 30rpx;
				height: 40rpx;
			}
		}
	}

	.u-icon-20 {
		width: 20rpx;
		height: 20rpx;
	}
</style>
