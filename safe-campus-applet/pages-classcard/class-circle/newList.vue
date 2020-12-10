<template>
	<view class="u-page">
		<scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
			<no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
			<view class="u-auto">
				<view class="list u-padd-20 u-mar-20 u-bg-fff u-border-radius" v-for="(item, i) in dataList" :key="i" @tap="goDetail(item.id)">
					<view class="u-fx-jsb u-fx-ac">
						<view class="u-mar-r20 u-fx">
							<view class="headimg u-mar-r20"><image class="img u-border-radius" :src="item.photo_url || 'http://canpointtest.com/mobile-img/person-auto.png'"></image></view>
							<view class="content u-line1">
								<view class="u-type-primary-dark u-font-1">{{ item.category == '1' ? item.create_userName : item.children_name }}</view>
								<view class="u-te">{{ item.moments_msg }}</view>
								<view class="u-tips-color u-font-s">
									收到{{ item.unReadCommentCount }}条消息
									<text v-if="item.isDelete > 0" class="u-bg-color u-font-03 u-mar-10 u-padd-l10 u-padd-r10 u-border-radius">{{ item.isDelete }}条消息已删除</text>
								</view>
								<view class="u-tips-color u-font-s">{{ item.create_time | gmtToDate }}</view>
							</view>
						</view>
						<view v-if="item.momentsFirstImg"><image mode="widthFix" class="tumb-img" :src="item.momentsFirstImg"></image></view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import NoData from '../component/NoData.vue'
import { store, actions } from '@store';
export default {
	name: 'newList',
	components: {
		NoData
	},
	data() {
		return {
			dataList: [],
			pageList: {
				page: 1,
				size: 20
			},
			morePage: false
		};
	},
	computed: {
		userInfo: () => store.userInfo,
		currentUserType: () => store.currentUserType,
		currentBindClass: () => store.currentBindClass,
		currentBindStudent: () => store.currentBindStudent
	},
	onLoad: function (options) {
		this.userType = options.userType
	},
	beforeDestroy(){
		eventBus.$emit('getList');
	},
	async mounted() {
		this.showList();
	},
	methods: {
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				...this.pageList,
				schoolCode: this.userInfo.schoolCode,
				category: this.userType === '3' ? '3' : '1',
				classCode: this.userType === '3' ? this.currentBindClass.classCode : this.currentBindStudent.classCode,
				gradeCode: this.userType === '3' ? this.currentBindClass.gradeCode : this.currentBindStudent.gradeCode,
				createUsercode: this.userInfo.userCode
			};
			if (this.userType === '3') {
				req.childrenCode = this.currentBindStudent.userCode;
			}
			console.log(req);
			const res = await actions.getUnReadList(req);
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
		goDetail(id) {
			this.$tools.navTo({
				url: `./detail?id=${id}&userType=${this.userType}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh);
}
.headimg {
	width: 80rpx;
	height: 80rpx;
	.img {
		width: 100%;
		height: 100%;
	}
}
.content {
	width: calc(100% - 100rpx);
}
.tumb-img {
	width: 160rpx;
	height: 160rpx;
}
.u-font-s{
	font-size: 22rpx;
}
</style>
