<template>
	<view class="">
		<choose-child v-if="userType === 3" @change="childInfo"></choose-child>
		<view class="dropdown u-bd-b">
			<ms-dropdown-menu v-if="userType !== 3 && showClass"><ms-dropdown-item v-model="value0" :list="classList" :title="defTitle"></ms-dropdown-item></ms-dropdown-menu>
		</view>
		<scroll-view scroll-y="true" :class="showClass ? 'scroll-h' : 'scroll'">
			<no-data v-if="fileList.length === 0 && userType !== 1" msg="暂无数据~"></no-data>
			<view class="u-auto">
				<view class="u-mar-t20" v-if="userType === 1">
					<video-upload
						class="u-fx-f1 u-padd-l20 u-padd-r20"
						:schoolCode="userInfo.schoolCode"
						types="image"
						v-model="fileList"
						:uploadCount="9"
						:upload_max="10"
						@success="success"
						@delImage="delImage"
					></video-upload>
				</view>
				<view class="u-fx-wp u-mar-t20 u-padd-l20 u-padd-r20" v-else>
					<view class="uplode-file" v-for="(item, index) in fileList" :key="index">
						<image class="uploade-img" :src="item.url" @tap="previewImage($event, index)"></image>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import chooseChild from '@/components/choose-child/choose-child.vue';
import eventBus from '@u/eventBus';
import noData from '@/components/no-data/no-data.vue';
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
import { store, actions } from './store/index.js';
import hostEnv from '../../config/index.js';
export default {
	name: 'class-newspaper',
	components: {
		msDropdownMenu,
		msDropdownItem,
		noData,
		chooseChild
	},
	data() {
		return {
			currentClass: uni.getStorageSync('currentClass') || 0,
			userType: 2, // 0.超管，1.班主任，2.教职工，3.家长
			value0: '',
			classList: [],
			defTitle: '',
			showClass: false,
			fileList: []
		};
	},
	computed: {
		userInfo: () => store.userInfo 
	},
	watch: {
		value0(val, oldval) {
			if (this.userType === 3) {
				return;
			}
			if (val !== oldval) {
				let choose = this.classList.filter(el => {
					return el.value === val;
				})[0];
				if ((store.isBZR && val === store.isBZR.classCode) || choose.isBZR) {
					this.userType = 1;
				} else {
					this.userType = 2;
				}
				this.defTitle = choose.text;
				this.gradeCode = choose.gradeCode;
				this.classCode = val;
				this.className = choose.className;
				this.gradeName = choose.gradeName;
				this.showList();
			}
		}
	},
	async created() {
		if (store.userInfo.typeCode === '4') {
			this.userType = 2;
			this.classList = JSON.parse(uni.getStorageSync('protal')).teachClassList;
			if (this.classList.length === 0) {
				this.$tools.toast('请绑定班级');
				return;
			}
			this.classCode = this.classList[this.currentClass].value;
			this.gradeCode = this.classList[this.currentClass].gradeCode;
			this.className = this.classList[this.currentClass].className;
			this.gradeName = this.classList[this.currentClass].gradeName;
			this.showClass = true;
			this.defTitle = this.classList[this.currentClass].text;
			this.value0 = this.classList[this.currentClass].value;
		} else if (store.userInfo.typeCode === '16') {
			this.userType = 3;
			this.classCode = store.childList[0].classCode;
			this.gradeCode = store.childList[0].gradeCode;
			this.showList();
		}
	},
	methods: {
		childInfo(item) {
			if (item.userCode !== this.userCode) {
				this.classCode = item.classCode;
				this.classId = item.classId;
				this.showList();
			}
		},
		async showList() {
			const req = {
				schoolCode: store.userInfo.schoolCode,
				schoolYearId: store.schoolYear.schoolYearId,
				classCode: this.classCode
			};
			const res = await actions.getNewspaperList(req);
			 this.fileList = res.data.map(el => {
        return {
          id: el.photoId,
          url: el.photoUrl,
          createTime: el.createTime,
          recordId: el.id
        }
      });
		},
		previewImage(e, index) {
			uni.previewImage({
				current: index,
				urls: this.fileList.map(el => {
					return el.url;
				})
			});
		},
		async success(e) {
			console.log(e);
			this.photoId = e.id;
			const req = {
				schoolCode: store.userInfo.schoolCode,
				schoolYearId: store.schoolYear.schoolYearId,
				classCode: this.classCode,
				gradeCode: this.gradeCode,
				className: this.className,
				gradeName: this.gradeName,
				createUsercode: store.userInfo.userCode,
				createUsername: store.userInfo.userName,
				photoUrl: e.url,
				photoId: e.id
			}
			await actions.addNewspaper(req)
			this.$tools.toast('添加成功', 'success');
			this.$tools.goNext(() => {
				this.showList()
			});
		},
		async delImage(value) {
			console.log(value);
			// await actions.delFile(value.id);
			await actions.deleNewspaper(value.recordId)
			this.$tools.toast('删除成功', 'success');
			this.$tools.goNext(() => {
				this.showList()
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 80rpx);
}
.scroll {
	height: calc(100vh);
}
.dropdown {
	width: 100%;
}
.uplode-file {
	margin: 10rpx;
	width: calc(33.3% - 20rpx);
	height: 210rpx;
	position: relative;
}
.uploade-img {
	display: block;
	width: 100%;
	height: 210rpx;
}
</style>
