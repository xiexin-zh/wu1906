<template>
	<view class="content">
		<no-data v-if="noDataTag" msg="请绑定学生"></no-data>
		<view v-else>
			<u-navbar :is-back="false" v-if="showDropdown">
				<ms-dropdown-menu><ms-dropdown-item :title="userName" v-model="userCode" :list="childList"></ms-dropdown-item></ms-dropdown-menu>
			</u-navbar>
			<u-navbar :is-back="false" v-else :title="userName"></u-navbar>
			<scroll-view scroll-y="true" :scrollTop="scrollTop" @scrolltoupper="showMore" :class="showFunBtn ? 'scroll-y' : 'scroll-h'">
				<view class="content-box u-bg-color" @touchstart="touchstart">
					<view class="message u-padd-l20 u-padd-r20 u-padd-t10 u-padd-b10" v-for="(item, index) in messageList" :key="index" :id="`msg-${item.hasBeenSentId}`">
						<view class="time u-mar-b10 u-font-02 u-tips-color">{{ item.createTime | gmtToDate }}</view>
						<view class="message-item u-fx" :class="item.isItMe ? 'right' : 'left'">
							<image class="img u-border-radius" :src="item.fromUserHeadImg || '/mobile-img/Default_touxiang@2x.png'" mode=""></image>
							<!-- contentType = 1 文本 -->
							<view class="content u-padd-20 u-border-radius" v-if="item.contentType == 1">{{ item.content }}</view>
							<!-- contentType = 2 视频 -->
							<video v-if="item.contentType == 2" class="content contentType2 u-padd-r20" :src="item.content" controls enable-play-gesture object-fit="contain"></video>
							<!-- contentType = 3 图片 -->
							<view class="content contentType3 u-padd-0" v-if="item.contentType == 3" @tap="viewImg([item.content])">
								<image :src="item.content" class="img" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 底部聊天输入框 -->
			<view class="input-box">
				<view class="input-box-flex u-fx-ac u-flex-nowrap u-padd-20">
					<view class="input-box-flex-grow u-fx-f1 u-bg-fff u-border-radius-big">
						<input
							type="text"
							class="content u-bg-fff u-padd-l20 u-padd-r20 u-border-radius-big"
							id="input"
							v-model="message"
							:confirm-type="'send'"
							:confirm-hold="true"
							placeholder-style="color:#DDD;"
							:cursor-spacing="6"
							:maxlength="100"
							@focus="focusInput"
							@blur="blurInput"
							@confirm="sendMsg(null)"
						/>
					</view>
					<view class="icon-size u-fx-jc"><u-icon class="icon_btn_add u-mar-l20" name="plus-circle" @tap="switchFun"></u-icon></view>
					<button class="btn u-mar-l20" type="primary" size="mini" @touchend.prevent="sendMsg(null)">发送</button>
				</view>
				<view class="fun-box" :class="{ 'show-fun-box': showFunBtn }">
					<u-grid :col="4" :border="false" @click="clickGrid">
						<u-grid-item v-for="(item, index) in funList" :index="index" :key="index" bg-color="#eaeaea">
							<view class="icon-size u-fx-jc"><u-icon :name="item.icon"></u-icon></view>
							<view class="grid-text u-padd-t10">{{ item.title }}</view>
						</u-grid-item>
					</u-grid>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import wxApi from '@u/wxApi'
