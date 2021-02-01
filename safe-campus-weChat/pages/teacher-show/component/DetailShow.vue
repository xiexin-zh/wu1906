<template>
	<view class="content-circle u-padd-20 u-border-radius u-auto">
		<view v-if="parseInt(unReadCommentInfo.unReadCommentCount) > 0" class="u-type-white-bg u-padd-t20 u-fx-jc u-border-radius">
			<view class="new-tips u-fx-ac u-type-white u-bg-000 u-padd-10 u-border-radius" @tap.stop="goNewList">
				<u-icon class="u-icon-35 u-mar-r20 u-mar-l10 u-bg-fff" :name="unReadCommentInfo.lastReplyPhotoUrl"></u-icon>
				<text class="u-font-02">{{ unReadCommentInfo.unReadCommentCount }}条新消息</text>
			</view>
		</view>
		<view class="content-circle-box u-bd-b u-fx u-padd-20 u-bg-fff u-border-radius" v-for="(item, index) in newsList" :key="index">
			<view class="headimg"><image class="img u-border-radius" :src="item.photo_url || 'http://canpointtest.com/mobile-img/person-auto.png'"></image></view>
			<view class="content u-fx-f1 u-padd-l20 u-padd-r20">
				<view class="u-type-primary-dark u-font-1" @tap.stop="goDetail(item.id)">
					{{ item.category == '1' ? item.create_userName : item.children_name }}
					<!-- <text v-if="item.category == '3'" class="u-font-03 u-type-info u-mar-l10">({{ item.relationship | getRelationShip }})</text> -->
				</view>
				<view class="u-content-color u-padd-t10">
					<u-read-more :toggle="true" font-size="22" close-text="展开" text-indent="0" :show-height="85" :shadow-style="shadowStyle">{{ item.moments_msg }}</u-read-more>
				</view>
				<view class="content-img u-mar-t10" v-if="item.videoList.length > 0"><video class="uploade-video" :src="item.videoList[0].url" controls enable-play-gesture></video></view>
				<view class="content-img u-mar-t10" v-if="item.fileList.length > 0">
					<!-- //只有一张图时候 -->
					<view v-if="item.fileList.length === 1"><image mode="widthFix" class="img-1" :src="item.fileList[0].url" @tap.stop="previewImg(0, item.fileList)"></image></view>
					<!-- 有多张图的时候 -->
					<view v-else>
						<view class="content-img-more u-fx-wp">
							<image
								mode="aspectFill"
								class="img-more u-mar-10"
								v-for="(file, index) in item.fileList"
								:key="index"
								:class="index % 3 == 0 && 'u-mar-l0'"
								:src="file.url"
								@tap.stop="previewImg(index, item.fileList)"
							></image>
						</view>
					</view>
				</view>
				<!-- 相对时间 点赞按钮等 -->
				<view class="common u-fx-jsb u-fx-ac u-font-01 u-mar-t10">
					<view class="u-tips-color">
						<text>{{ item.create_time | timeFrom() }}</text>
						<text v-if="userType === 1 || (userType === 2 && item.create_userCode === userCode ) || (userType === 3 && item.children_code === userCode )" class="u-type-primary-dark u-mar-l10 u-font-02" @tap.stop="delMoment(item.id)">删除</text>
					</view>
					<transition name="fade">
						<view v-show="item.showAction" class="show-action u-fx-ac u-bg-color u-padd-20 u-padd-t10 u-padd-b10 u-border-radius">
							<view class="u-fx u-font-02" @tap.stop="clickThumb(item, index)">
								<u-icon class="u-icon-35 u-bold-border u-mar-r10" color="red" :name="item.isLike ? 'heart-fill' : 'heart'"></u-icon>
								<text>{{ item.isLike ? '取消' : '赞' }}</text>
							</view>
							<view class="u-fx u-font-02" @tap.stop="handleComment(item, null)">
								<u-icon class="u-icon-35 u-mar-l20 u-mar-r10" name="chat"></u-icon>
								<text>评论</text>
							</view>
						</view>
					</transition>
					<view class="u-bg-color action u-border-radius" @tap.stop="showLike(index)">..</view>
				</view>
				<!-- 点赞人 评论 -->
				<view class="msg-box u-bg-color u-mar-t10 u-type-primary-dark u-font-02">
					<view class="u-fx-wp u-fx-ac u-padd-20" v-if="item.likeList.length > 0">
						<u-icon class="u-icon-35 u-bold-border u-mar-r10" name="heart"></u-icon>
						<text class="u-te2" v-for="(userInfo, index) in item.likeList" :key="userInfo.id">{{ userInfo.createUsername }}{{ index != item.likeList.length-1 ? '，' : '' }}</text>
					</view>
					<view class="u-padd-20 thumbinfo " v-if="item.commentList.length > 0">
						<view class="u-padd-b10" v-for="(comment, index) in item.commentList" :key="index">
							<text class="" v-if="!comment.replyUsercode">{{ comment.childrenName || comment.createUsername }}：</text>
							<text class="" v-else>
								{{ comment.childrenName || comment.createUsername }}
								<text class="u-type-info">回复</text>
							</text>
							<text v-if="comment.replyUsercode" class="">{{ comment.replyUsername }}：</text>
							<text class="u-content-color" @tap.stop="handleComment(item, comment)">{{ comment.msg }}</text>
							<text v-if="userType === 1 || (comment.childrenCode ? comment.childrenCode === userCode : comment.createUsercode === userCode )" class="u-type-primary-dark u-mar-l10 u-font-02" @tap.stop="delComment(comment.id)">删除</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { store, actions } from '../store/index.js';
