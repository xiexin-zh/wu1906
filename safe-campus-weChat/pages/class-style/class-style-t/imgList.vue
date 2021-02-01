<template>
	<view class="">
		<view class="mask" @click="goback">
			<swiper @change="changeSwiper" class="my_swiper" :current="current" :circular="circular" :indicator-dots="indicatorDots" :autoplay="autoplay" :duration="duration">
				<swiper-item v-for="(item, i) in picList" :key="i">
					<view class="bg_img" :style="{ backgroundImage: 'url('+item.photoSrc+')'}"></view>
					<view class="page u-te padd-l20" v-if="item.description"> <text>照片描述：{{ item.description }}</text></view>
				</swiper-item>
			</swiper>
		</view>
		<view class="page" v-if="picList.length>0">{{ current + 1 }} / {{ picList.length }}</view>
	</view>
</template>

<script>
export default { 
	data() {
		return {
			picList: [],
			indicatorDots: false,
			autoplay: false,
			duration: 500,
			circular: true,
			current: 0,
			isShowSwiper: false
		};
	},
	async mounted() {
		this.current = parseInt(this.$tools.getQuery().get('index'));
		this.picList=uni.getStorageSync("imgPreviewPicList");
	},
	methods: {
		clickPic(index) {
			this.current = index;
			this.isShowSwiper = true;
		},
		changeSwiper(e) {
			this.current = e.target.current;
		},
		goback(){
			this.$tools.goBack()
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	position: fixed;
	z-index: 6;
	color: #fff;
	bottom: 20rpx;
	text-align: center;
	width: 100%;
}
.mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgba($color: #000000, $alpha: 0.8);
	z-index: 5;
	.page {
		z-index: 16;
		color: #fff;
		bottom: 0rpx;
		padding: 10rpx 0;
		background: rgba($color: #000000, $alpha: 0.8);
	}
	> .my_swiper {
		width: 100%;
		height: 60vh;
		.bg_img {
			background-size: 100% auto;
			background-repeat: no-repeat;
			background-position:center;
			width: 100%;
			height: 100%;
		}
	}
}

.pic_list {
	display: flex;
	flex-flow: row wrap;
	> view {
		flex: 0 0 33.3vw;
		height: 33.3vw;
		padding: 1vw;
		> image {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
