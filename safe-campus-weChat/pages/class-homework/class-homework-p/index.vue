<template>
	<view class="u-auto">
		<choose-child @change="childInfo"></choose-child>
		<tab-menu :data-list="list" @change="tabChange"></tab-menu>
		<dropdown-menu v-if="current === 0" class="u-mar-b20" ref="dropdown" @value0Change="value0Change" @searchChange="searchChange"></dropdown-menu>
		<scroll-view v-if="current === 0" scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
			<no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
			<view class="u-padd-20 u-mar-b20 u-mar-l20 u-mar-r20 u-bg-fff u-border-radius" v-for="(item, i) in dataList" :key="i">
				<view class="u-fx-jsb u-fx-ac">
					<view class="title u-main-color u-bold">{{ item.time | gmtToDate('date') }} 作业</view>
					<view class="tag"><u-tag mode="dark" type="primary" text="查看" class="u-mar-r20" @click="goAdd(1, item.time)" /></view>
				</view>
			</view>
		</scroll-view>
		<scroll-view v-else scroll-y="true" class="scroll-y">
			<no-data v-if="statisticsList.length === 0" msg="暂无数据"></no-data>
			<view v-else class="u-padd-20">
				<table>
					<tr>
						<th>学科</th>
						<th>总数</th>
						<th>未交数</th>
						<th>操作</th>
					</tr>
					<tr v-for="(item, i) in statisticsList" :key="i">
						<td>{{ item.subject_name }}</td>
						<td>{{ item.total }}</td>
						<td>{{ item.unSubmit }}</td>
						<td>
							<view v-if="parseInt(item.unSubmit) !== 0" class="u-type-warning" @click="goDetail(item.subject_code)">查看未交</view>
							<view v-else class="">--</view>
						</td>
					</tr>
				</table>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import chooseChild from '@/components/choose-child/choose-child.vue';
import eventBus from '@u/eventBus';
import noData from '@/components/no-data/no-data.vue';
import DropdownMenu from './component/DropdownMenu.vue';
import { store, actions } from './store/index.js';
export default {
	name: 'ClassHomeWork-p',
	components: {
		DropdownMenu,
		noData,
		chooseChild
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
			pageList: {
				page: 1,
				size: 20
			},
			morePage: false,
			classCode: '',
			userCode: '',
			dateTime: '',
			dataList: [],
			statisticsList: []
		};
	},
	watch: {},
	async created() {
		this.schoolYearId = store.schoolYear.schoolYearId;
		this.classCode = store.childList[0].classCode
		this.userCode = store.childList[0].userCode
		this.showList()
	},
	mounted() {},
	methods: {
		childInfo(item) {
			if (item.userCode !== this.userCode) {
				this.classCode = item.classCode;
				this.userCode = item.userCode;
				this.showList();
			}
		},
		searchChange(val) {
			this.dateTime = val === '选择日期' ? '' : val;
			console.log(this.dateTime);
			this.showList();
		},
		tabChange(item) {
			this.current = item;
			this.$refs.dropdown.current = item;
			console.log(item);
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
				createTime: this.current === 0 ? this.dateTime : '',
				schoolCode: store.userInfo.schoolCode,
				classCode: this.classCode,
				schoolYearId: this.schoolYearId
			};
			if (this.current === 0) {
				const res = await actions.getHomeworkList(req);
				if (tag) {
					this.dataList = this.dataList.concat(res.data.list);
				} else {
					this.dataList = res.data.list;
				}
				this.morePage = res.data.hasNextPage;
			} else {
				req.userCode = this.userCode
				const res = await actions.getHomeworkStatistics(req);
				if (tag) {
					this.statisticsList = this.statisticsList.concat(res.data);
				} else {
					this.statisticsList = res.data;
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
				url: `./form?type=${type}&id=${id}&userCode=${this.userCode}&classCode=${this.classCode}`
			});
		},
		goDetail(id) {
			this.$tools.navTo({
				url: `./detail?id=${id}&userCode=${this.userCode}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 182rpx);
}
.scroll-y {
	height: calc(100vh - 100rpx);
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
table, th, td
  {
  border: 1rpx solid $u-type-info-disabled;
  }
	table{
		width: 100%;
		border-collapse: collapse;
		tr{
			th, td{
				text-align: center;
				vertical-align: middle;
				width: 20%;
				padding: 10rpx;
			}
			th:nth-child(1), td:nth-child(1){
				width:40%
			}
		}
	}
	
</style>
