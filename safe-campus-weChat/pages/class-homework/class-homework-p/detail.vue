<template>
	<view class="u-page">
		<scroll-view scroll-y="true" class="scroll-h u-auto u-mar-t20">
			<no-data v-if="dataList.length === 0 " msg="暂无数据"></no-data>
			<view class="list u-padd-20 u-mar-b20 u-mar-l20 u-mar-r20 u-bg-fff u-border-radius" v-for="(item, i) in dataList" :key="i">
				<view class="u-fx-jsb u-fx-ac">
					<view class="u-fx u-fx-ac">
						<view class="sub u-padd-20 u-padd-t30 u-padd-b30 u-mar-r20 u-border-radius">{{ item.subject_name }}</view>
						<view class="title u-main-color u-bold">{{ item.create_time | gmtToDate('date') }}作业</view>
					</view>
					<view class="tag"><u-tag mode="dark" type="primary" text="查看" class="u-mar-r20" @click="goAdd(2, item.id)" /></view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
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
			pageList: {
				page: 1,
				size: 20
			},
			dataList: [],
			morePage: false
		};
	},
	watch: {},
	async created() {
		this.id = this.$tools.getQuery().get('id');
		this.userCode = this.$tools.getQuery().get('userCode');
		this.showList()
	},
	mounted() {},
	methods: {
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				...this.pageList,
				schoolCode: store.userInfo.schoolCode,
				subjectCode: this.id,
				userCode: this.userCode,
				schoolYearId: store.schoolYear.schoolYearId
			};
			console.log(req);
			const res = await actions.getUnSubmitList(req);
			if (!res.data) {
				return;
			}
			if (tag) {
				this.dataList = this.dataList.concat(res.data.list);
			} else {
				this.dataList = res.data.list;
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
		goAdd(type, id) {
			this.$tools.navTo({
				url: `./form?type=${type}&id=${id}&userCode=${this.userCode}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh);
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
</style>
