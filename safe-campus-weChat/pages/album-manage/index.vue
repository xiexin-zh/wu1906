<template>
	<view class="u-page u-bg-fff u-padd-20">
		<scroll-view scroll-y class="scroll-h">
			<no-data v-if="userType === 3 && albumList.length === 0" msg="暂无相册"></no-data>
			<view class="album-list u-fx">
				<view class="album-item u-mar-20 u-fx-ver" @click="add" v-if="userType !== 3">
					<view class="album-wrapper">
						<view class="album-pic">
							<view class="new-album">
								<image src="http://canpointtest.com/mobile-img/new-album.png" alt="" />
								<view class="new-text u-fx-ac-jc">新建相册</view>
							</view>
						</view>
					</view>
				</view>
				<view class="album-item u-mar-20 u-fx-ver" v-for="(item, index) in albumList" :key="item.id">
					<view class="album-wrapper">
						<view class="album-pic"><image @click="goDetail(item.id)" :src="item.coverUrl ? item.coverUrl : 'http://canpointtest.com/mobile-img/auto-photo.png'" alt="" /></view>
						<view class="album-desc u-fx-jsb u-fx-ac u-bg-fff">
							<view class="u-mar-l20 u-te">
								<text class="u-font-01">{{ item.albumName }}</text>
								<text class="u-font-02 u-mar-l10 u-tips-color">( {{ item.number || 0 }} )张</text>
							</view>
							<image v-if="userType !== 3" @click.stop="action(item)" class="more u-font-1 u-mar-r20" src="http://canpointtest.com/mobile-img/edit.png" alt="" />
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<u-modal v-model="showTag" ref="uModal" :async-close="true" :show-title="false" show-cancel-button @confirm="addAlbum(0)">
			<view class="pop u-fx-ver u-mar-l20 u-mar-r20">
				<input class="u-border-radius" v-model="albumName" placeholder="请输入相册名称" />
			</view>
		</u-modal>
	</view>
</template>

<script>
import wxApi from '@u/wxApi'
import eventBus from '@u/eventBus';
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from './store/index.js';
export default {
	name: 'AlbumManage',
	components: {
		noData
	},
	data() {
		return {
			userType: 2, // 0.超管，1.班主任，2.教职工，3.家长
			showTag: false,
			albumList: [],
			actionList: ['添加照片', '发布对象', '全屏播放设置', '编辑相册', '删除相册'],
			albumName: ''
		};
	},
	created() {
		if (store.userInfo.typeCode === '4') {
			this.userType = 2;
		} else if (store.userInfo.typeCode === '16') {
			this.userType = 3;
		}
	},
	mounted() {
		wxApi.getConfig('protal-card')
		eventBus.$on('refList', () => {
			this.showList();
		});
		this.showList();
	},
	methods: {
		async showList() {
			const req = {
				schoolCode: store.userInfo.schoolCode
			};
			const res = await actions.getAlbumList(req);
			this.albumList = res.data;
		},
		add() {
			this.albumName = '';
			this.showTag = true;
		},
		async addAlbum() {
			if(!this.albumName){
				this.$tools.toast('请输入相册名称');
				setTimeout(() => {
					this.$refs.uModal.clearLoading();
				}, 500)
				return
			}
			if (this.editTag) {
				await actions.editAlbum({
					albumName: this.albumName,
					id: this.albumId,
					schoolCode: store.userInfo.schoolCode,
					createUsercode: store.userInfo.userCode,
					createUsername: store.userInfo.userName
				});
				this.$tools.toast('编辑成功', 'success');
				this.$tools.goNext(() => {
					this.albumName = '';
					this.showTag = false;
					this.showList();
				});
			} else {
				await actions.addNewAlbum({
					albumName: this.albumName,
					schoolCode: store.userInfo.schoolCode,
					createUsercode: store.userInfo.userCode,
					createUsername: store.userInfo.userName
				});
				this.$tools.toast('新建成功', 'success');
				this.$tools.goNext(() => {
					this.albumName = '';
					this.showTag = false;
					this.showList();
				});
			}
		},
		goDetail(id) {
			this.$tools.navTo({
				url: './album?id=' + id
			});
		},
		action(item) {
			this.$tools.actionsheet(this.actionList, index => {
				if (index === 0) {
					// 添加照片
					this.goDetail(item.id);
				} else if (index === 1) {
					// 发布对象
					this.$tools.navTo({
						url: './sendTo?id=' + item.albumCode
					});
				} else if (index === 2) {
					// 全屏播放设置
					this.$tools.navTo({
						url: './fullScreen?id=' + item.albumCode
					});
				} else if (index === 3) {
					// 编辑相册
					this.editTag = true;
					this.albumId = item.id;
					this.albumName = item.albumName;
					this.showTag = true;
				} else if (index === 4) {
					// 删除相册
					this.$tools.delTip('确认要删除该相册吗?', () => {
						actions.deleteAlbum(item.id).then(res => {
							this.$tools.toast('删除成功', 'success');
							this.$tools.goNext(() => {
								this.showList();
							});
						});
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 40rpx);
}
.album-list {
	flex-wrap: wrap;
	.album-item {
		width: calc(50% - 40rpx);
		overflow: hidden;
		margin-bottom: 14rpx;
		border-radius: 4rpx;
		height: 245rpx;
		box-shadow: 0rpx 3rpx 6rpx 0rpx rgba(200, 198, 198, 0.35);
		.album-wrapper {
			border-radius: 16rpx;
			position: relative;
			.album-pic {
				image {
					width: 100%;
					height: 192rpx;
				}
				.new-album {
					position: relative;
					image {
						width: 100%;
						height: 245rpx;
					}
					.new-text {
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
				.more {
					width: 31rpx;
					height: 6rpx;
				}
			}
		}
	}
}
.pop {
  input {
    border: 1rpx solid $u-border-color;
    margin: 20rpx 0;
		padding: 0 20rpx;
  }
}
/deep/ uni-input {
  line-height: 2.1em;
  height: 2.1em;
  min-height: 2.1em;
}
</style>
