<template>
	<view class="site u-page">
		<choose-child v-if="userType === 3" @change="childInfo"></choose-child>
		<no-data v-if="userType !== 3 && !showClass" msg="请先绑定班级"></no-data>
		<view v-else class="">
			<view class="dropdown u-fx-ac u-bd-b u-bd-t">
				<ms-dropdown-menu v-if="showClass"><ms-dropdown-item v-model="value0" :list="classList" :title="defTitle"></ms-dropdown-item></ms-dropdown-menu>
			</view>
			<no-data v-if="dataList.length === 0" msg="暂无数据~"></no-data>
			<scroll-view v-else scroll-y="true" @scrolltolower="loadMore" class="scroll-h u-mar-t20">
				<view class="u-auto">
					<view class="approve-list" v-for="(item, i) in dataList" :key="i">
						<view class="detail u-fx" @click.stop="add(item.state, item.id)">
							<view class="process-type">
								<u-tag v-if="item.state === '2'" mode="dark" type="primary" text="进行中" />
								<u-tag v-if="item.state === '1'" mode="dark" type="success" text="未开始" />
								<u-tag v-if="item.state === '3'" mode="dark" type="info" text="已结束" />
							</view>
							<view class="info">
								<view class="list">
									<view class="name u-main-color">{{ item.description }}</view>
									<view class="u-tips-color">活动地点：{{ item.placeName }}</view>
									<view class="u-tips-color">活动时间：{{ item.startTime | gmtToDate('no-second') }} - {{ item.endTime | gmtToDate('no-second') }}</view>
									<view v-if="item.openSign === '1'" class="u-tips-color u-mar-0">报名截止时间：{{ item.stopDatetime | gmtToDate('no-second') }}</view>
									<view v-if="userType === 3 && item.openSign === '1'" class="u-fx-je u-mar-0">
										<u-button v-if="item.stopDatetime >= new Date().getTime()" plain @click="goSign(item)" class="sign-num mar-button u-fx-je" type="primary" size="mini">我要报名</u-button>
										<u-button v-else plain disabled class="sign-num mar-button u-fx-je" type="info" size="mini">报名已结束</u-button>
									</view>
								</view>
							</view>
						</view>
						<view class="u-bd-t" v-if="userType !== 3"></view>
						<view v-if="userType !== 3" class="u-fx-jsb u-fx-ac u-padd-20 u-tips-color u-font-02">
							<text>发起人：{{ item.createName }}</text>
							<text>上传时间：{{ item.createTime | gmtToDate }}</text>
							<view class="u-fx u-fx-ac"></view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view v-if="userType === 1" class="float-add-btn" @click="add('0', '')"></view>
		</view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
import chooseChild from '@/components/choose-child/choose-child.vue';
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from './store/index.js';
export default {
	components: {
		noData,
		chooseChild,
		msDropdownMenu,
		msDropdownItem
	},
	data() {
		return {
			userType: 2, // 0.超管，1.班主任，2.教职工，3.家长
			pageList: {
				page: 1,
				size: 15
			},
			morePage: false,
			showClass: false,
			value0: '',
			defTitle: '',
			dataList: []
		};
	},
	computed: {
		isBZR: () => JSON.parse(uni.getStorageSync('protal')).isBZR,
		classList: () => JSON.parse(uni.getStorageSync('protal')).teachClassList,
		userInfo: () => JSON.parse(uni.getStorageSync('protal')).userInfo,
		childList: () => JSON.parse(uni.getStorageSync('protal')).childList,
	},
	watch: {
		value0(val, oldval) {
			if (this.userType === 3) {
				return;
			}
			if (val !== oldval) {
				this.defTitle = this.classList.filter(el => {
					return el.value === val;
				})[0].text;
				this.classCode = val;
				eventBus.$on('getList', () => {
					this.showList();
				});
				this.showList();
				if (this.isBZR && val === this.isBZR.classCode) {
					this.userType = 1;
				} else {
					this.userType = 2;
				}
				console.log(this.userType);
			}
		}
	},
	async created() {
		if (this.userInfo.typeCode === '4') {
			this.userType = 2;
			if(this.classList.length === 0){
				return
			}
			this.showClass = true;
			this.classCode = this.classList[0].value
			this.defTitle = this.classList[0].text;
			this.value0 = this.classList[0].value;
		} else if (this.userInfo.typeCode === '16') {
			this.userType = 3;
			if(this.childList.length === 0){
				return
			}
			this.classCode = this.childList[0].classCode;
			this.userCode = this.childList[0].userCode;
			this.userName = this.childList[0].userName;
			this.className = this.childList[0].gradeName + this.childList[0].className;
			eventBus.$on('getList', () => {
				this.showList();
			});
			this.showList();
		}
		console.log(this.userType);
	},
	methods: {
		childInfo(item) {
			if (item.userCode !== this.userCode) {
				this.classCode = item.classCode;
				this.userCode = item.userCode;
				this.userName = item.userName;
				this.className = item.gradeName + item.className;
				this.showList();
			}
		},
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				...this.pageList,
				schoolCode: this.userInfo.schoolCode,
				classCode: this.classCode,
				schoolYearId: store.schoolYear.schoolYearId
			};
			const res = await actions.getSchoolActivityList(req);
			res.data.list.map(el => {
				el.placeName = el.placeName.replace(/,/g, '-');
			});
			this.total = res.data.total;
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
		add(type, id) {
			console.log(type)
			type = type === '3' || type === '2' ? '1' : type === '1' ? '2' : '0';
			if (this.current === 1 && (type === '0' || type === '2')) {
				type = '1';
			}
			this.$tools.navTo({
				url: `./form?type=${type}&id=${id}&userType=${this.userType}`,
				title: '活动发布'
			});
		},
		goSign(record) {
			this.$tools.delTip(`确认替${this.userName}报名参加该活动吗？`, async () => {
				const req = {
					activityId: record.id,
					classCode: this.classCode,
					className: this.className,
					schoolCode: this.userInfo.schoolCode,
					schoolYearId: store.schoolYear.schoolYearId,
					userCode: this.userCode,
					userName: this.userName,
					signUpType: '1'
				}
				const res = await actions.signSchoolActivity(req);
				this.$tools.toast('报名成功', 'success');
				this.$tools.goNext(() => {
					this.showList()
				});
			})
		}
	}
};
</script>

<style lang="scss">
.approve-list {
	background-color: $uni-bg-color;
	border-radius: 16rpx;
	margin: 0rpx 20rpx 20rpx 20rpx;
	position: relative;
	.detail {
		padding: 20rpx;
	}
	.process-type {
		top: 0rpx;
		right: 10rpx;
		position: absolute;
		font-size: 48rpx;
	}
	.info {
		width: 100%;
		.list {
			view {
				font-size: 28rpx;
				margin: 20rpx 0;
			}
			.u-mar-0 {
				margin: 0;
			}
			.mar-button {
				margin: 10rpx 10rpx 0 0;
			}
		}
	}
	.sign-num {
		padding: 20rpx;
	}
}
.dropdown-menu {
	width: 100%;
}
.scroll-h {
	height: calc(100vh - 100rpx);
}
</style>
