<template>
	<view class="u-page u-bg-fff">
		<view class="u-fx-jsb u-fx-ac" v-if="userType === '1'">
			<view class="choose"><!-- <view class="common-btn mar-l20" @click="allChoose" v-if="allChooseTag">全选</view> -->
				<u-checkbox-group class="mar-l20" v-if="allChooseTag && photoList.length > 0">
					<u-checkbox v-model="allChecked" @change="allChoose">全选</u-checkbox>
				</u-checkbox-group>
			</view>
			<view class="choose u-fx-je">
				<view v-if="photoList.length > 0" class="common-btn mar-r20" @click="choose(1)">轮播图设置</view>
				<view v-if="photoList.length > 0" class="common-btn" @click="choose(0)">删除</view>
			</view>
		</view>
		<scroll-view scroll-y="true" @scrolltolower="loadMore" :class="userType === '1' ? 'scroll-h' : 'scroll'">
			<no-data v-if="photoList.length === 0" msg="暂无照片"></no-data>
			<view v-else class="photo-list u-fx">
				<u-checkbox-group class="wrap u-fx">
					<view class="photo-item u-fx-ver" v-for="(item, index) in photoList" :key="item.id">
						<view class="photo-wrapper">
							<view class="photo-pic" @click="goImgList(index)"><image :src="item.photoSrc" alt="" /></view>
							<!-- <view class="photo-desc u-fx-ac">
							<text class="title u-te u-fx-f1">{{ item.description === '' ? '暂无描述' : item.description }}</text>
						</view> -->
							<view class="photo-icon" v-if="showCheckTag"><u-checkbox v-model="item.checked" :name="item.id" @change="checkboxChange"></u-checkbox></view>
						</view>
					</view>
				</u-checkbox-group>
			</view>
		</scroll-view>
		<view v-if="userType === '1'">
			<view v-if="!showCheckTag" class="common-btn mar-t20" @click="add">上传照片</view>
			<view v-else class="show-btn mar-t20 u-fx-jsb">
				<view class="common-btn u-bg-color u-type-primary" @click="cancel">取消</view>
				<view class="common-btn" @click="sure()">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from './store/index.js';
export default {
	components: {
		noData
	},
	data() {
		return {
			photoList: [],
			userType: '0',
			chooseType: '1', //1轮播，2删除
			showCheckTag: false,
			allChooseTag: false,
			allChecked: false,
			chooseList: [],
			canClick: true,
			pageList: {
				page: 1,
				size: 9999
			},
			editTag: false
		};
	},
	watch:{
		allChecked(val){
			
		}
	},
	async mounted() {
		this.id = this.$tools.getQuery().get('id');
		this.userType = this.$tools.getQuery().get('userType');
		this.showList();
		eventBus.$on('getList', () => {
			this.showList();
		});
	},
	methods: {
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
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
		choose(type) {
			if(!this.canClick) return
			this.editTag = true
			if (type === 1) {
				this.chooseType = '1';
				this.photoList.forEach(ele => {
					if (ele.isCover === '1') {
						this.chooseList.push(ele.id);
						this.$set(ele, 'checked', true);
					} else {
						this.$set(ele, 'checked', false);
					}
				});
			} else {
				this.chooseType = '2';
				this.allChooseTag = true;
				this.chooseList = [];
				this.photoList.forEach(el => {
					this.$set(el, 'checked', false);
				});
			}
			this.canClick = false
			this.showCheckTag = true;
		},
		allChoose(val){
			console.log(val)
			if(this.chooseList.length === this.photoList.length){
				this.chooseList = []
				this.photoList.forEach(ele => {
					this.$set(ele, 'checked', false);
				});
			}else{
				this.chooseList = []
				this.photoList.forEach(ele => {
					this.chooseList.push(ele.id);
					this.$set(ele, 'checked', true);
				});
			}
		},
		add() {
			this.$tools.navTo({
				url: './form?type=1&id=' + this.id,
				title: '上传照片'
			});
		},
		// 选中任一checkbox时，由checkbox-group触发
		checkboxChange(e) {
			if (e.value) {
				this.chooseList.push(e.name);
			} else {
				const index = this.chooseList.indexOf(e.name);
				this.chooseList.splice(index, 1);
			}
			if(this.chooseType === '2'){
				if(this.chooseList.length === this.photoList.length){
					this.allChecked = true
				}else{
					this.allChecked = false
				}
			}
			console.log(this.chooseList);
		},
		setAlbum() {
			if (this.chooseList.length > 5) {
				this.$tools.toast('最多只能选择五张');
				return;
			}
			const req = {
				albumId: this.id,
				ids: this.chooseList
			};
			actions.setCovers(req).then(res => {
				this.canClick = true
				this.$tools.toast('设置成功', 'success');
				this.chooseList = [];
				this.showCheckTag = false;
				this.$tools.goNext(() => {
					this.showList(false);
				});
			});
		},
		delePhoto() {
			if (this.chooseList.length === 0) {
				this.$tools.toast('请选择照片');
				return;
			}
			this.$tools.delTip('确定删除这些照片吗？', () => {
				actions.delPhotoById(this.chooseList).then(res => {
					this.canClick = true
					this.$tools.toast('删除成功', 'success');
					this.chooseList = [];
					this.allChooseTag = false;
					this.showCheckTag = false;
					this.allChecked = false
					this.$tools.goNext(() => {
						this.showList(false);
					});
				});
			});
		},
		cancel() {
			this.chooseList = [];
			this.allChooseTag = false;
			this.showCheckTag = false;
			this.allChooseTag = false;
			this.allChecked = false
			this.canClick = true
		},
		sure() {
			if (this.chooseType === '1') {
				this.setAlbum();
			} else {
				this.delePhoto();
			}
		},
		goImgList(index) {
			if(this.editTag){
				return
			}
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
	height: 64rpx;
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
	.photo-item {
		width: calc(50% - 0px);
		overflow: hidden;
		padding: 20rpx 20rpx 0rpx 20rpx;
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