import hostEnv from '../../../config/index.js';
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
import eventBus from '@u/eventBus';
import { store, actions } from './store/index.js';
export default {
	name: 'ClassMessage-p',
	components: {
		msDropdownMenu,
		msDropdownItem
	},
	data() {
		return {
			wxApi,
			noDataTag: false,
			timer: null,
			showDropdown: false,
			childList: [],
			pageList: {
				page: 1,
				size: 20
			},
			morePage: false,
			userCode: '',
			userName: '',
			classCode: '',
			childPhoto: '',
			schoolYearId: '',
			messageList: [],
			loading: true,
			scrollTop: 0,
			showFunBtn: false, //是否展示功能型按钮
			message: '',
			//上传的图片地址
			uploadImages: [],
			//展示的图片地址
			uploads: [],
			// 超出限制数组
			exceeded_list: [],
			funList: [
				{
					title: '图片',
					icon: 'photo-fill'
				},
				{
					title: '视频',
					icon: 'camera-fill'
				}
			]
		};
	},
	watch: {
		userCode(val, oldval) {
			if (val !== oldval) {
				this.userCode = val;
				let arr = this.childList.filter(el => {
					return el.userCode === val;
				});
				this.userName = arr[0].userName;
				this.classCode = arr[0].classCode;
				this.className = arr[0].className;
				this.childPhoto = arr[0].photoUrl;
				this.messageList = [];
				this.pageList.page = 1;
				this.getMessageData();
			}
		}
	},
	async created() {
		if (!store.childList || store.childList.length === 0) {
			this.noDataTag = true;
			return;
		}
		this.userCode = store.childList[0].userCode;
		this.userName = store.childList[0].userName;
		this.className = store.childList[0].gradeName + store.childList[0].className;
		this.classCode = store.childList[0].classCode;
		this.childPhoto = store.childList[0].photoUrl;
		this.schoolYearId = store.schoolYear.schoolYearId;
		store.childList.forEach(ele => {
			this.childList.push({
				...ele,
				text: ele.userName,
				value: ele.userCode,
				classCode: ele.classCode,
				className: ele.gradeName + ele.className,
				photoUrl: ele.photoUrl
			});
		});
		if (this.childList.length > 1) {
			this.showDropdown = true;
		}
	},
	mounted() {},
	methods: {
		//触摸屏幕的时候隐藏键盘
		touchstart() {
			uni.hideKeyboard();
		},
		focusInput() {
			this.showFunBtn = false;
			this.$nextTick(() => {
				this.scrollTop = 9999;
			});
		},
		blurInput() {
			uni.hideKeyboard();
		},
		//切换功能性按钮
		switchFun() {
			this.showFunBtn = !this.showFunBtn;
			uni.hideKeyboard();
		},
		//点击宫格时触发
		clickGrid(index) {
			if (index == 0) {
				this.chooseUploads('image');
			} else if (index == 1) {
				this.chooseUploads('video');
			}
		},
		//发送图片、视频
		chooseUploads(type) {
			switch (type) {
				case 'image':
					this.wxApi.wxChoosePhoto(res => {
						this.sendMsg({
							contentType: 3,
							content: res.url
						});
					});
					break;
				case 'video':
					uni.chooseVideo({
						sourceType: ['camera', 'album'],
						maxDuration: 60,
						success: res => {
							console.log(res);
							uni.showLoading({
								title: '发送中'
							});
							if (Math.ceil(res.size / 1024) < 200 * 1024) {
								this.$tools.ossUpload(store.userInfo.schoolCode, res.tempFilePath, 'mp4', res => {
									console.log(res.data.url); // 直接返回路径
									if (res.code === 200) {
										this.sendMsg({
											contentType: 2,
											content: res.data.url
										});
									} else {
										this.$tools.toast(res.data);
									}
								});
								/* uni.uploadFile({
									url: `${hostEnv.protal_api_11009}/chat/record/sendMediaFilesMess`,
									filePath: res.tempFilePath,
									name: 'fileList',
									formData: {
										classCode: this.classCode,
										className: this.className,
										receiverCode: this.userCode,
										receiverName: this.userName,
										schoolCode: store.userInfo.schoolCode,
										schoolYearId: this.schoolYearId,
										senderCode: store.userInfo.userCode,
										senderName: store.userInfo.userName,
										type: 2,
										userPhoto: store.userInfo.photoUrl
									},
									success: uploadFileRes => {
										uni.hideLoading();
										this.getMessageData();
									},
									fail: res => {
										uni.hideLoading();
										uni.showModal({
											title: '提示',
											content: `发送失败`
										});
									}
								}); */
							} else {
								uni.hideLoading();
								uni.showToast({
									title: '视频超出限制,限制大小为200MB内',
									icon: 'none'
								});
							}
						},
						fail: err => {
							uni.showModal({
								content: JSON.stringify(err)
							});
						}
					});
					break;
			}
		},
		//查看大图
		viewImg(imgList) {
			uni.previewImage({
				urls: imgList
			});
		},
		//发送消息
		async sendMsg(data) {
			const params = {
				hasBeenSentId: Date.now(), //已发送过去消息的id
				content: this.message,
				fromUserHeadImg: store.userInfo.photoUrl, //用户头像
				fromUserId: store.userInfo.userCode,
				isItMe: true, //true此条信息是我发送的  false别人发送的
				createTime: Date.now(),
				contentType: 1
			};

			if (data) {
				//说明是发送视频或图片
				params.content = data.content;
				params.contentType = data.contentType;
			} else if (!this.$u.trim(this.message)) {
				//验证输入框是否为空字符
				return;
			}
			const req = {
				classCode: this.classCode,
				className: this.className,
				receiverCode: this.userCode,
				receiverName: this.userName,
				schoolCode: store.userInfo.schoolCode,
				schoolYearId: this.schoolYearId,
				senderCode: store.userInfo.userCode,
				senderName: store.userInfo.userName,
				type: params.contentType,
				userPhoto: store.userInfo.photoUrl,
				content: params.content
			};
			await actions.sendMessage(req);
			uni.hideKeyboard();
			this.$tools.toast('发送成功', 'success');
			this.$nextTick(() => {
				this.message = '';
				this.getMessageData();
			});
		},
		//获取消息
		async getMessageData(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				receiverCode: this.userCode,
				senderCode: store.userInfo.userCode,
				...this.pageList
			};
			const res = await actions.getMessageList(req);
			console.log(res.data);
			if (!res.data || res.data.list.length === 0) {
				return;
			}
			this.morePage = res.data.hasNextPage;
			let arr = [];
			res.data.list.forEach(ele => {
				arr.unshift({
					hasBeenSentId: ele.id,
					content: ele.content,
					fromUserHeadImg: store.userInfo.userCode === ele.senderCode ? store.userInfo.photoUrl : this.childPhoto,
					fromUserId: store.userInfo.userCode === ele.senderCode ? ele.receiverCode : ele.senderCode,
					isItMe: store.userInfo.userCode === ele.senderCode,
					createTime: ele.createTime,
					contentType: ele.type
				});
			});
			if (tag) {
				this.messageList = arr.concat(this.messageList);
			} else {
				this.messageList = arr;
				this.$nextTick(() => {
					this.scrollTop = 9999;
				});
			}
		},
		showMore() {
			console.log(this.morePage);
			if (!this.morePage) {
				return;
			}
			this.getMessageData(true);
		}
	}
};
</script>

