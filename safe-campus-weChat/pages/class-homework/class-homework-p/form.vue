<template>
	<view class="u-auto">
		<scroll-view v-if="list[current] && type === '1'" scroll-y="true" class="scroll-h">
			<view class="u-fx-jsb u-fx-ac u-bd-b item-list u-bold">
				<view>{{ date }} 作业</view>
				<u-tag v-if="!list[current].isSubmit" class="u-mar-r10" mode="dark" type="error" text="未交" />
			</view>
			<view class="u-bd-b"><u-tabs :list="list" :is-scroll="true" :current="current" @change="change"></u-tabs></view>
			<view class="u-fx-ac u-bd-b item-list">
				<view>班级：</view>
				<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r20">{{ list[current].grade_name }}{{ list[current].profession_name || '' }}{{ list[current].class_name }}</view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view>学科：</view>
				<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r20">{{ list[current].subject_name }}</view>
			</view>
			<view class="u-fx u-bd-b item-list input-area">
				<view>作业：</view>
				<view class="u-fx-f1 mar-r20"><textarea disabled class="item-input u-content-color" maxlength="800" v-model="list[current].content" placeholder="" /></view>
			</view>
			<view class="u-bd-b item-list" v-if="list[current].homeworkAttachList.length > 0">
				<view class="mar-b20">图片：</view>
				<view class="u-fx-f1">
					<view class="u-fx-f1"><an-upload-img disabled total="9" v-model="getFileList" class="upload"></an-upload-img></view>
				</view>
			</view>
		</scroll-view>
		<scroll-view v-if="type === '2'" scroll-y="true" class="scroll-h">
			<view class="u-fx-jsb u-fx-ac u-bd-b item-list u-bold">
				<view>{{ date }} 作业</view>
				<u-tag v-if="isSubmitTag" class="u-mar-r10" mode="dark" type="error" text="未交" />
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view>班级：</view>
				<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r20">{{ homeworkInfo.homework.gradeName }}{{ homeworkInfo.homework.professionName || '' }}{{ homeworkInfo.homework.className }}</view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view>学科：</view>
				<view class="u-fx-f1 u-fx-je u-tips-color u-mar-r20">{{ homeworkInfo.homework.subjectName }}</view>
			</view>
			<view class="u-fx u-bd-b item-list input-area">
				<view>作业：</view>
				<view class="u-fx-f1 mar-r20"><textarea disabled class="item-input u-content-color" maxlength="800" v-model="homeworkInfo.homework.content" placeholder="" /></view>
			</view>
			<view class="u-bd-b item-list" v-if="homeworkInfo.homeworkAttachList.length > 0">
				<view class="mar-b20">图片：</view>
				<view class="u-fx-f1">
					<view class="u-fx-f1"><an-upload-img disabled total="9" v-model="getFileList" class="upload"></an-upload-img></view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { store, actions } from './store/index.js';
import anUploadImg from '@/components/an-uploadImg/an-uploadImg';
export default {
	components: {
		anUploadImg
	},
	data() {
		return {
			current: 0,
			list: [],
			date: '',
			type: '',
			homeworkInfo: {
				homework: {},
				homeworkAttachList: []
			},
			isSubmitTag: false
		};
	},
	computed: {
		getFileList() {
			let list = this.type === '1' ? this.list[this.current].homeworkAttachList : this.type === '2' ? this.homeworkInfo.homeworkAttachList : []
			return list.map(el => {
				return {
					name: el.fileName,
					url: el.fileUrl
				};
			});
		}
	},
	created() {
		this.type = this.$tools.getQuery().get('type');
		this.userCode = this.$tools.getQuery().get('userCode');
		this.classCode = this.$tools.getQuery().get('classCode');
		this.showData();
	},
	async mounted() {},
	methods: {
		change(index) {
			this.current = index;
		},
		async showData() {
			if(this.type === '1'){
				this.date = this.$tools.getQuery().get('id');
				const req = {
					createTime: this.date,
					userCode: this.userCode,
					classCode: this.classCode
				};
				const res = await actions.getHomeworkDetail(req);
				this.list = res.data.list.map(el => {
					return {
						...el,
						name: el.subject_name,
						count: undefined
					};
				});
			} else if(this.type === '2'){
				const res = await actions.getDetail(this.$tools.getQuery().get('id'));
				this.date = this.$tools.getDateTime(res.data.homework.createTime, 'date');
				this.homeworkInfo = res.data
				this.isSubmitTag = res.data.homeworkUnsubmitList.some(el => {
					return el.userCode === this.userCode
				})
			}
		}
	}
};
</script>

<style lang="scss">
.scroll-h {
	height: calc(100vh);
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
