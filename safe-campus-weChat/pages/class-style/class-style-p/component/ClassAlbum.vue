<template>
	<view class=" u-page">
		<scroll-view scroll-y class="scroll-h" @scrolltolower="loadMore">
			<no-data v-if="albumList.length === 0" msg="暂无相册"></no-data>
			<view class="album-list u-fx">
				<view class="album-item u-fx-ver" v-for="(item, index) in albumList" :key="item.id" @click="goDetail(item.id)">
					<view class="album-wrapper">
						<view class="album-pic">
							<view class="empty"><image :src="item.coverUrl ? item.coverUrl : 'http://canpointtest.com/mobile-img/no-photo.png'" alt="" /></view>
						</view>
						<view class="album-desc u-fx-ac">
							<span class="title u-te">{{ item.albumName }}</span>
							<span class="num u-fx-f1">( {{ item.photoCount || 0 }} )张</span>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from '../store/index.js';
export default {
	components: {
		noData
	},
	props: {
	},
	data() {
		return {
			pageList: {
				page: 1,
				size: 9999
			},
			albumList: []
		};
	},
	watch: {
	},
	async created() {
	},
	methods: {
		async showList(tag = false, studentInfo) {
			const req = {
				schoolCode: store.userInfo.schoolCode,
				...this.pageList,
				classCode: studentInfo.classCode,
				schoolYearId: studentInfo.schoolYearId
			};
			console.log(req)
			const res = await actions.getAlbumList(req);
			if (tag) {
				this.albumList = this.albumList.concat(res.data.list);
			} else {
				this.albumList = res.data.list;
			}
			this.albumList.forEach(el => {
				this.$set(el, 'deleteTag', false);
			});
			this.morePage = res.data.hasNextPage;
		},
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
		goDetail(id) {
			this.$tools.navTo({
				url: './album?id=' + id
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 108rpx);
}
.album-list {
	flex-wrap: wrap;
	.album-item {
		width: calc(50% - 0rpx);
		overflow: hidden;
		padding: 20rpx 20rpx 10rpx 20rpx;
		margin-bottom: 14rpx;
		.album-wrapper {
			border-radius: 16rpx;
			box-shadow: 2rpx 2rpx 8rpx $u-border-color;
			position: relative;
			.mask {
				position: absolute;
				top: -10rpx;
				right: -10rpx;
				z-index: 99;
				background: rgba(220, 220, 220, 0.4);
				width: 32rpx;
				height: 32rpx;
				image {
					width: 32rpx;
					height: 32rpx;
				}
			}
			.album-pic {
				.empty {
					position: relative;
					.icon {
						position: absolute;
						font-size: 48rpx;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
					}
				}
				image {
					width: 100%;
					height: 320rpx;
				}
				.new-album {
					image {
						width: 100%;
						height: 396rpx;
					}
				}
			}
			.album-desc {
				padding: 18rpx 0rpx 20rpx 15rpx;
				.title {
					color: $u-main-color;
					width: 70%;
				}
				.num {
					text-indent: 10rpx;
					color: $u-content-color;
					font-size: 20rpx;
				}
			}
			.album-icon {
				position: absolute;
				top: -16rpx;
				left: -16rpx;
				image {
					width: 32rpx;
					height: 32rpx;
				}
			}
		}
	}
}
</style>
