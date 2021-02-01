<template>
	<view class="home u-page u-fx-f1">
		<choose-child v-if="userType === 1" @change="childInfo"></choose-child>
		<no-data v-if="noDatatag" msg="未开户，请联系相关人员开户~"></no-data>
		<view v-else>
			<view
				class="user-info u-fx-ac u-mar-b10 u-border-radius u-padd-40 u-bd-b u-content-color u-bg-fff"
				style="background: url('/mobile-img/intro-background.png') no-repeat; backgroundSize: contain"
			>
				<image class="img u-border-radius" :src="accountInfo.photoUrl" alt="" />
				<view class="u-fx-f1 u-line3 u-mar-l20">
					<view class="u-font-2 u-type-white u-bold u-mar-b20">{{ accountInfo.userName }}</view>
					<view class="u-font-02 u-type-white">ID：{{ accountInfo.accountNo }}</view>
				</view>
				<view class="u-line3">
					<view class="u-type-white u-font-3 u-mar-b10 u-tx-c">￥{{ accountInfo.balance }}</view>
					<view class="unbind-btn u-fx-ac-jc u-font-1" @click="goRecharge">充值</view>
				</view>
			</view>
			<view class="content">
				<view class="title u-fx-jsb u-padd-20 u-padd-b10">
					<view class="u-font-2 u-fw-5">我的账单</view>
					<view class="u-type-primary u-mar-r10" @click="goRule">消费规则 ></view>
				</view>
				<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
					<view class="u-auto">
						<no-data v-if="dataList.length === 0" msg="暂无数据~"></no-data>
						<view
							v-else
							:class="
								item.type === '1'
									? 'success-bl list u-padd-20 u-mar-20 u-bg-fff u-border-radius u-bd-1px'
									: item.type === '2'
									? 'warning-bl list u-padd-20 u-mar-20 u-bg-fff u-border-radius u-bd-1px'
									: item.type === '3'
									? 'primary-bl list u-padd-20 u-mar-20 u-bg-fff u-border-radius u-bd-1px'
									: item.type === '4'
									? 'error-bl list u-padd-20 u-mar-20 u-bg-fff u-border-radius u-bd-1px'
									: 'info-bl list u-padd-20 u-mar-20 u-bg-fff u-border-radius u-bd-1px'
							"
							v-for="(item, i) in dataList"
							:key="i"
							@click="billDetail(item)"
						>
							<view class="u-fx-jsb u-fx-ac u-padd-10">
								<view class="u-fx-f1">
									<view class="u-mar-b10">
										<text
											:class="
												item.type === '1'
													? 'success u-font-3 u-bold white'
													: item.type === '2'
													? 'warning u-font-3 u-bold white'
													: item.type === '3'
													? 'primary u-font-3 u-bold white'
													: item.type === '4'
													? 'error u-font-3 u-bold white'
													: 'info u-font-3 u-bold white'
											"
										>
											{{ item.type | getTradeType }}
										</text>
										<text class="u-tips-color u-font-01 u-mar-l20">{{ item.statusName }}</text>
									</view>
									<view class="u-tips-color">{{ item.billTime }}</view>
								</view>
								<view class="">
									<view
										:class="
											item.type === '1'
												? 'success unbind-btn u-fx-ac-jc u-font-1'
												: item.type === '2'
												? 'warning unbind-btn u-fx-ac-jc u-font-1'
												: item.type === '3'
												? 'primary unbind-btn u-fx-ac-jc u-font-1'
												: item.type === '4'
												? 'error unbind-btn u-fx-ac-jc u-font-1'
												: 'info unbind-btn u-fx-ac-jc u-font-1'
										"
									>
										￥{{ item.amount }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from './store/index.js';
import eventBus from '@u/eventBus';
export default {
	data() {
		return {
			noDatatag: true,
			userType: 2, // 1.学生，2.教职工
			accountInfo: {},
			dataList: [],
			pageList: {
				page: 1,
				size: 20
			}
		};
	},
	components: {
		noData
	},
	computed: {},
	async mounted() {
		if (store.userInfo.typeCode === '4') {
			this.userType = 2;
			this.userCode = store.userInfo.userCode;
		} else if (store.userInfo.typeCode === '16') {
			this.userType = 1;
			this.userCode = store.childList[0].userCode;
		}
		eventBus.$on('getList', () => {
			this._getAccountInfo();
		});
		this._getAccountInfo();
	},
	methods: {
		// 家长切换学生
		childInfo(item) {
			if (item.userCode !== this.userCode) {
				this.userCode = item.userCode;
				this._getAccountInfo();
			}
		},
		plusXing(str, frontLen, endLen) {
			var len = str.length - frontLen - endLen;
			var xing = '';
			for (var i = 0; i < len; i++) {
				xing += '*';
			}
			return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
		},
		// 用户账户信息
		async _getAccountInfo() {
			const res = await actions.getAccountInfo({
				schoolCode: store.userInfo.schoolCode,
				userCode: this.userCode,
				userType: this.userType
			});
			if (!res.data || res.data.length === 0) {
				this.noDatatag = true;
				return;
			}
			this.noDatatag = false;
			uni.setStorageSync('accountInfo', res.data);
			this.accountInfo = res.data;
			this.accountInfo.accountNo = this.plusXing(this.accountInfo.accountNo, 4, 4);
			this.showList();
		},
		// 账单列表
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				pageNum: this.pageList.page,
				pageSize: this.pageList.size,
				schoolCode: store.userInfo.schoolCode,
				userCode: this.accountInfo.userCode
			};
			const res = await actions.getBillList(req);
			if (!res.rows || res.rows.length === 0) {
				return;
			}
			if (tag) {
				this.dataList = this.dataList.concat(res.rows);
			} else {
				this.dataList = res.rows;
			}
			this.morePage = res.total > res.rows.length;
		},
		// 下拉刷新
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
		//充值
		goRecharge() {
			this.$tools.navTo({
				url: `./recharge?userCode=${this.userCode}`
			});
		},
		//编辑消费规则
		goRule() {
			this.$tools.navTo({
				url: `./consumeRule`
			});
		},
		//账单详情
		billDetail(record) {
			this.$tools.navTo({
				url: `./billDetail?id=${record.billNo}&type=${record.type}`
			});
		}
	}
};
</script>

