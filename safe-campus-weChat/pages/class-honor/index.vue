<template>
	<view class="">
		<choose-child v-if="userType === 3" @change="childInfo"></choose-child>
		<view class="dropdown u-bd-b">
			<ms-dropdown-menu v-if="userType !== 3 && showClass"><ms-dropdown-item v-model="value0" :list="classList" :title="defTitle"></ms-dropdown-item></ms-dropdown-menu>
		</view>
		<scroll-view scroll-y="true" @scrolltolower="loadMore" :class="showClass ? 'scroll-h' : 'scroll'">
			<no-data v-if="dataList.length === 0" msg="暂无数据~"></no-data>
			<view class="u-auto">
				<view class="approve-list u-bg-fff u-mar-20 u-border-radius" v-for="(item, i) in dataList" :key="i">
					<view class="detail u-padd-20">
						<view class="u-fx-ac u-mar-b20">
							<image class="u-border-radius u-mar-r20" :src="item.photoUrl || 'http://canpointtest.com/mobile-img/default.png'" mode=""></image>
							<view class="info">
								<view class="name u-main-color u-mar-b10 u-te3">
									{{ item.content }}
								</view>
								<view class="u-fx-ac u-mar-t20">
									<u-icon name="clock-fill"></u-icon>
									<text class="u-tips-color u-font-02 u-mar-l10">获奖日期：{{ item.awardTime | gmtToDate('date') }}</text>
								</view>
							</view>
						</view>
						<view class="u-bd-t"></view>
						<view class="u-fx-jsb u-fx-ac u-padd-t20 u-tips-color u-font-02">
							<text>发布于：{{ item.updateTime || item.createTime | gmtToDate('date') }}</text>
							<view class="u-fx u-fx-ac">
								<text @click="add(1, item.id)">发布人：{{ item.createUsername }}</text>
								<view class="rit-icon"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view v-if="userType === 1" class="float-add-btn" @click="add(0)"></view>
	</view>
</template>

<script>
import chooseChild from '@/components/choose-child/choose-child.vue';
import eventBus from '@u/eventBus';
import noData from '@/components/no-data/no-data.vue';
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
import { store, actions } from './store/index.js';
export default {
	name: 'class-honor',
	components: {
		msDropdownMenu,
		msDropdownItem,
		noData,
		chooseChild
	},
	data() {
		return {
			currentClass: uni.getStorageSync('currentClass') || 0,
			userType: 2, // 0.超管，1.班主任，2.教职工，3.家长
			value0: '',
			classList: [],
			defTitle: '',
			pageList: {
				page: 1,
				size: 20
			},
			morePage: false,
			showClass: false,
			dataList: []
		};
	},
	watch: {
		value0(val, oldval) {
			if (this.userType === 3) {
				return;
			}
			if (val !== oldval) {
				let choose = this.classList.filter(el => {
					return el.value === val;
				})[0];
				if ((store.isBZR && val === store.isBZR.classCode) || choose.isBZR) {
					this.userType = 1;
				} else {
					this.userType = 2;
				}
				this.defTitle = choose.text;
				console.log(this.defTitle)
				this.gradeCode = choose.gradeCode;
				this.classCode = val;
				uni.setStorageSync('bindInfo', {
					...this.classList.filter(el => {
						return el.value === val;
					})[0],
					classCode: val
				});
				eventBus.$on('getList', () => {
					this.showList();
				});
				this.showList();
			}
		}
	},
	async created() {
		if (store.userInfo.typeCode === '4') {
			this.userType = 2;
			this.classList = JSON.parse(uni.getStorageSync('protal')).teachClassList;
			if (this.classList.length === 0) {
				this.$tools.toast('请绑定班级');
				return;
			}
			this.classCode = this.classList[this.currentClass].value;
			this.gradeCode = this.classList[this.currentClass].gradeCode;
			this.showClass = true;
			this.defTitle = this.classList[this.currentClass].text;
			this.value0 = this.classList[this.currentClass].value;
			uni.setStorageSync('bindInfo', {
				...this.classList[this.currentClass],
				classCode: this.classList[this.currentClass].value
			});
		} else if (store.userInfo.typeCode === '16') {
			this.userType = 3;
			this.classCode = store.childList[0].classCode;
			this.gradeCode = store.childList[0].gradeCode;
			uni.setStorageSync('bindInfo', {
				...store.childList[0]
			});
			this.showList();
		}
	},
	methods: {
		childInfo(item) {
			if (item.userCode !== this.userCode) {
				this.classCode = item.classCode;
				this.classId = item.classId;
				uni.setStorageSync('bindInfo', {
					...item
				});
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
				schoolCode: store.userInfo.schoolCode,
				schoolYearId: store.schoolYear.schoolYearId,
				classCode: this.classCode
			};
			const res = await actions.getClassHonorList(req);
			if (tag) {
			  this.dataList = this.dataList.concat(res.data.list);
			} else {
			  this.dataList = res.data.list;
			}
			this.morePage = res.data.hasNextPage;
		},
		loadMore() {
		  if (!this.morePage) {
		    this.$tools.toast("数据已加载完毕");
		    return;
		  }
		  this.showList(true);
		},
		add(type, id) {
			this.$tools.navTo({
				url: `./form?type=${type}&id=${id}&userType=${this.userType}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 80rpx);
}
.scroll {
	height: calc(100vh);
}
.dropdown {
	width: 100%;
}
.approve-list {
	.detail {
		image {
			width: 240rpx;
			height: 180rpx;
		}
		.info {
			max-width: calc(100% - 260rpx);
		}
	}
}
</style>
