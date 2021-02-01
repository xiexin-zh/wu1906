<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="u-fx-ac u-bd-b item-list u-bold">
				<view>{{ date }} 作业</view>
			</view>
			<view v-if="type === '0'" class="u-fx-ac u-bd-b item-list" @click="changeClass">
				<view class="tip">选择班级：</view>
				<view class="u-fx-f1 u-fx-je u-content-color">{{ formData.gradeClassName }}</view>
				<view class="rit-icon"></view>
			</view>
			<view v-else class="u-fx-ac u-bd-b item-list">
				<view>班级：</view>
				<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r20">{{ formData.gradeClassName }}</view>
			</view>
			<view v-if="type === '0'" class="u-fx-ac u-bd-b item-list" @click="changeSub">
				<view class="tip">选择学科：</view>
				<view class="u-fx-f1 u-fx-je u-content-color">{{ formData.subjectName }}</view>
				<view class="rit-icon"></view>
			</view>
			<view v-else class="u-fx-ac u-bd-b item-list">
				<view>学科：</view>
				<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r20">{{ formData.subjectName }}</view>
			</view>
			<view class="u-fx u-bd-b item-list input-area">
				<view :class="type === '0' ? 'tip' : ''">布置作业：</view>
				<view class="u-fx-f1 mar-r20"><textarea :disabled="type !== '0'" class="item-input u-content-color" maxlength="800" v-model="formData.content" placeholder="" /></view>
			</view>
			<view class="u-bd-b item-list" v-if="type === '0' || formData.attachList.length > 0">
				<view class="mar-b20">{{ type === '0' ? '上传图片：' : '图片：' }}</view>
				<view class="u-fx-f1">
					<view class="u-fx-f1"><an-upload-img :disabled="type !== '0'" total="9" v-model="formData.attachList" class="upload"></an-upload-img></view>
				</view>
			</view>
			<view v-if="type === '2'" class="">
				<view class="u-bd-b u-bg-fff u-padd-20">
					<u-alert-tips :show-icon="true" type="warning" description="提示：选择未交学生后，会通过班牌或家长手机提醒学生"></u-alert-tips>
				</view>
				<view class="u-fx item-list">
					<view class="tip">选择未交学生：</view>
					<view class="u-fx-f1 u-fx-je u-content-color u-font-01" @click="showPopTag = true">{{ noWorkstuLength }}</view>
					<view class="rit-icon"></view>
				</view>
				<view class="u-fx-wp u-bd-b u-bg-fff u-padd-20 u-padd-t0">
					<u-tag
						class="u-mar-10"
						size="mini"
						type="primary"
						:text="item.userName"
						:show="item.tag"
						v-for="(item, i) in formData.noWorkstu"
						:key="i"
						closeable
						:index="i"
						@close="tagClose"
					/>
				</view>
			</view>
		</scroll-view>
		<view v-if="type !== '1'" class="footer-btn u-fx-ac"><u-button @click="confirm" type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg">提交</u-button></view>
		<u-popup v-model="showPopTag" mode="center" border-radius="14" width="80%" height="80%">
			<choose-students :type="type" :bindList="formData.noWorkstu" :schoolInfo="schoolInfo" @close="popclose" @confirm="popselcet"></choose-students>
		</u-popup>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import ChooseStudents from '@/components/choose-students/choose-students.vue';
