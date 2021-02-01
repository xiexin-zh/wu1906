<template>
	<view class="u-page">
		<choose-child @change="childInfo"></choose-child>
		<tab-menu :data-list="tabList" @change="changeMenu"></tab-menu>
		<scroll-view class="scroll-h" @scrolltolower="loadMore" scroll-y="true">
			<PlanList :isName="current == '2'" @getScore="getScore" :data-list="recordList" @goDetail="goDetail"></PlanList>
		</scroll-view>
		<template>
			<view>
				<u-popup :maskCloseAble="true" ref="refuse" mode="center" length="80%" border-radius="14">
					<view class="u-padd-40">
						<view class="u-mar-b20 u-font-1 u-fx-jc">成绩详情</view>
						<view v-for="(item, i) in scoreList" :key="i">
							<view class="u-mar-b20">{{ item.subjectName }}: {{ item.score }}分</view>
						</view>
						<view>总分：{{ this.numCount }}分</view>
					</view>
					<view class="u-fx u-fx-jsa u-padd-20"><view class="u-type-primary u-font-1" @click="close()">关闭</view></view>
				</u-popup>
			</view>
		</template>
	</view>
</template>
<script>
import { store, actions } from './store/index.js';
import noData from '@/components/no-data/no-data.vue';
import eventBus from '@u/eventBus';
import PlanList from '../component/PlanList.vue';
import chooseChild from '@/components/choose-child/choose-child.vue';
export default {
	components: {
		noData,
		PlanList,
		chooseChild
	},
	data() {
		return {
			tabList: [
				{
					name: '未开始'
				},
				{
					name: '进行中'
				},
				{
					name: '已结束'
				}
			],
			current: '0',
			swiperCurrent: '0',
			recordList: [],
			searchObj: {},
			total: 0,
			pageList: {
				page: 1,
				size: 20
			},
			morePage: false,
			userCode: '',
			show: false,
			scoreList: [],
			numList: [],
			numCount: ''
		};
	},
	async created() {
		this.userCode = store.childList[0].userCode;
		this.showList();
	},
	methods: {
		childInfo(item) {
			if (item.userCode !== this.userCode) {
				this.userCode = item.userCode;
				this.showList();
			}
		},
		changeMenu(item) {
			this.current = item;
			this.showList();
		},
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				schoolCode: store.userInfo.schoolCode,
				userCode: this.userCode,
				...this.pageList,
				state: this.current
			};
			const res = await actions.getInfoplanList(req);
			if (tag) {
				this.recordList = this.recordList.concat(res.data.list);
			} else {
				this.recordList = res.data.list;
			}
			this.morePage = res.data.hasNextPage;
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
				url: './detail?id=' + id,
				title: '详情'
			});
		},
		async getScore(id) {
			this.$refs.refuse.open();
			const req = {
				userCode: this.userCode,
				planId: id
			};
			const res = await actions.gettestScore(req);
			this.scoreList = res.data;
			this.numList = res.data.map(el => {
				return el.score;
			});
			let sum = 0;
			for (var i = 0; i < this.numList.length; i++) {
				sum = sum + this.numList[i];
			}
			this.numCount = sum;
		},
		close() {
			this.$refs.refuse.close();
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 80rpx);
}
</style>
