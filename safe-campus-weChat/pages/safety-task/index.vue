<template>
	<view class='task-home'>
		<view class="u-padd-20">
			<u-subsection class="u-type-white-bg" @change="change" active-color="#2979ff" :list="typeList" mode="subsection"
			 :current="current"></u-subsection>
		</view>
		<view class="u-mar-l20 u-mar-r20 u-padd-b10">
			<dropdown-menu :key="childIndex" @value0Change="value0Change" :completeStatusList="this.source==='2'?this.completeStatusLists2:this.source==='3'?this.completeStatusLists3:this.completeStatusLists1"
			 @value1Change='value1Change' @searchChange="searchChange"></dropdown-menu>
		</view>
		<no-data class="u-mar-l20 u-mar-r20 u-mar-t20" v-if="dataList.length === 0" msg="暂无数据"></no-data>
		<scroll-view scroll-y="true" v-else class="scroll-h " @scrolltolower="loadMore">
			<view class="u-shadow u-fx-ver  u-padd-20 u-padd-t10  u-border-radius tab-box u-fx-f1">
				<view class="card u-type-white-bg u-border-radius u-shadow u-padd-20 u-mar-b20 u-fx" v-for="(item,index) in dataList"
				 :key="index">
					<view class="cont-box  u-wh u-mar-l20">
						<view class="cont-title u-font-1 u-mar-t20  u-fx">{{item.taskName}}
							<view class="doorkeeper" v-if="item.taskType==='2'&&source!=='3'">
								({{item.year}}-{{item.dateNum}}周)
							</view>
							<view class="doorkeeper" v-if="item.taskType==='3'&&source!=='3'">
								({{item.year}}-{{item.dateNum}}月)
							</view>
							<u-tag v-if="source==='2'" class="u-mar-l10" :text="item.completeStatus|getSafetyState" size='mini'
							 :border-color='item.completeStatus|getSafetyState|safetyTaskToColor' :bg-color='item.completeStatus|getSafetyState|safetyTaskToColor'
							 color='#fff' />
							<u-tag v-if="source==='1'" class="u-mar-l10" :text="item.completeStatus|completeStatusToText" size='mini'
							 :border-color='item.completeStatus|completeStatusToText|safetyTaskToColor' :bg-color='item.completeStatus|completeStatusToText|safetyTaskToColor'
							 color='#fff' />
							<u-tag v-if="source==='3'" class="u-mar-l10" :text="item.state|stateToText" size='mini' :border-color='item.state|stateToText|safetyTaskToColor'
							 :bg-color='item.state|stateToText|safetyTaskToColor' color='#fff' />
						</view>
						<view class="time-text u-mar-t20 u-mar-b20 u-font-02">
							发布人：&nbsp;{{item.publisherName}}
						</view>
						<view class="" v-if="source==='3'">
								<view class="time-text u-mar-t20 u-mar-b20 u-font-02" v-if="source==='3'?item.publishDate:item.publishTime">
									发布于：&nbsp;{{item.publishDate|gmtToDate}}
								</view>
								<view class="time-text u-mar-t20 u-mar-b20 u-font-02">
									任务时间：{{item.beginDate|gmtToDate}}&nbsp;
									至&nbsp;{{item.endDate|gmtToDate}}
								</view>
						</view>
						<view  v-else>
								<view class="time-text u-mar-t20 u-mar-b20 u-font-02" v-if="source==='3'?item.publishDate:item.publishTime">
									发布于：&nbsp;{{item.publishTime}}
								</view>
								<view class="time-text u-mar-t20 u-mar-b20 u-font-02">
									任务时间：{{item.startTime}}&nbsp;
									至&nbsp;{{item.endTime}}
								</view>
						</view>
						
						<view class="cont-footer u-padd-t20 u-type-primary u-bd-t u-fx-jc u-font-02 ">
							<view class="u-fx-f1 u-fx-ac-jc " @click="fillIn(1,item)" v-if="source!=='3'&&item.completeStatus==='1'&&!isTime(item.endTime)">
								补填
							</view>
							<view class="u-fx-f1 u-fx-ac-jc " @click="fillIn(1,item)" v-if="source!=='3'&&item.completeStatus==='1'&& isTime(item.endTime)">
								填报
							</view>
							<view @click="fillIn(2,item)" class="u-fx-f1 u-fx-ac-jc u-bd-r" v-if="source==='2'&& (item.completeStatus==='2'||item.completeStatus==='6')">
								修改
							</view>
							<view @click="fillIn(0,item)" class="u-fx-f1 u-fx-ac-jc u-bd-r" v-if="(source==='2'&& item.completeStatus==='2'||item.completeStatus==='6'||item.completeStatus==='6'||item.completeStatus==='7')||(source==='1'&& (item.completeStatus==='3'||item.completeStatus==='4'))">
								查看
							</view>
							<view @click="submit(item)" class="u-fx-f1 u-fx-ac-jc u-bd-r" v-if="source==='2'&& (item.completeStatus==='2'||item.completeStatus==='6')">
								提交
							</view>
							<view @click="fillIn(0,item)" class="u-fx-f1 u-fx-ac-jc u-bd-r" v-if="source==='2'&& (item.completeStatus==='3'||item.completeStatus==='4'||item.completeStatus==='8')">
								查看
							</view>
							<view @click="fillIn(1,item)" class="u-fx-f1 u-fx-ac-jc u-bd-r" v-if="source==='2'&& item.completeStatus==='5'">
								重报
							</view>
							<view @click='release(item)' class="u-fx-f1 u-fx-ac-jc u-bd-r" v-if="source==='3'&& item.state==='0'">
								发布
							</view>
							<view @click='seeCompletion(item)' class="u-fx-f1 u-fx-ac-jc u-bd-r" v-if="source==='3'&& item.state!=='0'">
								查看完成情况
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import eventBus from "@u/eventBus";
	import DropdownMenu from './component/DropdownMenu.vue';
	import {
		store,
		actions,
	} from "./store/index.js";
	export default {
		components: {
			DropdownMenu
		},
		data() {
			return {
				current: 0,
				state: 1,
				client:'',
				childIndex:0,//刷新子组件标记
				states: '', //发布任务传给后台的任务状态
				source: '2', //1校端，2局端
				dataList: [],
				typeList: [{
						name: "上级下发",
					},
					{
						name: "学校任务",
					},
					{
						name: "发布任务",
					},
				],
				show: false,
				completeStatusLists3: [{
						value: '0',
						text: '任务状态'
					},
					{
						value: '1',
						text: '未发布'
					},
					{
						value: '2',
						text: '未开始'
					},
					{
						value: '3',
						text: '进行中'
					},
					{
						value: '4',
						text: '已结束'
					}
				],
				completeStatusLists2: [{
						text: '任务状态',
						value: '0'
					},
					{
						text: '未填报',
						value: '1'
					},
					{
						text: '已填报待提交',
						value: '2'
					},
					{
						text: '已提交',
						value: '3'
					},
					{
						text: '已补交',
						value: '4'
					},
					{
						text: '已打回，请重报',
						value: '5'
					}
				],
				completeStatusLists1: [{
						text: '任务状态',
						value: '0'
					},
					{
						text: '已提交',
						value: '6'
					},
					{
						text: '未提交',
						value: '7'
					},
					{
						text: '逾期填报',
						value: '8'
					}
				],
				completeStatus: [],
				searchObj: {
					completeStatus: "",
					taskType: ''
				},
				indexList: {},
				pageList: {
					page: 1,
					size: 10,
				},
				morePage: false,
			};
		},
		computed: {
			userInfo() {
				return store.userInfo;
			},
		},
		created() {
			this.client = this.$tools.getClient()
		},
		mounted() {
			let source = this.$tools.getQuery().get("source");
			if (source) {
				this.source = source;
			}
			eventBus.$on("getList", () => {
				this.showList();
			});
			this.showList();
		},
		methods: {
			//当前时间是否结束
			isTime(endTime) {
				return new Date().getTime() > new Date(endTime).getTime() ? false : true
			},
			value0Change(val) {
				if (this.source === '3') {
					//我下发的任务
					this.states = val
				} else {
					if (val === '1') {
						this.completeStatus = ['1']
					} else if (val === '2') {
						this.completeStatus = ['2']
					} else if (val === '3') {
						this.completeStatus = ['3']
					} else if (val === '4') {
						this.completeStatus = ['4']
					} else if (val === '5') {
						this.completeStatus = ['6', '5']
					} else if (val === '6') {
						this.completeStatus = ['3']
					} else if (val === '7') {
						this.completeStatus = ['1', '2']
					} else if (val === '8') {
						this.completeStatus = ['4']
					} else if (val === '') {
						this.completeStatus = []
					}
				}
				this.showList();
			},
			value1Change(val) {
				this.searchObj.taskType = val;
				this.showList();
			},
			async showList(tag = false) {
				if (tag) {
					this.pageList.page += 1;
				} else {
					this.pageList.page = 1;
				}
				let res
				if (this.source === '3') {
					//任务下发列表
					let req = {
						taskType: this.searchObj.taskType,
						...this.pageList,
						state: this.states ? (this.states - 1) + '' : '',
						schoolCode: store.userInfo.schoolCode,
						publisherCode: store.userInfo.userCode,
					};
					res = await actions.getTaskIssued(req);
				} else {
					let req = {
						taskType: this.searchObj.taskType,
						...this.pageList,
						completeStatus: this.completeStatus,
						schoolCode: store.userInfo.schoolCode,
						userCode: store.userInfo.userCode,
						source: this.source
					};
					res = await actions.getSafetask(req);
				}
				this.total = res.data.total;
				if (tag) {
					this.dataList = this.dataList.concat(res.data.records);
				} else {
					this.dataList = res.data.records;
				}
				this.morePage = res.data.pages > res.data.current;
			},
			searchChange(val) {
			},
			//填报
			fillIn(type, record) {
				let {
					myTaskId,
					myTaskCode,
					taskCode,
					completeStatus
				} = record
				this.$tools.navTo({
					url: `./fillIn?type=${type}&myTaskId=${myTaskId}&myTaskCode=${myTaskCode}&taskTemplateCode=${taskCode}&source=${this.source}&state=${completeStatus}`,
				});
			},
			loadMore() {
				if (!this.morePage) {
					this.$tools.toast("数据已加载完毕");
					return;
				}
				this.showList(true);
			},
			//提交
			submit(record) {
				let {
					myTaskId,
					myTaskCode,
					taskCode
				} = record
				this.$tools.confirm("提交之后不允许再次编辑内容，确定提交么？ ", () => {
					const req = {
						query: '?' + 'id=' + myTaskId
					}
					actions.submitMyTask(req).then(res => {
						this.$tools.toast("操作成功", "success");
						this.$tools.goNext(() => {
							this.showList()
						});
					})
				})
			},
			//发布
			release(record) {
				let {
					id,
					taskCode,
					taskType
				} = record
				this.$tools.navTo({
					url: `./release?&myTaskId=${id}&taskTemplateCode=${taskCode}&taskType=${taskType}`,
				});
			},
			//查看完成情况
			seeCompletion(record) {
				let {
					id,
					taskCode,
					taskType
				} = record
				this.$tools.navTo({
					url: `./seeCompletion?&myTaskId=${id}&taskTemplateCode=${taskCode}&taskType=${taskType}`,
				});
			},
			change(index) {
				this.current = index
				this.completeStatus = []
				this.searchObj.taskType = ''
				this.childIndex++
				if (index === 0) {
					this.source = '2'
				} else if (index === 1) {
					this.source = '1'
				} else if (index === 2) {
					this.source = '3'
				}
				this.showList();
			},
		},
		watch: {
			source(val) {
				if (val === '2') {
					this.current = 0;
				} else if (val === '1') {
					this.current = 1;
				}  else if (val === '3') {
					this.current = 2;
				}
			},
		},
	};
</script>
<style lang="scss" scoped>
	.task-home {
		>>>.u-subsection {
			height: 390rpx !important;
		}
		.scroll-h {
			height: calc(100vh - 180rpx);
			.cont-title {
				position: relative;

				.red-text {
					width: 100rpx;
					height: 100rpx;
					position: absolute;
					right: 0;
					top: 0;

					.del-add-img {
						width: 100% !important;
						height: 100% !important;
					}
				}
			}

			.time-text {
				color: #909399;
			}
		}
	}
</style>
