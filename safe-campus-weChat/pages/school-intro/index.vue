<template>
	<view class="u-page">
		<no-data v-if="!dataInfo.content" msg="暂无数据"></no-data>
		<view v-else class="">
			<view v-if="type === 'image'" class="wrap u-padd-20"><u-swiper height="400" img-mode="aspectFit" :list="list" @click="previewImage"></u-swiper></view>
			<view class="u-fx-ac-jc u-padd-20" v-if="type === 'video'">
				<video class="uploade-video u-fx-ac" :src="videoUrl" controls enable-play-gesture></video>
			</view>
			<view class="u-mar-20 u-mar-t10">
				<u-icon class="u-font-3" name="calendar" color="#2979ff"></u-icon>
				<text class="mar-l20 u-font-1 u-bold">学校简介：</text>
			</view>
			<scroll-view scroll-y="true" class="scroll-h">
				<view class="u-auto">
					<view class="u-padd-l20 u-padd-r20">
						<text class="content">
							{{ dataInfo.content }}
						</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from './store/index.js';
export default {
	name: 'school-intro',
	components: {
		noData
	},
	data() {
		return {
			type: '',
			dataInfo: {
				content: ''
			},
			list: [],
			videoUrl: ''
		};
	},
	async created() {
		this.showList()
	},
	methods: {
		previewImage(index) {
			uni.previewImage({
				current: index,
				urls: this.list.map(el => {
					return el.image;
				})
			});
		},
		async showList() {
			const res = await actions.getSchoolShow(store.userInfo.schoolCode);
			const fileRes = await actions.getSchoolShowFile(store.userInfo.schoolCode);
			this.dataInfo = res.data;
			if(fileRes.data.length ===0 ){
				return
			}
			if('mp4|ogg|webm'.toLowerCase().indexOf(fileRes.data[0].fileType.toLowerCase()) !== -1){
				this.type = 'video'
				this.videoUrl = fileRes.data[0].url
			}else{
				this.type = 'image'
				this.list = fileRes.data.map(el => {
					return {
						image: el.url 
					}
				})
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 540rpx);
}
.uploade-video {
	display: block;
	max-width: 100%;
	max-height: 400rpx;
}
</style>