<style lang="scss" scoped>
.dropdown-menu {
	width: 100%;
}
.scroll-h {
	height: calc(100vh - 200rpx);
}
.scroll-y {
	height: calc(100vh - 530rpx);
}
.content {
	&-box {
		width: 100%;
		height: auto;
		position: relative;
		min-height: calc(100vh - env(safe-area-inset-top) - 200rpx);
		transition: all 0.1s ease-in-out;
		.time {
			text-align: center;
		}
		.message-item {
			.img {
				width: 80rpx;
				height: 80rpx;
			}
			.content {
				max-width: 500rpx;
			}
			//视频
			.contentType2 {
				max-width: 650rpx;
				max-height: 450rpx;
			}
			//图片
			.contentType3 {
				background-color: transparent !important;
				.img {
					width: 200rpx;
					height: 300rpx;
					max-width: 300rpx;
					max-height: 400rpx;
				}
			}
			.contentType3::after {
				border: none !important;
				display: none !important;
			}
			&.right {
				flex-direction: row-reverse;
				.content {
					background-color: $uni-color-success;
					margin-right: 28rpx;
					word-break: break-all;
					line-height: 36rpx;
					position: relative;
					&::after {
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 10rpx solid transparent;
						border-bottom: 10rpx solid transparent;
						border-left: 16rpx solid $uni-color-success;
						position: absolute;
						right: -16rpx;
						top: 30rpx;
					}
				}
			}
			&.left {
				.content {
					background-color: $uni-text-color-inverse;
					margin-left: 28rpx;
					word-break: break-all;
					line-height: 36rpx;
					position: relative;
					&::after {
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 10rpx solid transparent;
						border-bottom: 10rpx solid transparent;
						border-right: 16rpx solid $uni-text-color-inverse;
						position: absolute;
						left: -16rpx;
						top: 30rpx;
					}
				}
			}
		}
	}
	&-showfn {
	}
	.input-box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 999;
		background-color: #eaeaea;
		padding-top: 0;
		&-flex {
			image {
				width: 56rpx;
				height: 56rpx;
			}
			&-grow {
				.content {
					height: 80rpx;
					caret-color: $uni-color-success;
				}
			}
			.btn {
				background-color: $u-type-success;
			}
		}
		.icon-size {
			font-size: 26px;
		}
		.fun-box {
			opacity: 0;
			transition: all 0.1s ease-in-out;
			height: 0;
			.grid-text {
				color: $uni-text-color-grey;
			}
		}
		.show-fun-box {
			opacity: 1;
			height: 300rpx;
		}
	}
}
</style>
