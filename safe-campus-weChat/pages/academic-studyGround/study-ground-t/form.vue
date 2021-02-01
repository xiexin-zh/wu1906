<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">资源名称：</view>
				<view class="u-fx-f1 mar-r20"><input class="item-input" maxlength="20" v-model="name" style="text-align: right;"
					 placeholder="" /></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view class="tip">资源发布：</view>
				<view class="u-fx-f1 u-fx-ver">
					<view>
						<u-checkbox shape="square" class="radio-mar" v-model="allSchool" @change="changeAll">全校</u-checkbox>
						<u-checkbox shape="square" class="radio-mar" v-model="isClass" @change="changeClass">指定班级</u-checkbox>
					</view>
					<u-checkbox-group>
						<u-checkbox shape="square" class="radio-mar" v-model="isTeacher">指定教师</u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
			<view v-if="isClass" class="">
				<view class="u-fx item-list u-padd-b0">
					<view class="tip">选择班级：</view>
					<view class="u-fx-f1 u-fx-je u-content-color u-font-01" @click="classTag = true"></view>
					<view class="rit-icon"></view>
				</view>
				<view v-if="classList.length > 0" class="u-fx-wp u-bd-b u-bg-fff u-padd-20 u-padd-t0">
					<u-tag class="u-mar-10" size="mini" type="primary" :text="isHighSchool ? (item.gradeName + item.subjectName + item.className) : (item.gradeName + item.className)"
					 v-for="(item, i) in classList" :key="item.classCode" :index="i" />
				</view>
			</view>
			<view v-if="isTeacher" class="">
				<view class="u-fx item-list u-padd-b0">
					<view class="tip">选择教师：</view>
					<view class="u-fx-f1 u-fx-je u-content-color u-font-01" @click="teacherTag = true"></view>
					<view class="rit-icon"></view>
				</view>
				<view v-if="teacherList.length > 0" class="u-fx-wp u-bd-b u-bg-fff u-padd-20 u-padd-t0">
					<u-tag class="u-mar-10" size="mini" type="primary" isClear :text="item.userName" v-for="(item, i) in teacherList"
					 :key="item.userCode" :index="i" />
				</view>
			</view>
			<view class="u-fx-ac item-list">
				<view class="tip">复用资源：</view>
			</view>
			<view class="item-list u-bd-b u-padd-t0">
				<u-checkbox-group @change="checkBox">
					<u-checkbox class="check-box u-padd-b20" v-model="item.checked" v-for="(item, index) in fileList" :key="index"
					 :name="item.id">{{ item.resName }}</u-checkbox>
				</u-checkbox-group>
			</view>
		</scroll-view>
		<view class="footer-btn u-fx-ac">
			<u-button @click="confirm" type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg">提交</u-button>
		</view>
		<class-tree ref="classTree" isCheck v-show="classTag" :isHighSchool="isHighSchool" :isHighSchoolData="isHighSchool"
		 :classTag="classTag" :schoolInfo="schoolInfo" @close="classClose" @confirm="classSelcet"></class-tree>
		<teacher-tree ref="teacherTree" isCheck v-show="teacherTag" :teacherTag="teacherTag" :schoolInfo="schoolInfo" @close="teacherClose"
		 @confirm="teacherSelcet"></teacher-tree>
	</view>
</template>

<script>
	import eventBus from '@u/eventBus';
	import classTree from '@/components/class-tree/class-tree';
	import teacherTree from '@/components/teacher-tree/teacher-tree';
	import {
		store,
		actions
	} from '../store/index.js';
	export default {
		components: {
			classTree,
			teacherTree
		},
		data() {
			return {
				isHighSchool: false,
				classTag: false,
				teacherTag: false,
				id: '',
				typeList: [{
						key: 1,
						label: '全校',
						checked: false
					},
					{
						key: 2,
						label: '指定班级',
						checked: false
					}
				],
				schoolInfo: {},
				name: '',
				currentKey: [0],
				classList: [],
				teacherList: [],
				fileList: [],
				checkList: [],
				isClass: false,
				isTeacher: false,
				allSchool: false
			};
		},
		computed: {},
		created() {
			this.id = this.$tools.getQuery().get('id');
			this.isHighSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9'
			this.schoolInfo.schoolCode = store.userInfo.schoolCode;
			this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId;
			this.getSchoolYearId()
			this.showData();
		},
		async mounted() {},
		methods: {
			async getSchoolYearId() {
				const req = {
					schoolCode: store.userInfo.schoolCode
				}
				const res = await actions.getSchoolYear(req)
				this.schoolYearId = res.data.list[0].id
			},
			changeAll(val) {
				if (val.value) {
					this.isClass = false
				}
			},
			changeClass(val) {
				if (val.value) {
					this.allSchool = false
				}
			},
			checkBox(e) {
				this.checkList = e;
			},
			classSelcet(value) {
				console.log(value)
				this.classTag = false;
				// const classList = []
				// value.forEach(el => {
				// 	el.children.forEach(item => {
				// 		const obj = {
				// 			...el,
				// 			className: item.className,
				// 			classCode: item.classCode
				// 		}
				// 		classList.push(obj)
				// 	})
				// })
				// console.log(classList)
				this.classList = value
			},
			teacherSelcet(value) {
				this.teacherTag = false
				this.teacherList = value
			},
			classClose() {
				this.classTag = false;
			},
			teacherClose() {
				this.teacherTag = false
			},
			async showData() {
				const res = await actions.detailStudy({
					id: this.id
				});
				this.name = res.data.gardenName;
				this.fileList = res.data.resourceList.map(item => {
					return {
						...item,
						checked: false
					}
				});
			},
			async confirm() {
				if (this.name === '') {
					this.$tools.toast('请输入资源名称');
					return;
				}
				if (!this.allSchool && !this.isClass && !this.isTeacher) {
					this.$tools.toast('请选择复用资源');
					return;
				}
				if (!this.allSchool && this.classList.length === 0 && this.isClass) {
					this.$tools.toast('请选择班级');
					return;
				}
				if (!this.allSchool && this.teacherList.length === 0 && this.isTeacher) {
					this.$tools.toast('请选择教师');
					return;
				}
				const resourceList = this.fileList.filter(item => item.checked)
				if (resourceList.length === 0) {
					this.$tools.toast('请选择复用资源');
					return
				}
				const classList = this.classList.map(item => {
					return {
						classCode: item.classCode,
						className: `${item.gradeName}-${item.subjectName}-${item.className}`,
						gradeCode: item.gradeCode,
						majorCode: item.subjectCode,
						classId: item.classId
					}
				})
				const teacherList = this.teacherList.map(item => {
					return {
						teacherCode: item.userCode,
						teacherName: item.userName
					}
				})
				const req = {
					classList,
					teacherList,
					resourceList,
					gardenName: this.name,
					createUserCode: store.userInfo.userCode,
					ownerName: store.userInfo.userName,
					createUserName: store.userInfo.userName,
					schoolYearId: this.schoolYearId,
					hasTotalSchool: this.allSchool,
					schoolCode: store.userInfo.schoolCode
				};
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
