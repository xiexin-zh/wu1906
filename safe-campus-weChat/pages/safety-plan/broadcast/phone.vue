<template>
	<view class="cast home u-page">
		<view class="text u-fx-ac-jc u-mar-b30">00:00:00</view>
		<view class="image u-fx-ac-jc">
			<view class="cont">
				
			</view>
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
		}
	.select{
		margin-top: 60rpx;
		
	}
	.text{
		margin-top: 186rpx;
		margin-bottom: 73rpx;
		font-size: 40rpx;
		font-family: Source Han Sans CN;
		font-weight: 500;
		color: #333333;
	}
	.image{
		margin: 0rpx auto;
		height: 350rpx;
		width: 350rpx;
		background: url('/mobile-img/big_button_dianhua.png') center center no-repeat;
		background-size: 100% 100%;
	}
}
</style>