import anUploadImg from '@/components/an-uploadImg/an-uploadImg';
import { store, actions } from './store/index.js';
export default {
	components: {
		anUploadImg,
		ChooseStudents
	},
	data() {
		return {
			showPopTag: false,
			date: '',
			type: '', // 0新增，1查看2未交
			id: '',
			classCode: '',
			schoolYearId: '',
			classList: [],
			subList: [],
			schoolInfo: {},
			formData: {
				className: '',
				gradeClassName: '',
				classCode: '',
				gradeCode: '',
				gradeName: '',
				subjectName: '',
				subjectCode: '',
				content: '',
				attachList: [],
				noWorkstu: []
			},
			noWorkstuLength: '请选择'
		};
	},
	computed: {},
	created() {
		this.type = this.$tools.getQuery().get('type');
		this.id = this.$tools.getQuery().get('id');
		this.schoolInfo.schoolCode = store.userInfo.schoolCode;
		this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId;
		this.schoolInfo.schoolType = store.userInfo.schoolType;
		if (this.type !== '0') {
			this.showData();
		} else {
			this.classList = JSON.parse(uni.getStorageSync('protal')).teachClassList.map(el => {
				return {
					...el,
					key: el.value,
					label: el.text
				};
			});
			this.date = this.$tools.getDateTime(new Date(), 'date');
		}
		console.log(this.classList)
	},
	async mounted() {},
	methods: {
		// 表单回填
		async showData() {
			const res = await actions.getHomeworkDetail(this.id);
			this.date = this.$tools.getDateTime(res.data.homework.createTime, 'date');
			this.schoolInfo.classCode = res.data.homework.classCode;
			this.formData = {
				className: res.data.homework.className,
				gradeClassName: res.data.homework.gradeName + (res.data.homework.professionName || '') + res.data.homework.className,
				classCode: res.data.homework.classCode,
				subjectName: res.data.homework.subjectName,
				subjectCode: res.data.homework.subjectCode,
				professionCode: res.data.homework.professionCode,
				professionName: res.data.homework.professionName,
				content: res.data.homework.content,
				gradeCode: res.data.homework.gradeCode,
				gradeName: res.data.homework.gradeName,
				attachList: res.data.homeworkAttachList.map(el => {
					return {
						name: el.fileName,
						url: el.fileUrl
					};
				}),
				noWorkstu: res.data.homeworkUnsubmitList.map(el => {
					return {
						...el,
						tag: true
					};
				})
			};
			this.noWorkstuLength = `已选择${this.formData.noWorkstu.length}人`;
		},
		changeClass() {
			console.log(123)
			this.$tools.actionsheet(this.classList, item => {
				console.log(item);
				this.formData.gradeClassName = item.label;
				this.formData.classCode = item.key;
				this.formData.className = item.className;
				this.formData.gradeName = item.gradeName;
				this.formData.gradeCode = item.gradeCode;
				this.formData.professionName = item.professionName;
				this.formData.professionCode = item.professionCode;
				this.formData.subjectName = '';
				this.formData.subjectCode = '';
			});
		},
		changeSub() {
			if (this.formData.classCode === '') {
				this.$tools.toast('请先选择班级');
				return;
			}
			let subjectList = JSON.parse(uni.getStorageSync('protal')).teachClassList
				.filter(el => {
					return el.value === this.formData.classCode;
				})[0]
				.subjectList
			if(!subjectList || subjectList.length===0){
				this.$tools.toast('请先绑定学科');
				return
			}
			this.subList = subjectList.map(item => {
					return {
						key: item.subjectCode,
						label: item.subjectName
					};
				});
			this.$tools.actionsheet(this.subList, item => {
				console.log(item);
				this.formData.subjectName = item.label;
				this.formData.subjectCode = item.key;
			});
		},
		popclose() {
			this.showPopTag = false;
		},
		popselcet(data) {
			this.formData.noWorkstu = data.map(el => {
				return {
					tag: true,
					userName: el.userName,
					userCode: el.userCode,
					workNo: el.workNo,
					photoUrl: el.photoUrl
				};
			});
			this.noWorkstuLength = `已选择${this.formData.noWorkstu.length}人`;
			this.showPopTag = false;
		},
		tagClose(i) {
			this.formData.noWorkstu[i].tag = false;
			this.formData.noWorkstu = this.formData.noWorkstu.filter(ele => ele.tag);
			this.noWorkstuLength = `已选择${this.formData.noWorkstu.length}人`;
		},
		async confirm() {
			if (this.type === '0') {
				if (this.formData.content === '' || this.formData.subjectCode === '' || this.formData.classCode === '') {
					this.$tools.toast('请完善作业信息');
					return;
				}
				const req = {
					...this.formData,
					...this.schoolInfo,
					createUsercode: store.userInfo.userCode,
					createUserName: store.userInfo.userName,
					attachList: this.formData.attachList.map(el => {
					return {
						fileUrl: el.url
					};
				})
				};
				const res = await actions.addHomework(req);
				this.$tools.toast('提交成功', 'success');
				this.$tools.goNext(() => {
					eventBus.$emit('getList');
					this.$tools.goBack();
				});
			} else {
				const req = {
					homeworkId: this.id,
					newList: this.formData.noWorkstu.map(ele => {
						return {
							homeworkId: this.id,
							schoolCode: store.userInfo.schoolCode,
							userCode: ele.userCode,
							userName: ele.userName,
							workNo: ele.workNo,
							photoUrl: ele.photoUrl
						};
					})
				};
				console.log(req);
				const res = await actions.addUnSubmit(req);
				this.$tools.toast('提交成功', 'success');
				this.$tools.goNext(() => {
					eventBus.$emit('getList');
					this.$tools.goBack();
				});
			}
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
	color: $u-tips-color;
}
.al-r {
	text-align: right;
}
.input-area {
	height: 400rpx;
}
/deep/ .uni-textarea-textarea {
	border: 1rpx solid $u-border-color;
	padding: 20rpx;
	height: 350rpx;
	line-height: 50rpx;
	color: $u-content-color;
}
/deep/ .uni-textarea-placeholder {
	padding: 20rpx;
}
</style>
