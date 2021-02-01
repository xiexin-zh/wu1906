<template>
	<view class="fillIn">
		<scroll-view scroll-y="true" class="scroll-h" v-if="Object.keys(detailInfo).length>0">
			<view class="row u-type-white-bg u-fx-ac-jc u-bold  u-font-1 u-padd-30 ">
				{{ detailInfo.taskName }}
			</view>
			<view class="cont u-type-white-bg u-padd-l10 u-padd-r10 u-tips-color">
				<u-row class='u-mar-b10 u-mar-r20 u-font-02' justify="center">
					<u-col span="3">
						<view class="demo-layout bg-purple">
							发布人:{{ !type||type===2?detailInfo.publisherName:detailInfo.userName }}
						</view>
					</u-col>
					<u-col span="7">
						<view class="demo-layout bg-purple-light">
							发布于：{{(!type||type===2?detailInfo.publisherDate:detailInfo.publisherTime) | gmtToDate }}
						</view>
					</u-col>
				</u-row>
				<u-row class='u-mar-b10 u-font-02' justify="center">
					<u-col span="9">
						<view class="demo-layout bg-purple">
							任务时间：{{(!type||type===2?detailInfo.startDate:detailInfo.beginTime) | gmtToDate('date') }}
							至
							{{ (!type||type===2?detailInfo.endDate:detailInfo.endTime) | gmtToDate('date') }}
						</view>
					</u-col>
				</u-row>
				<u-row v-if="detailInfo.des" class='u-mar-b10 u-padd-t30 u-padd-l10' justify="start">
					<u-col span="3" class="u-main-color u-mar-b10">
						任务描述:
					</u-col>
					<u-col span="12">
						<jyf-parser :html="detailInfo.des" ref="article"></jyf-parser>
					</u-col>
				</u-row>
				<u-row class='u-mar-b10' v-if='detailInfo.docUrl' justify="between">
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
					<view class="cont">
						<u-row class='u-mar-b20   u-mar-t20 u-main-color ' justify="start">
							<u-col span="12">
								<text class=''>单选题:</text>
							</u-col>
						</u-row>
						<view class="wentiList u-padd-l20 u-padd-r20" v-for="(list, i) in radioList" :key="i">
							<u-row class="u-main-color u-type-white-bg u-padd-t10 ">
								<u-col span="12">
									{{i+1}}.{{ list.title }}
								</u-col>
							</u-row>
							<u-radio-group v-if='!type||type===2' :disabled="!type" v-model="list.answers[0]" class='u-wh'>
								<u-cell-group class='u-wh' :border='true'>
									<u-radio shape="circle" class="u-padd-15 u-bd-b" v-for="(element,index) in list.content" :key='index' :name="element">
										{{element}}
									</u-radio>
								</u-cell-group>
							</u-radio-group>
							<!-- 填报 -->
							<u-radio-group v-else :disabled="!type" v-model="list.answer" class='u-wh '>
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
					<view class="cont">
						<u-row class='u-mar-b20  u-mar-t20 u-main-color' justify="start">
							<u-col span="12">
								<text class=''>多选题:</text>
							</u-col>
						</u-row>
						<view class="wentiList u-padd-l20 u-padd-r20" v-for="(list, i) in checkList" :key="i">
							<u-row class=" u-main-color u-type-white-bg u-padd-t10">
								<u-col span="12">
									{{i+1}}.{{ list.title }} {{i+1}}.{{ list.title }}
								</u-col>
							</u-row>
							<u-checkbox-group v-if='!type||type===2' :disabled="!type" class='u-wh'>
								<u-cell-group class='u-wh' :border='true'>
									<u-checkbox v-model="element.disabled" class="u-padd-15 u-bd-b" v-for="(element,index) in list.pointList" :key="index"
									 :name="element.content">
										{{element.content}}
									</u-checkbox>
								</u-cell-group>
							</u-checkbox-group>
							<u-checkbox-group v-else :disabled="!type" class='u-wh'>
								<u-cell-group class='u-wh' :border='true'>
									<u-checkbox v-model="element.answer" class="u-padd-15 u-bd-b" v-for="(element,index) in list.pointList" :key="index"
									 :name="element.content">
										{{element.content}}
									</u-checkbox>
								</u-cell-group>
							</u-checkbox-group>
						</view>
					</view>
				</view>
				<view class="problem-list" v-if="fillList.length !== 0">
					<view>
						<u-row class='u-mar-b20  u-mar-t20 u-main-color' justify="start">
							<u-col span="12">
								<text class=''>填空题:</text>
							</u-col>
						</u-row>
						<view class="wentiList u-mar-l20 u-mar-r20  u-type-white-bg " v-for="(list, i) in fillList" :key="i">
							<u-row class="u-padd-t10">
								<u-col span="12" class=" u-main-color u-type-white-bg ">
									{{i+1}}.{{ list.title }}
								</u-col>
							</u-row>
								<view class="u-type-white-bg u-padd-t10 u-padd-l20">
										<u-input class="u-padd-l20 " v-model="list.answers[0]" v-if='!type||type===2' :disabled="!type" type="textarea"
										:auto-height="true" />
										<u-input class="u-padd-l20 " v-model="list.answer" v-else :disabled="!type" type="textarea" placeholder='请在此填写'
										:auto-height="true" />
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
					<view v-if="type===0" class="wentiList u-mar-l20 u-mar-r20  u-type-white-bg  u-padd-t10 u-padd-b20">
						<view class="u-type-white-bg" v-for="(list, i) in fileList" :key="i">
							<u-row>
								<u-col span="12" class=" u-main-color u-mar-b10 u-padd-t10">
									{{i+1}}.{{ list.title }}
								</u-col>
							</u-row>
							<view class="u-fx" v-for="(list, y) in fileList" :key="y">
								<u-icon class="u-mar-l10 u-mar-r10" name="file-text-fill" color="#4d4cac" size="28"></u-icon>附件
								<span class="u-type-primary u-mar-r10" @click="exportClick(list.answers[0])">下载</span>
							</view>
						</view>
					</view>
					<!-- 修改 -->
					<view v-if="type===2" class="wentiList  u-mar-r20 u-mar-t20 u-mar-l20  u-type-white-bg u-padd-t10 u-padd-b20">
						<view class="" v-for="(list, i) in fileList" :key="i">
							<u-row>
								<u-col span="12" class=" u-main-color u-type-white-bg u-padd-t10">
									{{i+1}}.{{ list.title }}
								</u-col>
							</u-row>
							<an-upload-img-url v-if="list.show" style="padding: 20rpx" class='u-type-white-bg' v-model="list.answers">
							</an-upload-img-url>
							<view class="u-fx" v-else>
								<view class="">
									<u-icon class="u-mar-l10 u-mar-r10" name="file-text-fill" color="#4d4cac" size="28"></u-icon>附件
									<span class="u-type-primary u-padd-l10" @click="exportClick(list.answers[0])">预览</span>
									<u-icon name="trash-fill" color="red" size="28" @click="delFile(list,i)"></u-icon>
								</view>
							</view>
						</view>
					</view>
					<!-- 填报 -->
					<view v-if="type===1" class="wentiList  u-mar-r20 u-mar-t20 u-mar-l20  u-type-white-bg u-padd-t10 u-padd-b20">
						<view class="" v-for="(list, i) in fileList" :key="i">
							<u-row>
								<u-col span="12" class=" u-main-color u-type-white-bg u-padd-t10">
									{{i+1}}.{{ list.title }}
								</u-col>
							</u-row>
							<an-upload-img-url v-if="list.show" style="padding: 20rpx" class='u-type-white-bg' v-model="list.answer">
							</an-upload-img-url>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class=" u-fx-ac  u-mar-b20 u-mar-t30" v-if='type!==0'>
				<u-button :custom-style="customStyle" class="u-fx-f1 u-mar-r u-mar-l u-bd-1px" @click="cancel">
					取消
				</u-button>
				<u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r " :disabled="isLoad" @click="submitOk">
					确定
				</u-button>
			</view>
	</view>
