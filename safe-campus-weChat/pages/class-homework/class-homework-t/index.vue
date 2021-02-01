<template>
	<view class="u-auto">
		<tab-menu :data-list="list" @change="tabChange"></tab-menu>
		<dropdown-menu class="u-mar-b20" ref="dropdown" @value0Change="value0Change" @searchChange="searchChange"></dropdown-menu>
		<scroll-view v-if="current === 0" scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
			<no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
			<view class="list u-padd-20 u-mar-b20 u-mar-l20 u-mar-r20 u-bg-fff u-border-radius" v-for="(item, i) in dataList" :key="i">
				<view class="u-fx-jsb u-fx-ac u-mar-b20">
					<view class="u-fx u-fx-ac">
						<view class="sub u-padd-20 u-padd-t30 u-padd-b30 u-mar-r20 u-border-radius">{{ item.subjectName }}</view>
						<view class="">
							<view class="title u-main-color u-bold u-mar-b20">{{ item.createTime | gmtToDate('date') }} 作业</view>
							<view class="u-tips-color u-font-02">{{ item.gradeName }}{{ item.professionName || ''}}{{ item.className }}</view>
						</view>
					</view>
					<view class="tag"><u-tag mode="dark" type="primary" text="查看" class="u-mar-r20" @click="goAdd(1, item.id)" /></view>
				</view>
				<view class="u-bd-t u-fx-jsb u-padd-l20 u-padd-t20 u-fx-ac" @click="goAdd(2, item.id)">
					<text class="u-tips-color u-font-02">{{ item.unsubmitCount || 0 }}人未交</text>
					<view class="u-fx-ac"><view class="rit-icon"></view></view>
				</view>
			</view>
		</scroll-view>
		<scroll-view v-else scroll-y="true" class="scroll-h">
			<no-data v-if="statisticsList.length === 0" msg="暂无数据"></no-data>
			<view class="list u-padd-20 u-mar-b20 u-mar-l20 u-mar-r20 u-bg-fff u-border-radius" v-for="(item, i) in statisticsList" :key="i">
				<view class="u-fx-jsb u-fx-ac">
					<view class="u-fx u-fx-ac">
						<u-lazy-load class="img u-border-radius-all u-mar-r20" :image="item.photo_url"></u-lazy-load>
						<view class="">
							<view class="title u-main-color u-bold u-mar-b20">{{ item.user_name }}</view>
							<view class="u-tips-color u-font-02">{{ item.work_no }}</view>
						</view>
					</view>
					<view class="tag"><u-tag mode="dark" type="error" :text="`累计未交${item.counts}次`" class="u-mar-r20" @click="goDetail(item.user_code)" /></view>
				</view>
			</view>
		</scroll-view>
		<view v-if="current === 0" class="float-add-btn" @click="goAdd(0, '')"></view>
	</view>
</template>

<script>
import wxApi from '@u/wxApi'
import eventBus from '@u/eventBus';
import noData from '@/components/no-data/no-data.vue';
import DropdownMenu from './component/DropdownMenu.vue';
import { store, actions } from './store/index.js';
export default {
	name: 'ClassHomeWork-t',
	components: {
		DropdownMenu,
		noData
	},
	data() {
		return {
			list: [
				{
					name: '作业'
				},
				{
					name: '统计'
				}
			],
			current: 0,
			value0: '0',
			pageList: {
				page: 1,
				size: 20
			},
			morePage: false,
			classCode: '',
			schoolYearId: '',
			dateTime: '',
			dataList: [],
			statisticsList: []
		};
	},
	async created() {
		this.schoolYearId = store.schoolYear.schoolYearId;
		eventBus.$on('getList', () => {
			this.showList();
		});
	  wxApi.getConfig('protal-card')
		this.showList();
	},
	computed: {
		isBZR: () => JSON.parse(uni.getStorageSync('protal')).isBZR
	},
	methods: {
		value0Change(value) {
			console.log(value)
			this.classCode = value.value;
			console.log(this.classCode)
			if ((this.isBZR && value.value === this.isBZR.classCode) || value.isBZR) {
				this.userType = 1;
			} else {
				this.userType = 2;
			}
			this.showList();
		},
		searchChange(val) {
			this.dateTime = val === '选择日期' ? '' : val;
			this.showList();
		},
		tabChange(item) {
			this.current = item;
			this.$refs.dropdown.current = item;
			this.showList();
		},
		async showList(tag = false) {
			if(!this.classCode){
				return
			}
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				...this.pageList,
				createTime: this.current === 0 ? this.dateTime : '',
				schoolCode: store.userInfo.schoolCode,
				classCode: this.classCode,
				schoolYearId: this.schoolYearId
			};
			if (this.current === 0) {
				if(this.userType === 2){
					req.createUsercode = store.userInfo.userCode
				}
				const res = await actions.getHomeworkList(req);
				if (tag) {
					this.dataList = this.dataList.concat(res.data.list);
				} else {
					this.dataList = res.data.list;
				}
				this.morePage = res.data.hasNextPage;
			} else {
				const res = await actions.getUnSubmitStatistics(req);
				if (tag) {
					this.statisticsList = this.statisticsList.concat(res.data.list);
				} else {
					this.statisticsList = res.data.list;
				}
				this.morePage = res.data.hasNextPage;
			}
		},
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
		goAdd(type, id) {
			this.$tools.navTo({
				url: `./form?type=${type}&id=${id}`
			});
		},
		goDetail(id) {
			this.$tools.navTo({
				url: `./detail?id=${id}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 182rpx);
}
.list:nth-child(odd) {
	.sub {
		color: $u-type-primary;
		background-color: $u-type-primary-light;
	}
}
.list:nth-child(even) {
	.sub {
		color: $u-type-success;
		background-color: $u-type-success-light;
	}
}
.img {
	width: 100rpx;
	height: 100rpx;
}
</style>
