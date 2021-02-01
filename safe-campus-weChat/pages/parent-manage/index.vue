<template>
	<view class="parent-manage u-page u-fx-ver u-auto">
		<no-data msg="暂无数据" v-if="notBZR"></no-data>
		<view v-else class="share-dialog" v-if="isShare"><view class="share-btn" @tap="isShare = false"></view></view>
		<u-popup mask-close-able mode="center" v-model="pShow" width="80%" height="auto" border-radius="16">
			<view class="bg-header"></view>
			<view class="u-padd-40">
				<view class="u-fx u-font-1 u-padd">
					<text class="u-fx-f1 u-content-color">家长姓名：</text>
					<text class="u-fx-f1">{{ detail.parentName }}</text>
				</view>
				<view class="u-fx u-font-1 u-padd">
					<text class="u-fx-f1 u-content-color">关系：</text>
					<text class="u-fx-f1">{{ $tools.getParentType(detail.relationship) }}</text>
				</view>
				<view class="u-fx u-font-1 u-padd">
					<text class="u-fx-f1 u-content-color">手机号码：</text>
					<text class="u-fx-f1">{{ detail.mobile }}</text>
				</view>
			</view>
			<view class="u-padd"><u-button type="default" @tap="pShow = false">关闭</u-button></view>
		</u-popup>
		<view
			v-if="!notBZR"
			class="header u-fx-ver u-mar u-type-white-bg u-border-radius-big u-shadow"
			:style="{ backgroundSize: userInfo.schoolType === '8' || userInfo.schoolType === '9' ? '180% 100%' : '100%' }"
		>
			<view class="u-padd-30 u-font-3 u-bold u-type-primary">
				{{ isBZR.gradeName }}{{ userInfo.schoolType === '8' || userInfo.schoolType === '9' ? (isBZR.professionName) : ''}}{{ isBZR.className }}
			</view>
			<view class="u-fx-ac u-fx-f1">
				<view class="u-fx-f1 u-fx-ac-jc u-bd-r">
					<view class="u-font-3 u-bold">{{ sTotal }}人</view>
					<view class="u-tips-color u-mar-t">学生(人)</view>
				</view>
				<view class="u-fx-f1 u-fx-ac-jc">
					<view class="u-font-3 u-bold">{{ pTotal }}人</view>
					<view class="u-tips-color u-mar-t">家长(人)</view>
				</view>
			</view>
		</view>
		<view v-if="!notBZR" class="u-shadow u-fx-ver u-mar-l u-mar-r u-mar-b u-padd-30 u-type-white-bg u-border-radius tab-box u-fx-f1">
			<view class=""><u-subsection @change="change" active-color="#2979ff" :list="typeList" mode="subsection" :current="current"></u-subsection></view>
			<view class="u-fx u-padd u-bold u-font u-type-primary-light-bg u-content-color u-mar-t30">
				<view class="u-fx-f2 u-padd-l30">学生</view>
				<view class="u-fx-f1">主要家长</view>
			</view>
			<view class="u-fx-f1">
				<view class="u-pos-box u-scroll-y">
					<no-data v-if="dataList.length === 0"></no-data>
					<view @tap="showDialog(user.userCode)" class="u-fx-ac u-padd u-bd-b" v-for="user in dataList" :key="user.id">
						<view class="u-fx-f2 u-padd-l30">
							<view class="u-fx-ac">
								<view class="u-border-radius-all u-of u-user-img-small u-mar-r30"><image class="u-user-img-small" :src="user.photoUrl"></image></view>
								<text class="u-content-color">{{ user.userName || user.studentName }}</text>
							</view>
						</view>
						<view class="u-fx-f1 u-font-1 u-type-primary" v-html="getParent(user.userCode)"></view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="!notBZR" class="footer-btn u-fx-ac u-bg-color"><u-button @tap="share" type="primary" class="u-fx-f1 u-mar-l u-mar-r">邀请家长注册</u-button></view>
	</view>
</template>