</template>

<script>
	// import vConsole from 'vconsole'
	import eventBus from '@u/eventBus'
	import validateForm from '@u/validate';
	import anUploadImgUrl from './component/an-uploadImg-url'
	import lFile from '@/components/l-file/l-file.vue'
	import {
		store,
		actions
	} from './store/index.js'
	import hostEnv from '../../config/index'
	export default {
		components: {
			anUploadImgUrl,
			lFile
		},
		data() {
			return {
				type: Number(this.$tools.getQuery().get('type')),
				client: '',
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
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: 'orange',
			}
		},
		watch: {},
		created() {
			this.client = this.$tools.getClient()
		},
		mounted() {
			//  new vConsole()
			this.taskId = this.$tools.getQuery().get('myTaskId'),
				this.TaskCode = this.$tools.getQuery().get('myTaskCode'),
				this.state = this.$tools.getQuery().get('state'),
				this.source = this.$tools.getQuery().get('source'),
				this.taskTemplateCode = this.$tools.getQuery().get('taskTemplateCode'),
				this.getUserList()
		},
		methods: {
			async getUserList() {
				let res
				if (this.type === 0 || this.type === 2) {
					//填报了的预览
					res = await actions.previewMyTask({
						query: this.taskId
					})
					this.detailInfo = res.data
					const questions = res.data.answers.map((el, index) => {
						return {
							...el,
							key: index,
							pointList: el.content ?
								el.content.map((item, i) => {
									return {
										key: i,
										content: item,
										disabled: el.answers.some(v => v === item)
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
								show: false
							})
						}
					})
				} else {
					//查看问题详情不带答案
					res = await actions.myTaskDetail({
						id: this.taskId
					})
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
								show: true,
								answer: []
							})
						}
					})
				}
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
			submitOk() {
				const req = {
					taskCode: this.TaskCode,
					taskId: this.taskId,
					taskTemplateCode: this.taskTemplateCode,
					userCode: store.userInfo.userCode,
					state: this.type === 2 ? this.state : Number(this.state) + 1
				}
				let answers
				if (this.type === 2) {
					//修改
					this.checkList.forEach(item => {
						item.answers = item.pointList.filter(v => v.disabled).map(i => i.content)
					})
					const arr = this.radioList.concat(this.checkList).concat(this.fillList).concat(this.fileList)
					answers = arr.map(el => {
						let result
						if (el.questionType === '4') {
							result = el.show ? el.answers.map(v => v.url) : el.answers
						} else {
							result = Array.isArray(el.answers) ? el.answers : [el.answers]
						}
						return {
							answers: result,
							questionTemplateId: el.questionTemplateId,
							questionType: el.questionType
						}
					})
				} else {
					//填报
					this.checkList.forEach(item => {
						item.answer = item.pointList.filter(v => v.answer).map(i => i.content)
					})
					const arr = this.radioList.concat(this.checkList).concat(this.fillList).concat(this.fileList)
					answers = arr.map(el => {
						let result
						if (el.questionType === '4') {
							result = el.answer.map(v => v.url)
						} else {
							result = Array.isArray(el.answer) ? el.answer : [el.answer]
						}
						return {
							answers: result,
							questionTemplateId: el.questionTemplateId,
							questionType: el.questionType
						}
					})
				}
				let flag = true
				answers.forEach(element => {
					if (element.answers.length === 0) {
						this.$tools.toast("请填写完整题目");
						flag = false
						return false
					}
					element.answers.forEach(el => {
						if (!el || el.length === 0) {
							this.$tools.toast("请填写完整题目");
							flag = false
							return false
						}
					})
				})
				req.answers = answers
				// console.log(req)
				if (!flag) return
				this.isLoad = true
				actions.answerTask(req)
					.then(res => {
						this.isLoad = false
						this.$tools.toast("操作成功", "success");
						if (this.source === '1') {
							this.submit(this.taskId)
						}
						this.$tools.goNext(() => {
							this.$tools.navTo({
								url: `./index?source=${this.source}`,
							})
						});
					})
					.catch(res => {
						this.isLoad = false
					})
			},
			//提交 ，学校填报了直接提交
			submit(taskId) {
				const req = {
					query: '?' + 'id=' + taskId
				}
				actions.submitMyTask(req).then(res => {
					// console.log(res)
				})
			},
			//修改附件
			delFile(list, i) {
				list.answers = []
				list.show = true
				// this.fileList[i].docName = ''
			},
			// 全选
			checkedAll() {
				this.list.map(val => {
					val.checked = true;
				})
			},
			success(value) {
				// console.log(value)
			},

		}
	}
</script>

<style lang="scss" scoped>
	.fillIn{
		/deep/ .u-bd-1px{
			border: none!important;
		}
		.scroll-h {
			
			height: calc(100vh - 140rpx);
			.item-text-area {
				// height: 120rpx;
				// width: 100%;
				// line-height: 40rpx;
				// color: $u-content-color;
			}

			.upload-icon {
				display: flex;
				justify-content: center;
				align-items: center;
			}

			p {
				img {
					border: 1rpx solid red !important;
					width: 100rpx;
					height: 100rpx;
				}
			}

		}
	}
	
</style>
