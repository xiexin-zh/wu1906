<template>
	<view class="detail-show u-padd-20 ">
		<u-popup v-model="videoTag" mode="center">
			<view class="pop-up u-padd-t10 u-padd-l10 u-padd-r10 u-border-radius">
				<video class="video u-border-radius" :src="videoUrl" controls enable-play-gesture object-fit="contain"></video>
			</view>
		</u-popup>
		<view class="detail-bg u-mar-b20">
			<view class="detail-info u-type-white">
				<view class="title u-fx-ac-jc u-font-3 u-bold">{{ studyInfo.gardenName }}</view>
				<view class="u-fx u-mar-20 u-font-02">
					<view class="u-fx-ac">
						<image src="http://canpointtest.com/mobile-img/study-ground-icon2.png" class="u-mar-r20 icon-32"></image>
						上传人：{{ studyInfo.createUserName }}
					</view>
				</view>
				<view class="u-fx u-mar-20 u-font-02">
					<view class="u-fx-ac">
						<image src="http://canpointtest.com/mobile-img/study-ground-icon1.png" class="u-mar-r20 icon-32"></image>
						上传时间：{{ studyInfo.createTime | gmtToDate('no-second') }}
					</view>
				</view>
			</view>
		</view>
		<view class="detail-file u-type-white-bg u-mar-b20 u-border-radius u-auto">
			<view class="file-title u-mar-t20 u-mar-l20 u-padd-l10 u-bold">资源列表</view>
			<view class="u-fx-ac u-bd-b item-list u-padd-20" v-for="(item, i) in studyInfo.resourceList" :key="item.id">
				<image src="http://canpointtest.com/mobile-img/study-ground-icon3.png" class="u-mar-r20 icon-32">
					</u-icon>
					<text class="file-name" @click="showFile(item.resFormat, item.resUrl)">{{ item.resName }}({{ item.resSize }})</text>
			</view>
		</view>
		<view v-if="type === 't' && (!studyInfo.hasTotalSchool && studyInfo.classList && studyInfo.classList.length > 0 || studyInfo.hasTotalSchool)"
		 class="detail-file u-type-white-bg u-border-radius u-auto">
			<view class="file-title u-mar-t20 u-mar-l20 u-padd-l10 u-bold">发布班级</view>
			<view class="u-fx-ac u-padd-20">
				<view v-if="studyInfo.hasTotalSchool" class="">
					<u-tag class="u-mar-b20 u-mar-r20" size="mini" type="primary" text="全校" />
				</view>
				<view v-else>
					<u-tag class="u-mar-b20 u-mar-r20" size="mini" type="primary" :text="item.className.replace(/-/g, '')" v-for="(item, i) in studyInfo.classList"
					 :key="item.classCode" :index="i" />
				</view>
			</view>
		</view>
		<view v-if="type === 't' && studyInfo.teacherList && studyInfo.teacherList.length > 0" class="detail-file u-type-white-bg u-border-radius u-auto">
			<view class="file-title u-mar-t20 u-mar-l20 u-padd-l10 u-bold">发布教师</view>
			<view class="u-fx-ac u-padd-20">
				<view>
					<u-tag class="u-mar-b20 u-mar-r20" size="mini" type="primary" :text="item.teacherName" v-for="(item, i) in studyInfo.teacherList"
					 :key="item.teacherCode" :index="i" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		store,
		actions
	} from '../store/index.js';
	export default {
		data() {
			return {
				id: '',
				isHighSchool: false,
				videoTag: false,
				officeTag: false,
				studyInfo: {},
				videoUrl: '',
				type: ''
			};
		},
		created() {
			this.isHighSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9'
			this.id = this.$tools.getQuery().get('id');
			this.type = this.$tools.getQuery().get('type');
			this.showData();
		},
		methods: {
			async showData() {
				const res = await actions.detailStudy({
					id: this.id
				});
				this.studyInfo = res.data;
			},
			showFile(type, url) {
				console.log(type, url)
				if ('jpeg|gif|jpg|png|bmp|pic|svg|'.toLowerCase().indexOf(type.toLowerCase()) !== -1) {
					uni.previewImage({
						urls: [url]
					});
					return;
				}
				if ('mp4|ogg|webm'.toLowerCase().indexOf(type.toLowerCase()) !== -1) {
					this.videoUrl = url;
					this.videoTag = true;
					return;
				}
				if ('doc|docx|xls|xlsx|pptx|ppt|pdf|txt|swf'.toLowerCase().indexOf(type.toLowerCase()) !== -1) {
					console.log(url);
					this.$tools.navTo({
						url: `./office?url=${url}&type=${type}`
					});
					//this.Download(type, url);
				}
			},
			Download(type, url) {
				let httpUrl =
					'/img-download/' +
					url
					.replace('http://', '')
					.split('/')
					.slice(1)
					.join('/');
				console.log(httpUrl);
				wx.downloadFile({
					url: httpUrl,
					success: res => {
						console.log(res);
						if (res.statusCode === 200) {
							var filePath = res.tempFilePath;
							wx.openDocument({
								filePath: filePath,
								fileType: type,
								success: function(res) {
									console.log('打开文档成功');
								}
							});
						}
					},
					fail: err => {
						console.log(err);
						uni.showToast({
							icon: 'none',
							mask: true,
							title: '打开失败'
						});
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.detail-show {
		.detail-bg {
			height: 360rpx;
			background: url(/mobile-img/study-ground-detailbg.png) no-repeat;
			background-size: 100% 360rpx;
		}

		.detail-info {
			padding: 80rpx 40rpx 0 40rpx;
		}

		.detail-file {
			margin-bottom: 10px;

			.file-title {
				border-left: 4rpx solid $uni-color-primary;
			}

			.file-name {
				width: calc(100% - 50rpx);
				word-break: break-all;
			}
		}
	}

	.pop-up {
		.video {
			max-width: 650rpx;
		}
	}

	.icon-32 {
		width: 32rpx;
		height: 32rpx;
	}
</style>
