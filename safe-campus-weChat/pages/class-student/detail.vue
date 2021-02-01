<template>
	<view class="parent-manage u-page u-fx-ver u-auto" style="background-color: #038ffc;">
		<view class="header u-fx-ac">
			<image class="user-img u-mar-l40 u-mar-r40 u-shadow" :src="detail.photoUrl"></image>
			<view class="u-fx-ver u-fx-jsb u-type-white u-line3">
				<view>姓名：{{ detail.userName }}</view>
				<view>学号：{{ detail.workNo }}</view>
				<view>入学年份：{{ detail.admissionTime }}</view>
				<view>走住读：{{ detail.hasDorm === '0' ? '走读' : '住读' }}</view>
			</view>
		</view>
		<view class="u-shadow u-fx-ver u-padd-30 u-type-white-bg tab-box u-fx-f1 u-border-top-left">
			<view class=""><u-subsection @change="change" active-color="#2979ff" :list="typeList" mode="subsection" :current="current"></u-subsection></view>
			<view v-if="current === 0" class="u-fx u-padd u-bold u-font u-type-primary-light-bg u-content-color u-mar-t30">
				<view class="u-fx-f1 u-tx-c">家长姓名</view>
				<view class="u-fx-f1 u-tx-c">家长电话</view>
				<view class="u-fx-f1 u-tx-c">家长关系</view>
			</view>
			<view v-if="current === 1" class="u-fx u-padd u-bold u-font u-type-primary-light-bg u-content-color u-mar-t30">
				<view class="u-fx-f1 u-tx-c">类型</view>
				<view class="u-fx-f1 u-tx-c">异动前</view>
				<view class="u-fx-f1 u-tx-c">异动后</view>
				<view class="u-fx-f1 u-tx-c">时间</view>
			</view>
			<view v-if="current === 2" class="u-fx u-padd u-bold u-font u-type-primary-light-bg u-content-color u-mar-t30">
				<view class="u-tx-c">类型</view>
				<view class="u-fx-f1 u-tx-c">调宿前</view>
				<view class="u-fx-f1 u-tx-c">调宿后</view>
				<view class="u-fx-f1 u-tx-c">时间</view>
			</view>
			<view class="u-fx-f1">
				<view class="u-pos-box u-scroll-y">
					<view v-show="current === 0">
						<no-data v-if="parentList.length === 0"></no-data>
						<view class="u-fx-ac u-padd u-bd-b u-content-color" v-for="user in parentList" :key="user.id">
							<view class="u-fx-f1 u-fx-jc">{{ user.parentName }}</view>
							<view class="u-fx-f1 u-fx-jc">{{ user.mobile }}</view>
							<view class="u-fx-f1 u-fx-jc u-type-primary">{{ $tools.getParentType(user.relationship) }}</view>
						</view>
					</view>
					<view v-show="current === 1">
						<no-data v-if="changeList.length === 0"></no-data>
						<view class="u-fx-ac u-padd u-bd-b u-content-color" v-for="user in changeList" :key="user.id">
							<view class="u-fx-f1 u-fx-jc">{{ user.type | changeType }}</view>
							<view class="u-fx-f1 u-fx-ac-jc">
								<view>{{ user.oldSchoolYearName || '' }}</view>
								<view>{{ user.oldGradeName }}</view>
								<view>{{ user.oldClassName }}</view>
							</view>
							<view class="u-fx-f1 u-fx-ac-jc">
								<view>{{ user.newSchoolYearName || '' }}</view>
								<view>{{ user.newGradeName }}</view>
								<view>{{ user.newClassName }}</view>
							</view>
							<view class="u-fx-f1 u-fx-jc">{{ $tools.getDateTime(user.createTime, 'date') }}</view>
						</view>
					</view>
					<view v-show="current === 2">
						<no-data v-if="dormList.length === 0"></no-data>
						<view class="u-fx-ac u-padd u-bd-b u-content-color" v-for="user in dormList" :key="user.id">
							<view class="u-fx-jc">{{ user.status | dormType }}</view>
							<view class="u-fx-f1 u-tx-c">{{ user.oldBuildingName }}</view>
							<view class="u-fx-f1 u-tx-c">{{ user.newBuildingName }}</view>
							<view class="u-fx-f1 u-fx-jc">{{ $tools.getDateTime(user.updateTime, 'date') }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import $tools from '@u/tools';
import { store, actions } from './store/index.js';
export default {
	computed: {
		userInfo: () => store.userInfo,
		schoolYearId: () => store.schoolYear.schoolYearId
	},
	data() {
		return {
			detail: { userName: '' },
			current: 0,
			parentList: [],
			changeList: [],
			dormList: [],
			typeList: [
				{
					name: '学生家长'
				},
				{
					name: '异动记录'
				},
				{
					name: '调宿记录'
				}
			]
		};
	},
	filters: {
		/**
		 * @description 调宿状态
		 */
		dormType(val) {
			let msg;
			switch (parseInt(val)) {
				case 1:
					msg = '入住';
					break;
				case 2:
					msg = '退宿';
					break;
				case 3:
					msg = '调宿';
					break;
				default:
					msg = '未知';
					break;
			}
			return msg;
		},
		/**
		 * @description 异动类型
		 */
		changeType(val) {
			let msg;
			switch (parseInt(val)) {
				case 1:
					msg = '入学';
					break;
				case 2:
					msg = '移出班级';
					break;
				case 3:
					msg = '加入班级';
					break;
				case 4:
					msg = '休学';
					break;
				case 5:
					msg = '退学';
					break;
				case 6:
					msg = '复学';
					break;
				case 7:
					msg = '升级';
					break;
				case 8:
					msg = '毕业';
					break;
				case 9:
					msg = '转班';
					break;
				default:
					msg = '未知';
					break;
			}
			return msg;
		}
	},
	async mounted() {
		this.userCode = this.$tools.getQuery().get('userCode');
		/**
		 * @description 查询学生详情
		 */
		if (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') {
			const sRes = await actions.getHighStudentDetail({
				userCode: this.userCode
			});
			this.detail = sRes.data || {};
			/**
			 * @description 查询家长信息
			 */
			const pRes = await actions.getParentList({
				childCode: this.userCode
			});
			this.parentList = pRes.data;
		} else {
			const sRes = await actions.getStudentDetail({
				userCode: this.userCode,
				schoolYearId: this.schoolYearId
			});
			this.detail = sRes.data || {};
			/**
			 * @description 查询家长信息
			 */
			const pRes = await actions.getParentList({
				childCode: this.userCode
			});
			this.parentList = pRes.data;
		}
	},
	methods: {
		/**
		 * @description 获取异动记录
		 */
		async _getChangeRecord() {
			const res = await actions.getChangeRecord({
				schoolCode: this.userInfo.schoolCode,
				userCode: this.userCode
			});
			this.changeList = res.data;
		},
		/**
		 * @description 获取调宿记录
		 */
		async _getDormRecord() {
			const res = await actions.getDormRecord({
				schoolCode: this.userInfo.schoolCode,
				userCode: this.userCode
			});
			this.dormList = res.data;
		},
		/**
		 * @description 点击切换tab栏
		 * @param {number} index 点击tab栏的索引
		 */
		change(index) {
			this.current = index;
			if (index === 0) {
			} else if (index === 1) {
				if (this.changeList.length > 0) return;
				this._getChangeRecord();
			} else {
				if (this.dormList.length > 0) return;
				this._getDormRecord();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.parent-manage {
	.header {
		height: 320rpx;
		background: #fff url('./images/detail-bg.png') no-repeat;
		background-size: 100% 320rpx;
	}
	.u-border-top-left {
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}
	.user-img {
		width: 200rpx;
		height: 200rpx;
		display: block;
		background-color: #fff;
	}
}
</style>
