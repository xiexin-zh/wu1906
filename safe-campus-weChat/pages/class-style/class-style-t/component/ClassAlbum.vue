<template>
	<view class=" u-page">
		<scroll-view scroll-y  :class="showClass ? 'scroll-h' : 'scroll-h-1'" @scrolltolower="loadMore">
			<no-data v-if="albumList.length === 0 && userType !== '1'" msg="暂无相册"></no-data>
			<view class="album-list u-fx">
				<view class="album-item u-fx-ver" v-if="userType === '1'" @click="addAlbum">
					<view class="album-wrapper">
						<view class="album-pic">
							<view class="new-album"><image src="http://canpointtest.com/mobile-img/add-album.png" alt="" />
								<view class="new-text u-fx-ac-jc">新建相册</view>
							</view>
						</view>
					</view>
				</view>
				<view
					class="album-item u-fx-ver"
					v-for="(item, index) in albumList"
					:key="item.id"
					@longtap="longtap(index)"
					@touchstart="touchstart"
					@touchend="touchend"
					@click="goDetail(item.id)"
				>
					<view class="album-wrapper">
						<view class="mask u-fx-je" v-if="item.deleteTag && userType === '1'" @click.stop="deleAlbum(item.id, index)">
							<image src="http://canpointtest.com/mobile-img/delete.png" alt="" />
						</view>
						<view class="album-pic">
							<view class="empty"><image :src="item.coverUrl ? item.coverUrl : 'http://canpointtest.com/mobile-img/no-photo.png'" alt="" /></view>
						</view>
						<view class="album-desc u-fx-ac u-bg-fff">
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
var timeOutEvent = 0;
export default {
	components: {noData},
	props: {
		userType: {
			type: String,
			default: ''
		},
		showClass: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			value0: '0',
			value1: '0',
			pageList: {
				page: 1,
				size: 9999
			},
			albumList: [],
			classList: [],
			deleteTag: false,
			touchE: '',
			touchT: '',
			schoolYearId: '',
			classCode: ''
		};
	},
	watch: {},
	async created() {
		this.schoolYearId = uni.getStorageSync("classInfo").schoolYearId;
		this.classCode = uni.getStorageSync("classInfo").classCode;
	},
	methods: {
		async showList(tag = false, teacherInfo) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				schoolCode: store.userInfo.schoolCode,
				...this.pageList,
				userCode: store.userInfo.userCode,
				classCode: teacherInfo.classCode,
				schoolYearId: teacherInfo.schoolYearId
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
			this.showList(true,{
				classCode: this.classCode,
				schoolYearId: this.schoolYearId
			})
		},
		addAlbum() {
			this.albumList.map(ele=>{
				ele.deleteTag = false
			})
			this.$tools.navTo({
				url: './form?type=0'
			});
		},
		goDetail(id) {
			if (this.touchE - this.touchT < 500) {
				this.albumList.map(ele=>{
					ele.deleteTag = false
				})
				this.$tools.navTo({
					url: './album?id=' + id + '&userType=' + this.userType
				});
			}
		},
		touchstart() {
			this.touchT = new Date().getTime();
		},
		touchend() {
			this.touchE = new Date().getTime();
		},
		longtap(index) {
			this.albumList[index].deleteTag = true;
		},
		deleAlbum(id, index) {
			this.albumList[index].deleteTag = false;
			this.$tools.delTip('确定删除此相册吗？', () => {
				actions.delAlbumById(id).then(res => {
					this.$tools.toast('删除成功', 'success');
					this.refuseText = '';
					this.$tools.goNext(() => {
						this.showList(false, {
							classCode: uni.getStorageSync("classInfo").classCode,
							schoolYearId: uni.getStorageSync("classInfo").schoolYearId
						})
					});
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 160rpx);
}
.scroll-h-1 {
	height: calc(100vh - 80rpx);
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
					position: relative;
					image {
						width: 100%;
						height: 396rpx;
					}
					.new-text{
						position: absolute;
						top: 60rpx;
						left: 0;
						right: 0;
						bottom: 0;
						margin: auto;
						font-size: 32rpx;
						color: #656770;
						font-weight: 500;
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
