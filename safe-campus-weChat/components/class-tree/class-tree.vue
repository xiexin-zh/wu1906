<template>
	<view class="">
		<ly-drawer :visible="classTag" mode="right" width="80%" @close="close">
			<no-data msg="暂无班级数据~" v-if="noDataTag"></no-data>
			<view v-else>
				<view class="ly-search"><input v-model="searchText" placeholder="输入班级名进行过滤" /></view>
				<scroll-view :scroll-y="true" class="scroll-h">
					<ly-tree v-if="!isHighSchool" ref="tree" :filter-node-method="filterNode" :default-checked-keys="checkedKeys"
					 :props="props" :load="loadNode" lazy :show-checkbox="isCheck" :show-radio="isRadio" node-key="id" @check="handleCheck"
					 defaultExpandAll check-on-click-node highlight-current childVisibleForFilterNode :checkOnlyLeaf="isRadio"></ly-tree>
					<ly-tree v-else ref="tree" :ready="ready" :filter-node-method="filterNode" :default-checked-keys="checkedKeys"
					 :props="props" :treeData="treeData" :show-checkbox="isCheck" :show-radio="isRadio" node-key="id" @check="handleCheck"
					 defaultExpandAll check-on-click-node highlight-current childVisibleForFilterNode :checkOnlyLeaf="isRadio"></ly-tree>
				</scroll-view>
			</view>
			<view class="footer">
				<view class="button confirm" @tap="confirm">确定</view>
				<view class="button cancle" @tap="close">取消</view>
			</view>
		</ly-drawer>
	</view>
</template>

