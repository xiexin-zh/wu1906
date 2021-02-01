<template>
	<view class="cast home u-page">
		<!-- <no-data msg="暂无数据" ></no-data> -->
		<!-- <view class="u-font-01 select  u-fx-ac u-fx-jc">
				当前区域：
				<view class="u-fx-ac u-fx-jc " @click="show=!show">
					<text class='u-type-primary text-color'>{{selectItem}}</text>
					<view class="icon"></view>
				</view>
				<u-select v-model="show" mode="single-column" :list="options" 
				@confirm="confirm"></u-select>
		</view> -->
		<view class="image u-fx-ac-jc">
			<view class="cont">
			</view>
		</view>
		<view class="text u-fx-ac-jc u-type-primary u-mar-b40">请说话，松开完成</view>
		<view class="footer-btn u-fx-ac u-bg-color">
			<u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg" @click="submitForm">
				按住说话
			</u-button>
		</view>
	</view>
</template>
<script>
import { store, actions } from '../store/index.js';
export default {
	components:{
	},
	name:'call',
	computed: {
		isBZR: () => JSON.parse(uni.getStorageSync('protal')).isBZR,
		userInfo: () => store.userInfo,
		schoolYearId: () => store.schoolYear.schoolYearId
	},
	data() {
		return {
			arrow: true,
			currentIndex: '1',
		};
	},
	async mounted() {
	},
	methods: {
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
	}
};
</script>

<style lang="scss" scoped>
.home {
	.icon{
			margin-left: 15rpx;
			margin-top: 17rpx;
			display:inline-block;
			width:0;
			height:0;
			border-top:6rpx solid transparent;
			border-left:6rpx solid transparent;
			border-right:6rpx solid #0084FF;
			border-bottom:6rpx solid #0084FF;
			// transform:rotate(132deg); 
		}
	.select{
		margin-top: 60rpx;
	}
	.image{
		margin: 250rpx auto;
		height: 350rpx;
		width: 350rpx;
		background: url('/mobile-img/lijiqidong.png') center center no-repeat;
		background-size: 100% 100%;
	}
	.footer-btn{
		padding: 0 130rpx;
	}
}
</style>
