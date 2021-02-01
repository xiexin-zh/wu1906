<template>
	<view class='home'>
		<view class="u-mar-20 ">
			<view class="input-box">
				<u-icon class="icon" name="search"></u-icon>
				<u-input @blur="showList()" class="resourInput u-mar-t20 u-mar-b20 u-type-white-bg u-padd-l20" v-model="searchObj.name"
				 placeholder='请输入资源名称' />
			</view>
			<dropdown-menu @value0Change="value0Change" :list0='sectionList' :list1="firstData" :list2="secondData " 
			:secondValue = 'secondValue' @value1Change='value1Change' @value2Change='value2Change' @searchChange="searchChange"></dropdown-menu>
		</view>
		<no-data class="u-mar-l20 u-mar-r20 u-mar-t20" v-if="dataList.length === 0" msg="暂无数据"></no-data>
		<scroll-view scroll-y="true" v-else class="scroll-h " @scrolltolower="loadMore">
			<u-row gutter="16" class="">
				<u-col span="6" v-for="(item,index) in dataList" :key="index">
					<view @click="detail(item)" class="u-mar-b20 cont-box u-wh u-type-white-bg u-border-radius u-shadow ">
						<image class="image" mode='scaleToFill' border-radius='8' width="100%" height="192rpx" :src="item.thumbnailUrl "></image>
						<view class=" u-mar-t20 u-mar-b10 u-padd-l20 u-padd-r20">
							{{item.name}}
						</view>
						<view class="u-font-01  u-tips-color  u-padd-l20 u-padd-r20 u-padd-b20">
							{{item.classType}}
						</view>
					</view>
				</u-col>
			</u-row>
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
				sectionList: [{
						text: '适用学段',
						value: '0'
					},
					{
						text: '幼儿园',
						value: '1'
					},
					{
						text: '小学低年级',
						value: '2'
					},
					{
						text: '小学高年级',
						value: '4'
					},
					{
						text: '初中',
						value: '8'
					},
					{
						text: '高中',
						value: '16'
					}
				],
				firstData: [],
				secondValue:'',
				secondData: [],
				allSecondData: [],
				dataList: [],
				morePage: false,
				searchObj: {
					section: "",
					categoryId: '',
					name: "",
				},
				pageList: {
					page: 1,
					size: 10,
				},
			};
		},
		computed: {
			userInfo() {
				return store.userInfo;
			},
		},
		async created() {
			this.firstId = ''
			this.secondId = ''
			this._firstCategory()
			this.showList()
			await this._treeView()
			this.secondData = this.allSecondData
		},
		mounted() {
			eventBus.$on("getList", () => {
				this.showList();
			});
		},
		methods: {
			// 资源类型获取一级分类
			async _firstCategory() {
				const res = await actions.firstCategory()
				this.firstData = res.data.map(el => {
					return {
						text: el.name,
						value: el.id + ''
					}
				})
				this.firstData.unshift({
					text: '资源类型',
					value: "0"
				})
			},
			// 获取资源树赋值二级分类所有
			async _treeView() {
				const res = await actions.treeView()
				this.options = res.data
				let allSecondData = res.data.map(v => v.children).flat().map(el => {
					return {
						text: el.categoryName,
						value: el.id + ''
					}
				})
				allSecondData.unshift({
					text: '资源类别',
					value: "0"
				})
				this.allSecondData = allSecondData
			},
			// 资源类型加载二级分类
			async _secondCategory(id) {
				const res = await actions.secondCategory(id)
				this.secondData = res.data.map(el => {
					return {
						text: el.name,
						value: el.id + ''
					}
				})
				this.secondData.unshift({
					text: '资源类别',
					value: "0"
				})
			},
			value0Change(val) {
				this.searchObj.section = val
				this.showList();
			},
			value1Change(val) {
				this.firstId = val
				if (val) {
					this._secondCategory(val)
				} else {
					// 一级分类为置空的时候,赋值所有的二级
					this.secondData = this.allSecondData
					this.secondValue = '0'
				}
				this.secondId = ''
				this.showList();
			},
			value2Change(val) {
				this.secondId = val
				this.showList();
			},
			async showList(tag = false) {
				if (tag) {
					this.pageList.page += 1;
				} else {
					this.pageList.page = 1;
				}
				this.searchObj.categoryId = this.secondId || this.firstId
				let req = {
					...this.pageList,
					...this.searchObj,
					schoolCode: store.userInfo.schoolCode,
				};
				let res = await actions.claroomLocalList(req);
				this.total = res.data.total;
				if (tag) {
					this.dataList = this.dataList.concat(res.data.records);
				} else {
					this.dataList = res.data.records;
				}
				this.morePage = res.data.pages > res.data.current;
			},
			loadMore() {
				if (!this.morePage) {
					this.$tools.toast("数据已加载完毕");
					return;
				}
				this.showList(true);
			},
			searchChange(val) {},
			detail(record) {
				let {
					id
				} = record
				this.$tools.navTo({
					url: `./classDetail?id=${id}`,
				});
			},
		},
		watch: {},
	};
</script>
<style lang="scss" scoped>
	.home {
		>>>.u-subsection {
			height: 390rpx !important;
		}

		.input-box {
			width: 100%;
			position: relative;

			.icon {
				position: absolute;
				left: 10rpx;
				top: 30%;
				z-index: 10;
				color: rgb(192, 196, 204)
			}

			.resourInput {
				width: 100%;
				border-radius: 8rpx;
				padding-left: 40rpx !important;
			}
		}

		.scroll-h {
			height: calc(100vh - 180rpx);
			padding: 10rpx;
			padding-top: 0rpx;

			.image {
				width: 100%;
				height: 192rpx;
				border-top-left-radius: 8rpx;
				border-top-right-radius: 8rpx;
			}
		}
	}
</style>
