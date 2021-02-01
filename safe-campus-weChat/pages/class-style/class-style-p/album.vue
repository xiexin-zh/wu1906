<template>
	<view class="u-page u-bg-fff">
		<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll">
			<no-data v-if="photoList.length === 0" msg="暂无照片"></no-data>
			<view v-else class="photo-list u-fx">
				<u-checkbox-group @change="checkboxGroupChange" class="wrap u-fx">
					<view class="photo-item u-fx-ver" v-for="(item, index) in photoList" :key="item.id">
						<view class="photo-wrapper">
							<view class="photo-pic" @click="goImgList(index)"><image :src="item.photoSrc" alt="" /></view>
							<!-- <view class="photo-desc u-fx-ac">
							<text class="title u-te u-fx-f1">{{ item.description === '' ? '暂无描述' : item.description }}</text>
						</view> -->
						</view>
					</view>
				</u-checkbox-group>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from './store/index.js';
export default {
	components: {
		noData
	},
	data() {
		return {
			photoList: [],
			pageList: {
				page: 1,
				size: 9999
			}
		};
	},
	async mounted() {
		this.id = this.$tools.getQuery().get('id')
		this.showList()
	},
	methods: {
		async showList(tag = false) {
			const req = {
				...this.pageList,
				query: this.id
			};
			const res = await actions.getAlbumPhotoList(req);
			if (tag) {
				this.photoList = this.photoList.concat(res.data.list);
			} else {
				this.photoList = res.data.list;
			}
			this.morePage = res.data.hasNextPage;
		},
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
		goImgList(index) {
			uni.setStorageSync('imgPreviewPicList', this.photoList);
			this.$tools.navTo({
				url: './imgList?index=' + index
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 210rpx);
}
.scroll {
	height: calc(100vh - 20rpx);
}
.choose {
	margin: 20rpx 20rpx 20rpx 0;
	.common-btn {
		padding: 0 20rpx;
		height: 32px;
		line-height: 32px;
	}
}
.wrap {
	flex-wrap: wrap;
	width: 100%;
}
.photo-list {
	margin-top: 20rpx;
	.photo-item {
		width: calc(50% - 0px);
		overflow: hidden;
		padding: 0rpx 20rpx 10rpx 20rpx;
		margin-bottom: 14px;
		position: relative;
		.photo-wrapper {
			border-radius: 16rpx;
			box-shadow: 2rpx 2rpx 8rpx $u-border-color;
			.photo-pic {
				height: 320rpx;
				image {
					width: 100%;
					height: 320rpx;
				}
			}
			.photo-desc {
				padding: 18rpx 0rpx 20rpx 15rpx;
				background: $u-bg-color;
				.title {
					color: $u-main-color;
				}
				.edit {
					margin-left: 12rpx;
					width: 50rpx;
					height: 38rpx;
				}
			}
			.photo-icon {
				position: absolute;
				bottom: 20rpx;
				left: 30rpx;
			}
		}
	}
}
/deep/ .u-checkbox__icon--square {
	background: #fff;
}
.show-btn {
	.common-btn {
		width: calc(50% - 10rpx);
	}
}
</style>
