<template>
	<view class="u-page u-fx-f1">
		<view v-if="userInfo.typeCode === '16'" class="u-fx-ac u-mar-b10 u-border-radius u-padd-40 child-list u-bd-b u-content-color u-bg-fff" style="background: url('/mobile-img/intro-background.png') no-repeat; backgroundSize: contain">
			<image class="img u-border-radius" :src="childInfo.photoUrl" alt="" />
			<view class="u-fx-f1 u-line3 u-mar-l20">
				<view class="u-type-white">{{ childInfo.userName }}</view>
				<view class="u-font-01 u-type-white" v-if="isHightSchool">{{ childInfo.gradeName }}{{ childInfo.subjectName }}{{ childInfo.className }}</view>
				<view class="u-font-01 u-type-white" v-else>{{ childInfo.gradeName }}{{ childInfo.className }}</view>
				<view class="u-font-01 u-type-white">{{ childInfo.workNo || '' }}</view>
			</view>
			<view class="unbind-btn u-fx-ac-jc" @tap="_unbind(childInfo.userCode)">
				解绑
			</view>
		</view>
		<view v-if="type === '0'" class="u-bg-fff">
			<no-data v-if="noDataTag" msg="暂无数据~"></no-data>
			<view v-else class="">
				<view class="u-fx-ac">
					<image class="line u-mar-l20 mar-t20" src="http://canpointtest.com/mobile-img/line.png"></image>
					<text class="mar-t20 mar-l20 u-font-01 u-bold">个人风采：</text>
				</view>
				<view class="wrap u-padd-20">
					<no-data v-if="list.length === 0" msg="暂无图片~"></no-data>
					<u-swiper v-else title height="400" img-mode="aspectFit" :list="list" @click="previewImage"></u-swiper>
				</view>
				<view class="u-fx-ac u-mar-20">
					<image class="line" src="http://canpointtest.com/mobile-img/line.png"></image>
					<text class="mar-l20 u-font-01 u-bold">个人简介：</text>
				</view>
				<view class="u-bg-fff">
					<scroll-view scroll-y="true" :class="userInfo.typeCode === '16' ? 'scroll-h-0' : 'scroll-h'">
						<view class="u-padd-l20 u-padd-r20">
							<view class="content">{{ introduction }}</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="float-edit-btn" @click="btnClick"></view>
		</view>
		<view v-else class="">
			<scroll-view scroll-y="true" :class="userInfo.typeCode === '16' ? 'scroll-h-1' : 'scroll-h-2'">
				<view class="u-bg-fff u-mar-b20">
					<view class="u-mar-b20 u-mar-l20 u-padd-t20 u-fx-ac">
						<image class="line" src="http://canpointtest.com/mobile-img/line.png"></image>
						<text class="mar-l20">个人简介：</text>
					</view>
					<view class="input u-mar-l20 u-mar-r20">
						<textarea
							class="u-font-01 u-padd-b20"
							v-model="introduction"
							maxlength="500"
							:placeholder="
								userInfo.typeCode === '4' ? '请在此处描述个人事迹、教学理念、获奖经历等(必填)......' : '请在此处描述孩子基本信息、学习情况、主要获奖、兴趣特长等(必填)......'
							"
						/>
						<text class="length u-font-01 u-tips-color">{{ length }}/500</text>
					</view>
				</view>
				<view class="u-bg-fff">
					<view class="u-mar-b20 u-mar-l20 u-padd-t20 u-fx-ac">
						<image class="line" src="http://canpointtest.com/mobile-img/line.png"></image>
						<text class="mar-l20">个人风采：</text>
					</view>
					<view class="u-padd-b20">
						<video-upload
							class="u-fx-f1 u-padd-l20 u-padd-r10 u-padd-b20"
							:schoolCode="userInfo.schoolCode"
							types="image"
							v-model="photoList"
							:uploadCount="9"
							:upload_max="10"
						></video-upload>
						<text class="u-mar-l20 u-font-02 u-tips-color">上传图片(选填，最多支持上传9张图片)</text>
					</view>
				</view>
			</scroll-view>
			<view class="footer-btn u-fx-ac"><u-button @click="confirm" type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg">提交</u-button></view>
		</view>
	</view>
</template>

