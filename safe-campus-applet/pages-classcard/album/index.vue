<template>
	<view class="album">
		<view class="album-top u-fx-ac u-padd-l30 u-tips-color u-font-01">
			<text class="u-padd-r30">相册总数：{{ albumTotal }}</text> 图片视频总数：{{ photoTotal }}
		</view>
		<no-data v-if="albumList.length == 0" msg="班级还未创建相册哦~" top="200" autoImg="http://canpointtest.com/mini-img/auto-album.png" tips="您可以上传图片和视频,马上去创建吧"></no-data>
		<view class="album-list" @tap="photoDetail(album.id, album.albumName)" v-for="(album, index) in albumList" :key="index">
			<u-image height="300rpx" width="100%" :src="album.coverUrl||autoImg"></u-image>
			<view class="u-tips-color u-mar-t u-te u-font-01">{{ album.albumName }}</view>
		</view>
		<view class="add-btn">
			<view @click="addAlbum" class="add-btn u-fx-ac u-padd-l40 u-padd-r40"><view class="primary-btn u-fx-f1 u-mar-l40 u-mar-r40">创建相册</view></view>
		</view>
	</view>
</template>

<script>
	import { store, actions } from '@store'
	import baseData from '@u/base-data'
	import NoData from '../component/NoData.vue'
	import eventBus from '@u/eventBus'
	export default {
		components: {
			NoData
		},
		data () {
			return {
				albumTotal: 0,
				photoTotal: 0,
				autoImg: 'http://canpointtest.com/mini-img/auto-camera.png',
				baseData,
				albumList: []
			}
		},
		mounted() {
			eventBus.$on('addAlbumOk', () => {
				this._getAlbumList()
			})
			this._getAlbumList()
		},
		methods: {
			async _getAlbumList () {
				const res = await actions.getAlbumList({
					classCode: this.baseData.getClassCode(),
					gradeCode: this.baseData.getGradeCode(),
					page: 1,
					size: 100,
					schoolCode: store.userInfo.schoolCode,
					schoolYearId: store.schoolYear.id,
					schoolYear: store.schoolYear.schoolYear
				})
				this.albumList = res.data.list || []
				this.albumTotal = this.albumList.length
				this.photoTotal = this.albumList.reduce((prev, curr) => {
					return prev + curr.photoCount
				}, 0)
			},
			addAlbum () {
				this.$tools.navTo({
					url: '/pages-classcard/album/createAlbum'
				})
			},
			photoDetail (id, name) {
				uni.setStorageSync('albumId', id)
				uni.setStorageSync('albumName', name)
				this.$tools.navTo({
					url: '/pages-classcard/album/photoList'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.album {
		padding-top: 100rpx;
		padding-bottom: 120rpx;
		overflow: auto;
		.album-top {
			top: 0;
			left: 0;
			height: 80rpx;
			position: fixed;
			z-index: 99;
			width: 100%;
			background-color: #fff;
		}
		.album-list {
			margin-bottom: 30rpx;
			padding: 15rpx;
			width: 45%;
			height: 384rpx;
			float: left;
			margin-left: 3.33%;
			border: 1px #eee solid;
			border-radius: 10rpx;
			background-color: #fff;
		}
		.add-album {
			position: fixed;
			height: 120rpx;
		}
	}
</style>
