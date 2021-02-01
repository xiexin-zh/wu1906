<template>
	<view class="list-box">
		<view class="tabList u-fx">
			<view :style="{background: tabVal === '1' ? '#2979ff' : '#fff', color: tabVal === '1' ? '#fff' : '#000'}" class="tab-item u-fx-ac-jc u-fx-f1"
			 @click="changeTab('1')">与我相关</view>
			<view :style="{background: tabVal === '2' ? '#2979ff' : '#fff', color: tabVal === '2' ? '#fff' : '#000'}" class="tab-item u-fx-ac-jc u-fx-f1"
			 @click="changeTab('2')">班级资源</view>
		</view>
		<view class="search u-fx">
			<view class="u-fx-f1">
				<uni-search-bar placeholder="输入资源名称搜索" @confirm="search"></uni-search-bar>
			</view>
		</view>
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
						<view class="tag">
							<u-tag mode="dark" type="primary" class="u-border-radius" text="复用" @click.native.stop="goAdd(item.id)" />
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
		name: 'StudyGround-T',
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
				dataList: [],
				tabVal: '1',
				searchValue: '',
				title: '全部',
				options: [{
					value: '',
					label: '全部'
				}]
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
				this.name = value.value;
				this.showList()
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
					userCode: store.userInfo.userCode,
					tabType: this.tabVal,
					currentUserType: '1'
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
			goAdd(id) {
				this.$tools.navTo({
					url: `./form?id=${id}`
				});
			},
			goDetail(id) {
				this.$tools.navTo({
					url: `../component/detail?id=${id}&type=t`
				});
			},
			changeTab(val) {
				this.pageList = {
					page: 1,
					size: 20,
				};
				this.tabVal = val
				this.showList()
			},
		}
	};
</script>

<style lang="scss" scoped>
	.list-box {
		height: 100vh;
		overflow: hidden;
	}

	.tabList {
		height: 70rpx;
		margin-bottom: 10rpx;
	}

	.search {
		background-color: #fff;
	}

	.scroll-h {
		height: calc(100vh - 200rpx);
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

		.tag {
			.u-tag {
				width: 100rpx;
			}
		}
	}

	.u-icon-20 {
		width: 20rpx;
		height: 20rpx;
	}
</style>
