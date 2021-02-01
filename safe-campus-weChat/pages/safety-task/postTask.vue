<template>
	<view class=" u-type-white-bg ">
		<scroll-view scroll-y="true" class="scroll-h  ">
			<view class="row  u-fx-ac-jc u-font-1 u-padd-20 u-line2">
				{{ detailInfo.taskName }}
			</view>
			<view class="cont  u-padd-l10 u-padd-r10 u-tips-color">
				<u-row class='u-mar-b10 u-mar-r20 u-font-02' gutter="16" justify="center">
					<u-col span="3">
						<view class="demo-layout bg-purple">发布人:{{publisher }}</view>
					</u-col>
				
				</u-row>
				<u-row class='u-mar-b30 u-font-02' gutter="16" justify="center">
					<u-col span="9">
						<view class="demo-layout bg-purple">
							任务时间：{{ detailInfo.startTime | gmtToDate('date') }}
							至
							{{ detailInfo.endTime  | gmtToDate('date') }}
						</view>
					</u-col>
				</u-row>
				<u-row class='u-mar-b10' justify="between">
					<u-col span="12">
						<u-line color='#ccc' />
					</u-col>
				</u-row>
			</view>
			<view class="problem u-padd-l10 u-mar-b30">
				<u-row @click="teacherTag=true" class='u-mar-b10  u-mar-t20  u-main-color' justify="between">
					<u-col span='4'>
						接收人:
					</u-col>
					<u-col span='3' class="u-type-primary">
						选择接收人:
					</u-col>
				</u-row>
				<view class="problem-list">
					<view class="cont u-fx-wp u-mar-t30">
						<view class="" v-for="(tag, i) in tags" :key="i">
							<u-tag class="u-mar-10" :text="tag.userName" closeable @close="tagClick(tag,i)" :show="tag.show" type="success" />
						</view>
					</view>
				</view>
			</view>

		</scroll-view>
		<view class=" u-fx-ac  u-type-white-bg  u-mar-b20 u-mar-t30">
			<!-- <u-button :custom-style="customStyle" class="u-fx-f1 u-mar-r u-mar-l" @click="cancel">
					取消
				</u-button> -->
			<u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r " :disabled="isLoad" @click="postTask">
				发布任务
			</u-button>
		</view>
		<teacher-tree isCheck v-show="teacherTag" :teacherTag="teacherTag" :schoolInfo="schoolInfo" :disabled="disabled"
		 @close="teacherTag=false" @confirm="confirm" :classChecked="teacherList"></teacher-tree>
	</view>
</template>

<script>
	import eventBus from '@u/eventBus'
	import validateForm from '@u/validate';
	import teacherTree from "@/components/teacher-tree/teacher-tree"
	import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
	import {
		store,
		actions
	} from './store/index.js'
	import hostEnv from '../../config/index.js';
	export default {
		components: {
			anUploadImg,
			teacherTree
		},
		computed: {
			publisher() {
				return store.userInfo.userName
			}
		},
		data() {
			this.uploadUrl = `${hostEnv.protal_api_10050}/file/freeUpload?schoolCode=${this.schoolCode}`
			return {
				// type: Number(this.$tools.getQuery().get('type')),
				customStyle: {
					border: '1px dashed #ccc',
				},
				teacherTag: false,
				disabled: false,
				schoolInfo: {
					schoolYearId: 0,
					schoolCode: ''
				},
				teacherList: [],
				tags: [],
				detailInfo: {},
				isLoad: false,
				value: 'orange',
			}
		},
		created() {
			this.schoolInfo.schoolCode = store.userInfo.schoolCode
			this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId
		},
		mounted() {
			this.taskId = this.$tools.getQuery().get('myTaskId'),
				this.taskTemplateCode = this.$tools.getQuery().get('taskTemplateCode'),
				this.getUserList()
		},
		methods: {
			//选人
			confirm(value) {
				console.log(value)
				value.forEach(element => {
					element.show = true
				});
				this.tags = value
				console.log()
				this.teacherTag = false;
			},
			async getUserList() {
				//查看为问题详情不带答案
				const res = await actions.getTaskDetail(this.taskId)
				this.detailInfo = res.data
			},
		
			cancel() {
				this.$router.go(-1)
			},
			tagClick(tag, index) {
				this.tags.splice(index, 1)
			},
			//发布
			async postTask() {
				let req = {
					publisherCode: store.userInfo.userCode,
					publisherName: store.userInfo.userName,
					taskId: this.taskId,
					users: this.tags.map(el => {
						return {
							...el,
							schoolCode: store.userInfo.schoolCode
						}
					})
				}
				const res = await actions.postSchoolTask(req)
				this.$tools.toast("操作成功");
				this.$tools.navTo({
					url: `./index?source=3`,
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-h {
		height: calc(100vh - 120rpx);

		.item-text-area {
			height: 120rpx;
			width: 100%;
			line-height: 40rpx;
			color: $u-content-color;
		}
	}
</style>
