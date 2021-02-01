<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="row u-type-white-bg u-fx-ac-jc u-bold  u-font-1 u-padd-30 ">
				{{ detailInfo.taskName }}
			</view>
			<view class="cont u-type-white-bg u-padd-l10 u-padd-r10 u-tips-color">
				<u-row class='u-mar-b10 u-font-02' gutter="16" justify="center">
					<u-col span="9">
						<view  class="demo-layout bg-purple">
							任务时间：{{ detailInfo.startTime | gmtToDate('date') }}
							至
							{{ detailInfo.endTime  | gmtToDate('date') }}
						</view>
					</u-col>
				</u-row>
				<u-row class='u-mar-b10 u-padd-t30 u-main-color u-padd-l10' gutter="16" justify="start">
					<u-col span="3">
						任务描述:
					</u-col>
				</u-row>
				<u-row class='u-mar-b30 u-font-01  u-padd-l10' gutter="16" justify="start">
					<u-col span="12">
						<jyf-parser :html="detailInfo.des" ref="article"></jyf-parser>
					</u-col>
				</u-row>
				<u-row class='u-mar-b10  u-padd-l10' v-if='detailInfo.docUrl' justify="between">
					<u-col span="12">
						<u-line color='#ccc'/>
					</u-col>
				</u-row>
				<u-row class='u-mar-b10  u-padd-l10  u-main-color' justify="start">
					<u-col span="12">
						附件任务:
					</u-col>
				</u-row>
				<u-row class='u-padd-b20' justify="start">
					<!-- <u-col span="6"> -->
					<text class='u-font-03'>{{ detailInfo.docName }}</text>
					<!-- </u-col> -->
					<view span="2" class='u-font-03'>
						<view v-if='detailInfo.docUrl' class="u-type-primary" @click="exportClick(detailInfo.docUrl)">
							下载
						</view>
					</view>
				</u-row>
			</view>
			<view class="problem u-mar-b30">
				<u-row class='u-mar-b10  u-mar-t20  u-main-color' justify="start">
					<u-col span="12">
						要求上报内容:
					</u-col>
				</u-row>
				<view class="problem-list" v-if="radioList.length !== 0">
					<view class="cont" >
						<u-row class='u-mar-b20  u-mar-t20 u-main-color' justify="start">
							<u-col span="12">
								<text class=''>单选题:</text>
							</u-col>
						</u-row>
						<view class="wentiList u-padd-l20 u-padd-r20"  v-for="(list, i) in radioList" :key="i">
							<u-row class=" u-main-color u-type-white-bg u-padd-t10">
								<u-col span="12" >
									{{i+1}}.{{ list.title }}
								</u-col>
							</u-row>
							<u-radio-group :disabled="true" v-model="list.answer" class='u-wh'>
								<u-cell-group shape="circle" class='u-wh' :border='true'>
									<u-radio shape="circle"  @change="radioChange" class="u-padd-15 u-bd-b" v-for="(element,index) in list.content" :key='index'	 :name="element">
										{{element}}
									</u-radio>
								</u-cell-group>
							</u-radio-group>
						</view>
					</view>
				</view>
				<view class="problem-list" v-if="checkList.length !== 0">
					<view class="cont" >
						<u-row class='u-mar-b20  u-mar-t20 u-main-color' justify="start">
							<u-col span="12">
								<text class=''>多选题:</text>
							</u-col>
						</u-row>
						<view class="wentiList u-padd-l20 u-padd-r20" v-for="(list, i) in checkList" :key="i">
								<u-row  class=" u-main-color u-type-white-bg u-padd-t10">
								<u-col span="12">
									{{i+1}}.{{ list.title }}
								</u-col>
							</u-row>
							<u-checkbox-group :disabled="true" class='u-wh'>
								<u-cell-group class='u-wh' :border='true'>
									<u-checkbox @change="checkboxChange(list)" v-model="element.answer" class="u-padd-15 u-bd-b" v-for="(element,index) in list.pointList"
									 :key="index" :name="element.content">
										{{element.content}}
									</u-checkbox>
								</u-cell-group>
							</u-checkbox-group>
						</view>
					</view>
				</view>
				<view class="problem-list" v-if="fillList.length !== 0">
					<view >
						<u-row class='u-mar-b20  u-mar-t20 u-main-color' justify="start">
							<u-col span="12">
									<text class=''>填空题:</text>
							</u-col>
						</u-row>
						<view class="wentiList u-mar-l20 u-mar-r20 u-padd-t u-type-white-bg u-bd-b" v-for="(list, i) in fillList" :key="i">
								<u-row>
									<u-col span="12" class=" u-main-color u-type-white-bg u-padd-t10">
										{{i+1}}.{{ list.title }}
									</u-col>
								</u-row>
								<view class="wentiList u-type-white-bg u-padd-l20">
									<u-input  class="u-mar-l20"  :disabled="true" type="textarea" :auto-height="true" />
								</view>
						</view>
					</view>
				</view>
				<view class="problem-list" v-if="fileList.length !== 0">
					<u-row class='u-mar-b20 u-bold  u-mar-t20 u-main-color' justify="start">
						<u-col span="12">
							附件:
						</u-col>
					</u-row>
					<!-- 查看 -->
					<view   class="wentiList u-mar-l20 u-mar-r20  u-type-white-bg" >
						<view  class="u-type-white-bg" v-for="(list, i) in fileList" :key="i">
							<u-row>
								<u-col span="12" class=" u-main-color u-mar-b10 u-padd-t10">
									{{i+1}}.{{ list.title }}
								</u-col>
							</u-row>
							<an-upload-img-url 
								v-if="list.show"
								style="padding: 20rpx"
								class='u-type-white-bg' 
								v-model="list.answer">
							</an-upload-img-url >
						</view>
					</view>
				</view>
				
			</view>
			<view class=" u-fx-ac u-mar-b20 u-mar-t30">
				<!-- <u-button :custom-style="customStyle" class="u-fx-f1 u-mar-r u-mar-l" @click="cancel">
					取消
				</u-button> -->
				<u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r " :disabled="isLoad" @click="nextStep">
					下一步
				</u-button>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import eventBus from '@u/eventBus'
	import validateForm from '@u/validate';
	import anUploadImgUrl from './component/an-uploadImg-url'
	import jyfParser from "@/components/jyf-parser/jyf-parser";
	// https://ext.dcloud.net.cn/plugin?id=805 //富文本插件文档
	import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
	import {
		store,
		actions
	} from './store/index.js'
	import hostEnv from '../../config/index.js';
	export default {
		components: {
			anUploadImg,
			anUploadImgUrl,
			jyfParser
		  // uParse
		},
		data() {
			this.uploadUrl = `${hostEnv.protal_api_10050}/file/freeUpload?schoolCode=${this.schoolCode}`
			return {
				// type: Number(this.$tools.getQuery().get('type')),
				customStyle: {
					border: '1px dashed #ccc',
				},
				client:'',
				detailInfo: {},
				radioList: [],
				checkList: [],
				fillList: [],
				fileList: [],
				isLoad: false,
				completePhotoUrls: [],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: 'orange',
			}
		},
		created() {
			this.client = this.$tools.getClient()
		},
		mounted() {
			this.taskId = this.$tools.getQuery().get('myTaskId'),
				this.taskTemplateCode = this.$tools.getQuery().get('taskTemplateCode'),
				this.getUserList()
		},
		methods: {
			//获取负责人数据
			async getUserList() {
				//查看为问题详情不带答案
				const res = await actions.getTaskDetail(this.taskId)
				this.detailInfo = res.data
				const questions = res.data.questions.map((el, index) => {
					return {
						...el,
						key: index,
						pointList: el.content ? el.content.map((item, i) => {
							return {
								key: i,
								content: item
							}
						}) : []
					}
				})
				questions.map((el) => {
					if (el.questionType === '1') {
						this.radioList.push(el)
					} else if (el.questionType === '2') {
						this.checkList.push(el)
					} else if (el.questionType === '3') {
						this.fillList.push(el)
					} else {
						this.fileList.push({ ...el,
							show: true
						})
					}
				})
			},
			//下载
			exportClick(docUrl) {
				if (docUrl) {
					const url = `${hostEnv.protal_api_10050}/file/downLoad/doc?url=${docUrl}`
					var a = document.createElement('a');
					a.href = docUrl; //图片地址
					document.body.appendChild(a);
					a.click();
				}
			},
			cancel() {
				this.$router.go(-1)
			},
			//提交
			nextStep() {
				this.$tools.navTo({
					url: `./postTask?&myTaskId=${this.taskId}`,
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-h {
		height: calc(100vh - 0rpx);

		.item-text-area {
			height: 120rpx;
			width: 100%;
			line-height: 40rpx;
			color: $u-content-color;
		}
	}
</style>
