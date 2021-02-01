<template>
	<view class=" u-page">
		<no-data v-if="noDataTag" msg="请绑定学生"></no-data>
		<view v-else>
			<choose-child @change="childInfo"></choose-child>
			<view class="">
				<u-tabs-swiper
					ref="uTabs"
					:bold="false"
					:bar-style="{ transform: 'scale(3)', height: '1rpx' }"
					:current="current"
					@change="changeMenu"
					:list="tabList"
					:is-scroll="false"
					active-color="#2979ff"
				></u-tabs-swiper>
			</view>
			<swiper class="u-page u-bg-fff" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item scroll-h">
					<scroll-view class="class-style scroll-h">
						<view class="class-card">
							<u-icon class="u-icon-38" name="calendar" color="#2979ff" size="38"></u-icon>
							<text class="mar-l20">班级格言：</text>
						</view>
						<view class="u-fx-ver">
							<view class="input motto">
								<text class="padd-l20 mar-l20">{{ classMotto }}</text>
							</view>
						</view>
						<view class="class-card">
							<u-icon class="u-icon-38" name="calendar" color="#2979ff" size="38"></u-icon>
							<text class="mar-l20">班级简介：</text>
						</view>
						<view class="u-fx-ver">
							<view class="input motto area auto">
								<text class="padd-l20 mar-l20">{{ classIntro }}</text>
							</view>
						</view>
						<view class="class-card">
							<u-icon class="u-icon-38" name="calendar" color="#2979ff" size="38"></u-icon>
							<text class="mar-l20">班级全家福：</text>
						</view>
						<view class="u-fx-ver">
							<image class="class-image" :src="photoUrl" mode="" @tap="previewImage()"></image>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item"><class-album ref="child"></class-album></swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
import chooseChild from '@/components/choose-child/choose-child.vue';
import ClassAlbum from './component/ClassAlbum.vue';
import { store, actions } from './store/index.js';
export default {
	name: 'ClassStyle',
	components: {
		ClassAlbum,
		chooseChild
	},
	data() {
		return {
			pageList: {
				page: 1,
				size: 15
			},
			noDataTag: false,
			showTag: false,
			current: 0,
			swiperCurrent: 0,
			classMotto: '',
			classIntro: '',
			photoUrl: '',
			classCode: '',
			schoolYearId: '',
			tabList: [
				{
					name: '班级格言'
				},
				{
					name: '班级相册'
				}
			]
		};
	},
	watch: {
		classCode(val) {
			this.showMotto();
			this.$refs.child.showList(false, {
				classCode: this.classCode,
				schoolYearId: this.schoolYearId
			});
		}
	},
	async created() {
		this.schoolYearId = store.schoolYear.schoolYearId;
		if(!store.childList || store.childList.length === 0){
			this.noDataTag = true
			return
		}
		this.classCode = store.childList[0].classCode;
	},
	mounted() {},
	methods: {
		childInfo(item) {
			if (item.classCode !== this.classCode) {
				this.classCode = item.classCode;
			}
		},
		previewImage() {
			console.log()
			uni.previewImage({
				urls: [this.photoUrl]
			});
		},
		changeMenu(item) {
			this.swiperCurrent = item;
		},
		transition(e) {
			let dx = e.detail.dx;
			this.$refs.uTabs.setDx(dx);
		},
		animationfinish(e) {
			let current = e.detail.current;
			this.$refs.uTabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
		},
		async showMotto(tag = false) {
			const req = {
				schoolCode: store.userInfo.schoolCode,
				classCode: this.classCode,
				schoolYearId: this.schoolYearId
			};
			console.log(req);
			const res = await actions.getClassMotto(req);
			if (!res.data) {
				this.classMotto = '';
				this.classIntro = '';
				this.photoUrl = ''
				return;
			}
			this.classMotto = res.data.motto;
			this.classIntro = res.data.introduce;
			this.photoUrl = res.data.photoUrl
		},
		goDetail(id) {
			this.$tools.navTo({
				url: './detail?id=' + id
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.class-style {
	background: url(http://canpointtest.com/mobile-img/background.png) no-repeat;
	background-size: 100% 100%;
}
.scroll-h {
	height: calc(100vh - 168rpx);
}
.class-card {
	margin: 40rpx;
	font-size: 32rpx;
}
.input {
	margin: 0 20rpx;
	width: 98%;
	padding: 0rpx 0 0 60rpx;
	line-height: 56rpx;
	font-size: 32rpx;
	position: relative;
	height: 160rpx;
	.length {
		position: absolute;
		right: 11%;
		bottom: 10rpx;
	}
}
.area {
	height: 290rpx;
	/deep/ .uni-textarea-textarea {
		height: 290rpx;
		overflow: auto;
	}
}
.motto {
	width: 86%;
}
.auto {
	overflow: auto;
}
.u-icon-38{
	font-size: 38rpx;
}
.class-image{
	width: 210rpx;
	height: 210rpx;
	margin-left: 40rpx;
}
</style>