<script>
import config from '@config';
import wx from 'weixin-js-sdk';
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from './store/index.js';
export default {
	computed: {
		isBZR: () => JSON.parse(uni.getStorageSync('protal')).isBZR,
		userInfo: () => store.userInfo,
		schoolYearId: () => store.schoolYear.schoolYearId
	},
	components: {
		noData
	},
	data() {
		return {
			notBZR: false,
			isShare: false,
			detail: {},
			pShow: false,
			current: 0,
			sTotal: 0,
			pTotal: 0,
			dataList: [],
			typeList: [
				{
					name: '全部'
				},
				{
					name: '已注册'
				},
				{
					name: '未注册'
				}
			]
		};
	},
	async mounted() {
		if (!this.isBZR) {
			this.notBZR = true;
			return;
		}
		if (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') {
			const pRes = actions.getParentList({
				schoolCode: this.userInfo.schoolCode,
				schoolYearId: this.isBZR.gradeCode,
				classCode: this.isBZR.classCode
			});
			const sRes = actions.highSchoolStudentList({
				schoolCode: this.userInfo.schoolCode,
				page: 1,
				size: 1000,
				grade: this.isBZR.gradeName,
				classCode: this.isBZR.classCode
			});
			Promise.all([sRes, pRes]).then(res => {
				this.sList = res[0].data.list;
				this.pList = res[1].data;
				this.dataList = this.sList;
				this.sTotal = this.sList.length;
				this.pTotal = this.pList.length;
			});
		} else {
			const pRes = actions.getParentList({
				schoolCode: this.userInfo.schoolCode,
				schoolYearId: this.schoolYearId,
				classCode: this.isBZR.classCode
			});
			const sRes = actions.getStudentList({
				classCode: this.isBZR.classCode,
				gradeCode: this.isBZR.gradeCode,
				schoolYearId: this.schoolYearId,
				page: 1,
				size: 100,
				schoolCode: this.userInfo.schoolCode,
				keyword: ''
			});
			Promise.all([sRes, pRes]).then(res => {
				this.sList = res[0].data.list;
				this.pList = res[1].data;
				this.dataList = this.sList;
				this.sTotal = this.sList.length;
				this.pTotal = this.pList.length;
			});
		}
	},
	methods: {
		showDialog(code) {
			const tag = this.pList.filter(item => {
				return code === item.studentCode;
			});
			if (tag.length > 0) {
				this.pShow = true;
				this.detail = tag[0];
			}
		},
		getParent(code) {
			if (this.current === 2) {
				return '<span class="u-tips-color">未注册</span>';
			}
			const res = this.pList.filter(item => {
				return code === item.studentCode;
			});
			return res.length === 0 ? '<span class="u-tips-color">未注册</span>' : res[0].parentName;
		},
		change(index) {
			this.current = index;
			if (index === 0) {
				this.dataList = this.sList;
			} else if (index === 1) {
				this.dataList = this.pList.map(item => {
					return {
						...item,
						userCode: item.studentCode,
						photoUrl: this.sList.filter(it => {
							return item.studentCode === it.userCode;
						})[0].photoUrl
					};
				});
			} else {
				this.dataList = this.sList.filter(item => {
					return (
						this.pList.findIndex(it => {
							return it.studentCode === item.userCode;
						}) === -1
					);
				});
			}
		},
		share() {
			const _self = this;
			let className = '';
			let linkUrl = '';
			if (this.userInfo.schoolType === '8' || this.userInfo.schoolType === '9') {
				className = encodeURI(this.isBZR.gradeName + '' + this.isBZR.subjectName + '' + this.isBZR.className);
				linkUrl = `${config.host}/mobile-protal/parentReg?isHighSchool=1&className=${className}&schoolYearId=${this.schoolYearId}&schoolCode=${
					this.userInfo.schoolCode
				}&subjectCode=${this.isBZR.subjectCode}&gradeCode=${this.isBZR.gradeName}&classCode=${this.isBZR.classCode}&date=${new Date().getTime()}#/`;
			} else {
				className = encodeURI(this.isBZR.gradeName + '' + this.isBZR.className);
				linkUrl = `${config.host}/mobile-protal/parentReg?className=${className}&schoolYearId=${this.schoolYearId}&schoolCode=${this.userInfo.schoolCode}&gradeCode=${
					this.isBZR.gradeCode
				}&classCode=${this.isBZR.classCode}&date=${new Date().getTime()}#/`;
			}
			const desc = `${this.userInfo.userName}老师邀请您加入班级，点击链接进入绑定注册...`;
			wx.updateAppMessageShareData({
				title: '邀请家长注册', // 分享标题
				desc: desc, // 分享描述
				link: linkUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: `${config.host}/mobile-protal/parent-share.png`, // 分享图标
				success: function() {
					_self.isShare = true;
				},
				error: function(err) {
					console.log(err)
				}
			});
			wx.updateTimelineShareData({
				title: '家长注册', // 分享标题
				desc: desc, // 分享描述
				link: linkUrl,
				imgUrl: `${config.host}/mobile-protal/parent-share.png`, // 分享图标
				success: function() {
					_self.isShare = true;
				},
				error: function(err) {
					console.log(err)
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.share-dialog {
	padding-top: 580rpx;
	position: fixed;
	width: 100%;
	height: 100%;
	background: url('./images/share-one.png') no-repeat center 5px;
	background-size: auto 480rpx;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 9999;
}
.share-btn {
	height: 104rpx;
	background: url('./images/share-two.png') no-repeat center;
	background-size: auto 120rpx;
}
.parent-manage {
	.header {
		height: 288rpx;
		background: #fff url('./images/bg.png') no-repeat;
		background-size: 100% 288rpx;
	}
	.bg-header {
		height: 240rpx;
		background: url('./images/bg-header.png') no-repeat;
		background-size: 100% 240rpx;
	}
	.close-icon {
		z-index: 99999;
		bottom: 10rpx;
		left: 10rpx;
		position: absolute;
		width: 80rpx;
		height: 80rpx;
		background: url('./images/close.png') no-repeat;
		background-size: 100%;
	}
}
</style>
