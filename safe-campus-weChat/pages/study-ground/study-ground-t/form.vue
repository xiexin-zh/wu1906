<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">资源名称：</view>
				<view class="u-fx-f1 mar-r20"><input class="item-input" maxlength="20" v-model="name" style="text-align: right;" placeholder="" /></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">资源发布：</view>
				<view class="u-fx-f1 u-fx-je">
					<u-radio-group v-model="currentKey" @change="tabChange">
						<u-radio shape="circle" class="radio-mar" v-for="(item, index) in typeList" :key="index" :name="item.key">{{ item.label }}</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view v-if="currentKey === 1" class="">
				<view class="u-fx item-list u-padd-b0">
					<view class="tip">选择班级：</view>
					<view class="u-fx-f1 u-fx-je u-content-color u-font-01" @click="classTag = true"></view>
					<view class="rit-icon"></view>
				</view>
				<view v-if="classList.length > 0" class="u-fx-wp u-bd-b u-bg-fff u-padd-20 u-padd-t0">
					<u-tag class="u-mar-10" size="mini" type="primary" :text="isHighSchool ? (item.gradeName + item.subjectName + item.className) : (item.gradeName + item.className)" v-for="(item, i) in classList" :key="item.classCode" :index="i" />
				</view>
			</view>
			<view class="u-fx-ac item-list"><view class="tip">复用资源：</view></view>
			<view class="item-list u-bd-b u-padd-t0">
				<u-checkbox-group @change="checkBox">
					<u-checkbox class="check-box u-padd-b20" v-model="item.checked" v-for="(item, index) in fileList" :key="index" :name="item.id">{{ item.fileName }}</u-checkbox>
				</u-checkbox-group>
			</view>
		</scroll-view>
		<view class="footer-btn u-fx-ac"><u-button @click="confirm" type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg">提交</u-button></view>
		<class-tree ref="classTree" isCheck v-show="classTag" :isHighSchool="isHighSchool" :classTag="classTag" :schoolInfo="schoolInfo" @close="classClose" @confirm="classSelcet"></class-tree>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import classTree from '@/components/class-tree/class-tree';
import { store, actions } from '../store/index.js';
export default {
	components: {
		classTree
	},
	data() {
		return {
			isHighSchool: false,
			classTag: false,
			id: '',
			typeList: [
				{
					key: 0,
					label: '全部'
				},
				{
					key: 1,
					label: '指定班级'
				}
			],
			schoolInfo: {},
			name: '',
			currentKey: 0,
			classList: [],
			fileList: [],
			checkList: []
		};
	},
	computed: {},
	created() {
		this.id = this.$tools.getQuery().get('id');
		this.isHighSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9'
		this.schoolInfo.schoolCode = store.userInfo.schoolCode;
		this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId;
		this.showData();
	},
	async mounted() {},
	methods: {
		tabChange() {},
		checkBox(e) {
			console.log(e);
			this.checkList = e;
		},
		classSelcet(value) {
			this.classTag = false;
			this.classList = value;
			console.log(value);
		},
		classClose() {
			this.classTag = false;
		},
		async showData() {
			const res = await actions.detailStudy(this.id);
			this.name = res.data.name;
			this.fileList = res.data.fileList;
		},
		async confirm() {
			if (this.name === '') {
				this.$tools.toast('请输入资源名称');
				return;
			}
			if (this.checkList.length === 0) {
				this.$tools.toast('请选择复用资源');
				return;
			}
			if (this.currentKey === 1 && this.classList.length === 0) {
				this.$tools.toast('请选择指定班级');
				return;
			}
			const req = {
				classList: this.currentKey === 1 ? this.classList.map(el => {
					return {
						...el,
						schoolYearId: store.schoolYear.schoolYearId,
						id: undefined
					}
				}) : undefined,
				name: this.name,
				repeat: 'Y',
				ownerCode: store.userInfo.userCode,
				ownerName: store.userInfo.userName,
				schoolCode: store.userInfo.schoolCode,
				schoolGradeCode: this.currentKey === 1 ? undefined : '00',
				fileAddIdList: this.checkList
			};
			console.log(req);
			const res = await actions.addNewStudy(req);
			this.$tools.toast('发布成功', 'success');
			this.$tools.goNext(() => {
				eventBus.$emit('getList');
				this.$tools.goBack();
			});
		}
	}
};
</script>

<style lang="scss">
.scroll-h {
	height: calc(100vh - 100rpx);
}
.tip::before {
	position: absolute;
	content: '*';
	color: red;
	left: 10rpx;
	width: 10rpx;
	height: 10rpx;
}
.item-list {
	padding: 25rpx 10rpx 25rpx 30rpx;
	background: $uni-bg-color;
}
.item-input {
	width: 100%;
	font-size: 26rpx;
}
.al-r {
	text-align: right;
}
.radio-mar {
	padding-left: 35rpx;
}
.u-padd-t0 {
	padding-top: 0;
}
.check-box {
	width: 100% !important;
}
</style>
