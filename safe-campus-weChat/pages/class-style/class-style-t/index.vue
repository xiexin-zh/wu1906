<template>
	<view class="">
		<no-data v-if="noDataTag" msg="请先绑定班级~"></no-data>
		<view v-else class="">
			<tab-menu :data-list="tabList" @change="changeMenu"></tab-menu>
			<view class="dropdown u-fx-ac u-bd-b u-bd-t">
				<ms-dropdown-menu v-if="showClass"><ms-dropdown-item v-model="value0" :list="classList" :title="defTitle"></ms-dropdown-item></ms-dropdown-menu>
			</view>
			<view class="swiper-item" v-show="current === 0">
				<scroll-view :class="showClass ? 'class-style scroll-h' : 'class-style scroll-h-1'">
					<view class="class-card">
						<u-icon class="u-icon-38" name="calendar" color="#2979ff"></u-icon>
						<text class="mar-l20">班级格言：</text>
					</view>
					<view class="u-fx-ver">
						<view class="input" v-if="userType === '1'">
							<textarea :focus="true" @focus="edit" @blur="submit" v-model="classMotto" maxlength="30" />
							<!-- <text class="length">{{ length }}/30</text> -->
						</view>
						<view class="input motto" v-else>
							<text class="padd-l20 mar-l20 u-content-color">{{ classMotto }}</text>
						</view>
					</view>
					<view class="class-card">
						<u-icon class="u-icon-38" name="calendar" color="#2979ff"></u-icon>
						<text class="mar-l20">班级简介：</text>
					</view>
					<view class="u-fx-ver">
						<view class="input area" v-if="userType === '1'">
							<textarea :focus="true" @focus="edit" @blur="submit" v-model="classIntro" maxlength="200" />
							<!-- <text class="length">{{ length }}/30</text> -->
						</view>
						<view class="input motto area auto" v-else>
							<text class="padd-l20 mar-l20 u-content-color">{{ classIntro }}</text>
						</view>
					</view>
					<view class="class-card">
						<u-icon class="u-icon-38" name="calendar" color="#2979ff"></u-icon>
						<text class="mar-l20">班级全家福：</text>
					</view>
					<view class="u-fx-ver">
						<view v-if="userType === '1'" class="u-fx-f1">
							<video-upload
								class="u-fx-f1 u-padd-l40 u-padd-r10 u-padd-b20"
								types="image"
								:schoolCode="userInfo.schoolCode"
								v-model="photoList"
								:uploadCount="1"
								:upload_max="10"
								@success="success"
								@delImage="delImage"
							></video-upload>
						</view>
						<view v-else class="u-fx-f1 u-mar-l40"><image v-if="photoList.length > 0" class="class-image" :src="photoList[0].url" mode="" @tap="previewImage()"></image></view>
					</view>
				</scroll-view>
			</view>
			<view v-show="current === 1"><class-album ref="child" :showClass="showClass" :userType="userType"></class-album></view>
		</view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import noData from '@/components/no-data/no-data.vue';
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
import ClassAlbum from './component/ClassAlbum.vue';
import { store, actions } from './store/index.js';
import hostEnv from '../../../config/index.js';
export default {
	name: 'ClassStyle',
	components: {
		msDropdownMenu,
		msDropdownItem,
		ClassAlbum,
		noData
	},
	computed: {
		userInfo: () => store.userInfo,
		isBZR: () => JSON.parse(uni.getStorageSync('protal')).isBZR
	},
	data() {
		return {
			showClass: false,
			noDataTag: false,
			currentClass: uni.getStorageSync('currentClass') || 0,
			defTitle: '',
			pageList: {
				page: 1,
				size: 9999
			},
			showTag: false,
			current: 0,
			classMotto: '',
			classIntro: '',
			length: '0',
			tabList: [
				{
					name: '班级名片'
				},
				{
					name: '班级相册'
				}
			],
			morePage: false,
			albumList: [],
			userType: '0', //1班主任，0教职工
			classCode: '',
			gradeCode: '',
			schoolYearId: '',
			photoList: [],
			classList: [],
			value0: ''
		};
	},
	watch: {
		classMotto(val) {
			this.length = val.length;
		},
		value0(val, oldval) {
			if (val !== oldval) {
				let choose = this.classList.filter(el => {
					return el.value === val;
				})[0]
				this.defTitle = choose.text;
				this.classCode = val;
				if ((store.isBZR && val === store.isBZR.classCode) || choose.isBZR) {
					this.userType = '1';
				} else {
					this.userType = '2';
				}
				this.showMotto();
				this.$refs.child.showList(false, {
					classCode: val,
					schoolYearId: this.schoolYearId
				});
				eventBus.$on('getList', () => {
					console.log(this.$refs.child);
					this.$refs.child.showList(false, {
						classCode: val,
						schoolYearId: this.schoolYearId
					});
				});
			}
		}
	},
	async created() {
		this.classList = JSON.parse(uni.getStorageSync('protal')).teachClassList;
		console.log(this.classList);
		this.length = this.classMotto.length;
		this.schoolYearId = store.schoolYear.schoolYearId;
		if (store.userInfo.typeCode === '4') {
			this.userType = '0';
			if (this.classList.length === 0) {
				this.$tools.toast('请绑定班级');
				this.noDataTag = true;
				return;
			}
			this.classCode = this.classList[this.currentClass].value;
			this.gradeCode = this.classList[this.currentClass].gradeCode;
			if (this.classList.length > 1) {
				this.showClass = true;
			}
			this.defTitle = this.classList[this.currentClass].text;
			this.value0 = this.classList[this.currentClass].value;
			if (store.isBZR && this.classList[this.currentClass].value === store.isBZR.classCode) {
				this.userType = '1';
			} else {
				this.userType = '0';
			}
			console.log(this.userType);
			uni.setStorageSync('classInfo', {
				gradeCode: this.classList[this.currentClass].gradeCode,
				classCode: this.classList[this.currentClass].value,
				schoolYearId: this.schoolYearId
			});
		}
	},
	mounted() {},
	methods: {
		previewImage(e) {
			uni.previewImage({
				urls: this.photoList.map(el => {
					return el.url;
				})
			});
		},
		success(e) {
			this.submit();
		},
		delImage(value) {
			console.log(value);
			const index = this.photoList.findIndex(list => {
				return list === value.url;
			});
			this.photoList.splice(index, 1);
			// actions.delFile(value.id || this.photoList[0].id);
			this.submit();
		},
		changeMenu(item) {
			this.current = item;
		},
		edit() {
			this.showTag = true;
		},
		submit() {
			console.log(this.classMotto);
			if (this.classMotto === '') {
				this.$tools.toast('请输入班级格言');
				return;
			}
			if (this.classIntro === '') {
				this.$tools.toast('请输入班级简介');
				return;
			}
			this.showTag = false;
			const req = {
				classCode: this.classCode,
				motto: this.classMotto,
				introduce: this.classIntro,
				schoolCode: store.userInfo.schoolCode,
				schoolYearId: this.schoolYearId,
				photoUrl: ''
			};
			if (this.photoList.length > 0) {
				req.photoUrl = this.photoList[0].url;
				req.photoId = this.photoList[0].id;
			}
			actions.addClassMotto(req).then(() => {
				this.$tools.toast('编辑成功', 'success');
				this.$tools.goNext(() => {
					this.showMotto();
				});
			});
		},
		async showMotto() {
			const req = {
				schoolCode: store.userInfo.schoolCode,
				gradeCode: this.gradeCode,
				classCode: this.classCode,
				schoolYearId: this.schoolYearId
			};
			console.log(req);
			const res = await actions.getClassMotto(req);
			if (!res.data) {
				this.classMotto = '';
				this.classIntro = '';
				this.photoList = [];
				return;
			}
			this.classMotto = res.data.motto;
			this.classIntro = res.data.introduce;
			this.photoList = res.data.photoUrl ? [{ url: res.data.photoUrl, id: res.data.photoId }] : [];
		},
		goDetail(id) {
			this.$tools.navTo({
				url: './detail?id=' + id
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.class-style {
	background: url(http://canpointtest.com/mobile-img/background.png) no-repeat;
	background-size: 100% 100%;
}
.dropdown-menu {
	width: 100%;
}
.scroll-h {
	height: calc(100vh - 160rpx);
}
.scroll-h-1 {
	height: calc(100vh - 80rpx);
}
.class-card {
	margin: 40rpx 40rpx 20rpx 40rpx;
	font-size: 32rpx;
}
.input {
	margin: 0 20rpx;
	width: 98%;
	padding: 0rpx 0 0 60rpx;
	line-height: 56rpx;
	font-size: 32rpx;
	position: relative;
	height: 160rpx;
	.length {
		position: absolute;
		right: 11%;
		bottom: 10rpx;
	}
}
/deep/ uni-textarea {
	width: 90%;
}
/deep/ .uni-textarea-textarea {
	height: 160rpx;
	padding: 20rpx;
	line-height: 56rpx;
}
.area {
	height: 290rpx;
	/deep/ .uni-textarea-textarea {
		height: 290rpx;
		overflow: auto;
	}
}
.motto {
	width: 86%;
}
.auto {
	overflow: auto;
}
.u-icon-38 {
	font-size: 38rpx;
}
.class-image {
	width: 210rpx;
	height: 210rpx;
}
</style>