<style lang="scss">
.home {
	.user-info {
		height: 230rpx;
		.img {
			width: 140rpx;
			height: 150rpx;
			display: block;
			background-color: #eee;
		}
		.unbind-btn {
			width: 180rpx;
			height: 60rpx;
			background-color: $u-type-white;
			color: $u-type-primary;
			border-radius: 30rpx;
			margin: 0 auto;
		}
	}
	.content {
		.scroll-h {
			height: calc(100vh - 316rpx);
		}
		.u-fw-5 {
			font-weight: 500;
		}
		.list {
			.unbind-btn {
				width: 160rpx;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 30rpx;
				margin: 0 auto;
			}
			.primary {
				color: $u-type-primary;
				background-color: $u-type-primary-light;
			}
			.success {
				color: $u-type-success;
				background-color: $u-type-success-light;
			}
			.error {
				color: $u-type-error;
				background-color: $u-type-error-light;
			}
			.warning {
				color: $u-type-warning;
				background-color: $u-type-warning-light;
			}
			.info {
				color: $u-type-info;
				background-color: $u-type-info-light;
			}
			.white {
				background-color: $u-type-white;
			}
		}
		.primary-bl {
			border-left: 8rpx solid $u-type-primary;
		}
		.success-bl {
			border-left: 8rpx solid $u-type-success;
		}
		.error-bl {
			border-left: 8rpx solid $u-type-error;
		}
		.warning-bl {
			border-left: 8rpx solid $u-type-warning;
		}
		.info-bl {
			border-left: 8rpx solid $u-type-info;
		}
	}
}
</style>
