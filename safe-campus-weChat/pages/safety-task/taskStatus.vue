<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h" v-if="Object.keys(detailInfo).length>0">
			<view class="row u-type-white-bg u-fx-ac-jc  u-font-1 u-padd-20 u-line2">
				{{ detailInfo.taskName }}
			</view>
			<view class="cont u-type-white-bg u-padd-l10 u-padd-r10 u-tips-color" >
				<u-row class='u-mar-b10 u-mar-r20 u-font-02' justify="center">
					<u-col span="3" >
						<view class="demo-layout bg-purple">发布人:{{detailInfo.publisherName}}</view>
					</u-col>
					<u-col span="7">
						<view class="demo-layout bg-purple-light">发布于：{{detailInfo.publishTime | gmtToDate }}</view>
					</u-col>
				</u-row>
				<u-row class='u-mar-b10 u-font-02' justify="center">
					<u-col span="9">
						<view v-if="client==='IOS'" class="demo-layout bg-purple">
							任务时间：{{detailInfo.beginTime| gmtToDate('date')| iosReplace }}
							至
							{{detailInfo.endTime | gmtToDate('date')| iosReplace }}
						</view>
						<view v-else class="demo-layout bg-purple">
							任务时间：{{detailInfo.beginTime| gmtToDate('date') }}
							至
							{{detailInfo.endTime | gmtToDate('date') }}
						</view>
					</u-col>
				</u-row>
				<u-row 
				  v-if="detailInfo.des"
					class='u-mar-b10 u-padd-t30 ' justify="start">
					<u-col span="3" class="u-main-color u-mar-b10">
						任务描述:
					</u-col>
					<u-col span="12">
						<text class='u-line1' v-html= detailInfo.des>
						</text>
					</u-col>
				</u-row>
				<u-row class='u-mar-b10' justify="between">
					<u-col span="12">
						<u-line color='#ccc' />
					</u-col>
				</u-row>
				<u-row v-if='detailInfo.docUrl' class='u-mar-b10  u-main-color' justify="start">
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
						<!-- <u-link  href="#" :under-line="true" @click="exportClick(detailInfo.docUrl)">下载</u-link> -->
					</view>
				</u-row>
			</view>
			<view class="problem" :class="!type?'u-mar-b30':''">
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
							<u-radio-group  :disabled="true" v-model="list.answer[0]" class='u-wh' >
								<u-cell-group class='u-wh' :border='true'>
									<u-radio shape="circle" class="u-padd-15 u-bd-b" v-for="(element,index) in list.content" :key='index' :name="element">
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
							<u-checkbox-group  :disabled="true" class='u-wh' >
								<u-cell-group  class='u-wh' :border='true'>
									<u-checkbox v-model="element.disabled"  class="u-padd-15 u-bd-b" v-for="(element,index) in list.pointList"
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
						<view class="wentiList u-mar-l20 u-mar-r20  u-type-white-bg " v-for="(list, i) in fillList" :key="i">
								<u-row>
									<u-col span="12" class=" u-main-color u-type-white-bg u-padd-t10 ">
										{{i+1}}.{{ list.title }}
									</u-col>
								</u-row>
									<u-input class="u-mar-l20" v-model="list.answer[0]"  :disabled="true" type="textarea"  :auto-height="true" />
						</view>
					</view>
				</view>
				<view class="problem-list" v-if="fileList.length !== 0">
					<u-row class='u-mar-b20 u-mar-t20 u-main-color' justify="start">
						<u-col span="12" >
							附件:
						</u-col>
					</u-row>
					<!-- 查看 -->
					<view   class="wentiList u-mar-l20 u-mar-r20  u-type-white-bg" >
						<view  class="u-type-white-bg" v-for="(list, i) in fileList" :key="i">
							<u-row>
								<u-col span="12" class="u-main-color u-mar-b10 u-padd-t10">
									{{i+1}}.{{ list.title }}
								</u-col>
							</u-row>
							<view class="u-fx" v-for="(list, y) in fileList" :key="y">
								<u-icon class="u-mar-l10 u-mar-r10" name="file-text-fill" color="#4d4cac" size="28" ></u-icon>附件
								<span class="u-type-primary u-mar-r10" @click="exportClick(list.answer[0])">下载</span>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="u-mar-l10">
				处理流程：
			</view>
			<approval-step1 class='' :data-list="processes"></approval-step1>
		</scroll-view>
	</view>
</template>
<script>
  // import vConsole from 'vconsole'
	import eventBus from '@u/eventBus'
	import validateForm from '@u/validate';
	import anUploadImgUrl from './component/an-uploadImg-url'
	import ApprovalStep1 from './component/approvalStep'
	import {
		store,
		actions
	} from './store/index.js'
	import hostEnv from '../../config/index'
	export default {
		components: {
			anUploadImgUrl,
			ApprovalStep1
		},
		data() {
			return {
				type: Number(this.$tools.getQuery().get('type')),
				client:'',
				customStyle: {
					border: '1px dashed #ccc',
				},
				detailInfo: {},
				radioList: [],
				checkList: [],
				fillList: [],
				fileList: [],
				isLoad: false,
				completePhotoUrls: [],
        processes: [],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: 'orange',
			}
		},
		watch: {
		},
		created() {
			this.client = this.$tools.getClient()
		},
		mounted() {
				this.taskCode = this.$tools.getQuery().get('taskCode'),
				this.schoolCode = this.$tools.getQuery().get('schoolCode'),
				this.getUserList()
		},
		methods: {
			async getUserList() {
					//填报了的预览
					let req = {
						taskCode: this.taskCode,
						schoolCode: this.schoolCode
					}
				  let res = await actions.reportTaskDetail(req)
					this.detailInfo = res.data
					let questions = []
					questions = res.data.outUserAnswersDtoList.map((el, index) => {
						// console.log(el)
						return {
							...el,
							key: index,
							pointList: el.content
								? el.content.map((item, i) => {
									return {
										key: i,
										content: item,
										disabled:el.answer.some(v=>v===item)
									}
								}):[]
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
							this.fileList.push(el)
						}
					})

      this.processes = res.data.outSafeTaskProcessDtoList
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
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-h {
		height: calc(100vh - 0rpx);
		.item-text-area {
			// height: 120rpx;
			// width: 100%;
			// line-height: 40rpx;
			// color: $u-content-color;
		}
		.upload-icon{
			display: flex;
			justify-content: center;
			align-items: center;
		}
		p{
			img{
				border: 1px solid red !important;
				width: 100rpx;
				height: 100rpx;
			}
		}
		
	}
</style>