<script>
import chooseChild from '@/components/choose-child/choose-child.vue';
import eventBus from '@u/eventBus'
import noData from '@/components/no-data/no-data.vue';
import { store, actions } from './store/index.js';
export default {
	name: 'school-intro',
	components: {
		chooseChild,
		noData
	},
	computed: {
		userInfo: () => store.userInfo,
		childList: () => store.childList,
		list() {
			return this.photoList.map(ele => {
				return {
					image: ele.url
				};
			});
		}
	},
	data() {
		return {
			type: '',
			isHightSchool: false,
			noDataTag: false,
			showDropdown: false,
			dataInfo: {},
			introduction: '',
			photoList: [],
			childInfo: {},
			length: 0,
			childCode: '',
			childName: '',
			style: ''
		};
	},
	watch: {
		introduction(val) {
			this.length = val.length;
		},
		childCode(val, oldval) {
			if (val !== oldval) {
				this.childCode = val;
				let arr = this.childList.filter(el => {
					return el.value === val;
				});
				this.childName = arr[0].text;
				this.showIntro();
			}
		}
	},
	async created() {
		this.isHightSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9'
		this.type = this.$tools.getQuery().get('type');
		if (this.userInfo.typeCode === '16') {
			this.index = this.$tools.getQuery().get('index');
			this.childInfo = this.childList[this.index]
		}
		this.showIntro();
	},
	methods: {
		previewImage(index) {
			uni.previewImage({
				current: index,
				urls: this.list.map(el => {
					return el.image;
				})
			});
		},
		btnClick(){
			console.log(123)
			this.type = '1'
		},
		// 解绑孩子
		_unbind (childCode) {
			this.$tools.confirm('确定解绑吗?', async () => {
				await actions.unbindChild({
					childCode,
					parentCode: this.userInfo.userCode
				})
				this.childList.splice(this.index, 1)
				this.$tools.toast('解绑成功', 1)
				this.$tools.goNext(() => {
					eventBus.$emit('getChild')
					this.$tools.goBack()
				})
			})
		},
		async showIntro() {
			const res = await actions.getIntro({
				schoolCode: this.userInfo.schoolCode,
				userCode: this.userInfo.typeCode === '4' ? this.userInfo.userCode : this.childInfo.userCode,
				userType: this.userInfo.typeCode === '4' ? this.userInfo.typeCode : '8'
			});
			if (!res.data || res.data.introduction === '') {
				this.introduction = ''
				this.photoList = []
				this.noDataTag = true;
				return;
			}
			this.introduction = res.data.introduction;
			if (res.data.outUserStyleDtoList.length === 0) {
				return;
			}
			this.photoList = res.data.outUserStyleDtoList.map(el => {
				return {
					url: el.photoUrl,
					photoId: el.id,
					photoDes: el.photoDes === '' ? '添加描述' : el.photoDes
				};
			});
		},
		confirm() {
			console.log(this.photoList);
			if (this.introduction === '') {
				this.$tools.toast('请输入个人简介');
				return;
			}
			const req = {
				introduction: this.introduction,
				schoolCode: this.userInfo.schoolCode,
				userCode: this.userInfo.typeCode === '4' ? this.userInfo.userCode : this.childInfo.userCode,
				userType: this.userInfo.typeCode === '4' ? this.userInfo.typeCode : '8'
			};
			if (this.photoList.length > 0) {
				req.inUserStyleDtoList = this.photoList.map(el => {
					return {
						id: el.photoId,
						photoDes: el.photoDes === '添加描述' ? '' : el.photoDes,
						photoUrl: el.url
					};
				});
			}
			actions.editIntro(req).then(() => {
				this.$tools.toast('编辑成功', 'success');
				this.$tools.goNext(() => {
					// this.$tools.goBack();
					this.noDataTag = false;
					this.$tools.goNext(() => {
						this.type = '0'
						this.showIntro()
					})
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 568rpx);
}
.scroll-h-0 {
	height: calc(100vh - 810rpx);
}
.scroll-h-1 {
	height: calc(100vh - 340rpx);
}
.scroll-h-2 {
	height: calc(100vh - 100rpx);
}
.dropdown-menu {
	width: 100%;
}
.line {
	width: 4rpx;
	height: 28rpx;
}
.input {
	position: relative;
	height: 430rpx;
	.length {
		position: absolute;
		right: 0rpx;
		bottom: 10rpx;
	}
}
/deep/ uni-textarea {
	width: 100%;
	height: 410rpx;
}
/deep/ .uni-textarea-textarea {
	height: 400rpx;
	line-height: 40rpx;
}
.content {
	text-indent: 2em;
	text-indent: 40rpx;
}
.child-list {
	height: 230rpx;
	.img {
		width: 140rpx;
		height: 150rpx;
		display: block;
		background-color: #eee;
	}
	.unbind-btn {
		width: 100rpx;
		height: 50rpx;
		background-color: $u-type-white;
		color: $u-type-primary;
		border-radius: 60rpx;
	}
}
.footer-fixed{
	position: fixed;
	bottom: 0;
	width: 100%;
}
.wrap{
	height: 440rpx;
}
</style>