export default {
	props: {
		newsList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		unReadCommentInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		userType: {
			type: Number,
			default: 2
		}
	},
	data() {
		return {
			userCode: '',
			shadowStyle: {
				backgroundImage: 'none',
				paddingTop: '0',
				marginTop: '20rpx',
				justifyContent: 'left'
			}
		};
	},
	created() {
		this.userCode = this.userType === 3 ? uni.getStorageSync("bindInfo").userCode : store.userInfo.userCode;
	},
	methods: {
		//查看大图
		previewImg(current, imgList) {
			uni.previewImage({
				current,
				urls: imgList.map(el => {
					return el.url;
				})
			});
		},
		delComment(id) {
			this.$tools.delTip('确定删除此评论吗？', () => {
				actions.deleteComment(id).then(res => {
					this.$tools.toast('删除成功', 'success');
					this.$tools.goNext(() => {
						this.$emit('refresh');
					});
				});
			});
		},
		delMoment(id) {
			this.$tools.delTip('确定删除此动态吗？', () => {
				actions.deleteMoment(id).then(res => {
					this.$tools.toast('删除成功', 'success');
					this.$tools.goNext(() => {
						this.$emit('refresh', 'delete');
					});
				});
			});
		},
		//点赞
		showLike(index) {
			this.newsList.forEach((el, i) => {
				if (i === index) {
					if (el.likeList.findIndex(list => list.createUsercode === this.userCode) !== -1) {
						this.$set(el, 'isLike', true);
					} else {
						this.$set(el, 'isLike', false);
					}
					this.$set(el, 'showAction', !el.showAction);
				} else {
					this.$set(el, 'showAction', false);
				}
			});
		},
		clickThumb(item, index) {
			if(item.isLike){
				this.newsList[index].isLike = false
				let i = item.likeList.findIndex(list => list.createUsercode === this.userCode)
				actions.deleteLike(item.likeList[i].id).then(res => {
					this.$tools.goNext(() => {
						this.$emit('refresh');
					});
				})
			}else{
				this.newsList[index].isLike = true
				const req = {
					createUsercode: this.userCode,
					createUsername: this.userType === 3 ? uni.getStorageSync("bindInfo").userName : store.userInfo.userName,
					momentsId: item.id,
					photoUrl: store.userInfo.photoUrl
				}
				actions.addLike(req).then(res => {
					this.$tools.goNext(() => {
						this.$emit('refresh');
					});
				})
			}
		},
		//点击评论 唤出输入框和键盘
		handleComment(item, comment) {
			this.$emit('handleComment', item, comment);
		},
		goNewList() {
			this.$tools.navTo({
				url: `./newList?userType=${this.userType}`
			});
		},
		goDetail(id) {
			this.$tools.navTo({
				url: `./detail?id=${id}&userType=${this.userType}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.u-bg-000 {
	background-color: #000000;
}
.u-mar-l0 {
	margin-left: 0;
}
.u-bd-b {
	border-bottom: 1rpx solid $u-border-color;
}
.content {
	&-circle {
		.new-tips {
			width: 200rpx;
		}
		&-box {
			.headimg {
				width: 80rpx;
				height: 80rpx;
				.img {
					width: 100%;
					height: 100%;
				}
			}
			.content {
				&-img {
					.img-1 {
						will-change: transform;
						width: 280rpx;
						height: auto;
						max-height: 400rpx;
					}
					&-more {
						.img-more {
							width: 160rpx;
							height: 160rpx;
						}
					}
				}
				.msg-box {
					.thumbinfo {
						border-top: 1rpx solid $u-type-info-disabled;
					}
				}
			}
		}
	}
}
.uploade-video {
	display: block;
	max-width: 500rpx;
	max-height: 400rpx;
}
.common {
	position: relative;
}
.show-action {
	position: absolute;
	right: 60rpx;
}
.action {
	height: 42rpx;
	line-height: 22rpx;
	letter-spacing: 10rpx;
	padding: 0 10rpx 0 20rpx;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
/deep/ .u-content {
	font-size: 26rpx;
}
/deep/ .u-showmore-wrap{
	justify-content: left;
}
.u-icon-35{
	font-size: 35rpx;
}
</style>