<script>
	import LyDrawer from '@/components/ly-drawer/ly-drawer.vue';
	import LyTree from '@/components/ly-tree/ly-tree.vue';
	import noData from '@/components/no-data/no-data.vue';
	import $ajax from '@u/request.js';
	import hostEnv from '../../config/index.js';
	export default {
		components: {
			LyTree,
			noData
		},
		watch: {
			searchText(val) {
				this.$refs.tree.filter(val);
			},
			classChecked(val) {
				this.selectedData = val.map(el => {
					return {
						...el,
						type: '2'
					}
				});
				this.checkedKeys = val.map(el => {
					return el.classCode
				})
			}
		},
		props: {
			isClear: { //关闭弹窗清楚选择
				type: Boolean,
				default: false
			},
			isCheck: {
				type: Boolean,
				default: false
			},
			isRadio: {
				type: Boolean,
				default: false
			},
			classTag: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
			isHighSchool: {
				type: Boolean,
				default: false
			},
			classChecked: {
				type: Array,
				default: () => {
					return [];
				}
			},
			schoolInfo: {
				type: Object,
				default: () => {
					return {};
				}
			},
			isHighSchoolData: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				noDataTag: false,
				ready: false,
				searchText: '',
				props: {
					label: 'name',
					children: 'children',
					isLeaf: 'leaf'
				},
				selectedData: [],
				treeData: [],
				checkedKeys: []
			};
		},
		created() {
			if (this.isHighSchool) {
				this.getTreeData()
			}
		},
		methods: {
			loadNode(node, resolve) {
				if (node.level === 0) {
					$ajax
						.postForm({
							url: `${hostEnv.protal_api_11002}/grade/manage/list`,
							params: {
								schoolYearId: this.schoolInfo.schoolYearId,
								schoolCode: this.schoolInfo.schoolCode
							}
						})
						.then(res => {
							if (!res.data || res.data.list.length === 0) {
								this.noDataTag = true;
								return;
							}
							let gradeArr = [];
							res.data.list.forEach(ele => {
								gradeArr.push({
									name: ele.name,
									gradeCode: ele.code,
									id: ele.code,
									type: '1',
									disabled: this.disabled
								});
							});
							this.$tools.goNext(() => {
								resolve(gradeArr);
							});
						})
						.catch(() => {
							this.noDataTag = true;
						});
				} else {
					if (node.level > 1) return resolve([]);
					$ajax
						.post({
							url: `${hostEnv.protal_api_11002}/classManage/list`,
							params: {
								schoolYearId: this.schoolInfo.schoolYearId,
								schoolCode: this.schoolInfo.schoolCode,
								gradeCode: node.data.gradeCode
							}
						})
						.then(res => {
							if (!res.data || res.data.list.length === 0) {
								resolve([]);
								return;
							}
							let classArr = [];
							res.data.list.forEach(ele => {
								classArr.push({
									name: ele.className,
									className: ele.className,
									classCode: ele.classCode,
									leaf: true,
									id: ele.classCode,
									gradeCode: ele.gradeCode,
									gradeName: ele.gradeName,
									schoolYearId: ele.schoolYearId,
									type: '2',
									disabled: this.disabled
								});
							});
							this.$tools.goNext(() => {
								resolve(classArr);
								this.setCheckedKeys();
							});
						});
				}
			},
			setCheckedKeys() {
				if (this.$refs.tree && !this.isRadio) {
					this.$refs.tree.setCheckAll(false);
				}
				let arr = [];
				this.classChecked.forEach(el => {
					arr.push(el.classCode);
				});
				this.$nextTick(() => {
					this.checkedKeys = arr;
				});
			},
			handleCheck(obj) {
				console.log(obj)
				this.selectedData = obj.checkedNodes;
			},
			close() {
				this.searchText = ''
				if (this.isClear && this.$refs.tree) {
					this.$refs.tree.setCheckAll(false)
				}
				this.$emit('close');
			},
			confirm() {
				this.searchText = ''
				if (this.isClear && this.$refs.tree) {
					this.$refs.tree.setCheckAll(false)
				}
				if (this.isHighSchoolData) {
					this.$emit('confirm', this.selectedData.filter(item => item.type === '2'));
				} else {
					this.$emit('confirm', this.selectedData.filter(item => item.type === '2'));
				}
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			// 深层递归
			newTreeData(data) {
				data.forEach(item => {
					if (item.gradeName) {
						item.gradeName = item.gradeName + '级'
					}
					item.children = item.subjectNodeDtos || item.classNodeDtos
					item.name = item.classCode ? item.className : item.subjectCode ? item.subjectName : item.gradeName
					item.id = item.classCode ? item.classCode : item.subjectCode ? (item.gradeCode + '^' + item.subjectCode) : item.gradeCode
					item.type = item.classCode ? '2' : item.subjectCode ? '1' : '0'
					if (item.subjectNodeDtos && item.subjectNodeDtos.length > 0) {
						this.newTreeData(item.subjectNodeDtos)
					}
					if (item.classNodeDtos && item.classNodeDtos.length > 0) {
						this.newTreeData(item.classNodeDtos)
					}
				})
				return data
			},
			getTreeData() {
				$ajax
					.get({
						url: `${hostEnv.protal_api_8092}/class/manage/node?schoolCode=${this.schoolInfo.schoolCode}`
					})
					.then(res => {
						if (!res.data || res.data.length === 0) {
							this.noDataTag = true;
							return;
						}
						this.noDataTag = false;
						this.treeData = this.newTreeData(res.data)
						this.ready = true;
					})
					.catch(() => {
						this.noDataTag = true;
					});
			}
		}
	};
</script>
<style lang="scss">
	.footer {
		position: fixed;
		z-index: 998;
		left: 0;
		bottom: 0;
		background: #ffffff;
		width: 100%;
		height: 100rpx;
		overflow: hidden;
		box-shadow: 1rpx 1rpx 8px #c7c7c7;
	}

	.footer .button {
		width: 50%;
		border: none;
		text-align: center;
		float: right;
		font-size: 30rpx;
		border-radius: 0;
		height: 100rpx;
		line-height: 100rpx;
	}

	.footer .button:after {
		width: 0;
		height: 0;
	}

	.footer .button.confirm {
		background: #2979ff;
		color: #fff;
	}

	.footer .button.cancle {
		background: #f5f5f5;
	}

	.ly-search {
		margin: 0rpx 30rpx;
		padding-top: 20rpx;
		padding-bottom: 15rpx;
		border-bottom: 1px solid #ededed;
	}

	uni-input {
		font-size: 28rpx;
	}

	.scroll-h {
		height: calc(100vh - 160rpx);
	}
</style>
