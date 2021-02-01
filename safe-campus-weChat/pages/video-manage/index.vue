<template>
	<view class="u-page u-bg-fff u-padd-20">
		<no-data v-if="videoList.length === 0" msg="暂无视频"></no-data>
		<scroll-view v-else scroll-y class="scroll-h" @scrolltolower="loadMore">
			<view class="album-list u-fx">
				<view class="album-item u-mar-20 u-fx-ver" v-for="(item, index) in videoList" :key="item.id">
					<view class="album-wrapper">
						<view class="album-pic"><video object-fit="contain" @click="playVideo(item)" :src="item.url"></video></view>
						<view class="album-desc u-fx-jsb u-fx-ac u-bg-fff">
							<view class="u-mar-l20 u-te">
								<text class="u-font-01">{{ item.fileName }}</text>
							</view>
							<image v-if="userType !== 3" @click.stop="action(item)" class="more u-font-1 u-mar-r20" src="http://canpointtest.com/mobile-img/edit.png" alt="" />
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view v-if="userType !== 3" class="float-add-btn" @click="add(0)"></view>
		<u-popup v-model="videoTag" mode="center">
			<view class="pop-up u-padd-t10 u-padd-l10 u-padd-r10 u-border-radius">
				<video class="video u-border-radius" :src="videoUrl" controls enable-play-gesture object-fit="contain"></video>
			</view>
		</u-popup>
		<u-modal v-model="editTag" :show-title="false" show-cancel-button @confirm="_editVideo">
			<view class="u-fx-ver u-mar-t20 u-mar-r20 u-mar-l20"><u-input v-model="fileName" maxlength="10" type="text" :border="true" placeholder="请输入视频名称" /></view>
		</u-modal>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from './store/index.js';
export default {
	name: 'VideoManage',
	components: {
		noData
	},
	data() {
		return {
			userType: 2, // 0.超管，1.班主任，2.教职工，3.家长
			videoTag: false,
			editTag: false,
			pageList: {
				page: 1,
				size: 20
			},
			morePage: false,
			videoUrl: '',
			videoList: [],
			actionList: ['发布对象', '轮播设置', '全屏展示设置', '编辑视频', '删除视频'],
			fileName: ''
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
		eventBus.$on('getList', () => {
			this.showList();
		});
		this.showList();
	},
	methods: {
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				schoolCode: store.userInfo.schoolCode
			};
			console.log(req);
			const res = await actions.getVideoList(req);
			if (tag) {
				this.videoList = this.videoList.concat(res.data.list);
			} else {
				this.videoList = res.data.list;
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
		add(id) {
			this.$tools.navTo({
				url: './form?id=' + id
			});
		},
		playVideo(item) {
			this.videoUrl = item.url;
			this.videoTag = true;
		},
		async _editVideo(id) {
			await actions.editVideo({
				fileName: this.fileName,
				id: this.videoId,
				schoolCode: store.userInfo.schoolCode,
				createUsercode: store.userInfo.userCode,
				createUsername: store.userInfo.userName
			});
			this.$tools.toast('编辑成功', 'success');
			this.$tools.goNext(() => {
				this.fileName = '';
				this.showList();
			});
		},
		action(item) {
			this.$tools.actionsheet(this.actionList, index => {
				if (index === 0) {
					// 发布对象
					this.$tools.navTo({
						url: './sendTo?id=' + item.mediaCode
					});
				} else if (index === 1) {
					// 轮播设置
					uni.showModal({
						title: '温馨提示',
						content: '是否将该视频设置为首页轮播?',
						cancelText: '取消',
						confirmText: '设置为轮播',
						showCancel: true,
						success: async res => {
							if (res.confirm) {
								await actions.editVideo({
									mediaCode: item.mediaCode,
									id: item.id,
									schoolCode: store.userInfo.schoolCode,
									isCover: 1
								});
								this.$tools.toast('设置成功', 'success')
								this.$tools.goNext(() => {
									this.showList();
								});
							} else {
							}
						}
					});
				} else if (index === 2) {
					// 全屏设置
					this.$tools.navTo({
						url: './fullScreen?id=' + item.mediaCode
					});
				} else if (index === 3) {
					// 编辑视频
					this.fileName = item.fileName;
					this.videoId = item.id;
					this.editTag = true;
				} else if (index === 4) {
					// 删除视频
					this.$tools.delTip('确认要删除该视频吗?', () => {
						actions.deleteVideo(item.id).then(res => {
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
				video {
					width: 100%;
					height: 192rpx;
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
</style>
