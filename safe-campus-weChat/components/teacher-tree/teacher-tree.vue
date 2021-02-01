<template>
	<view class="">
		<ly-drawer :visible="teacherTag" mode="right" width="80%" @close="close">
			<no-data msg="暂无教职工数据~" v-if="noDataTag"></no-data>
			<view v-else>
				<view class="ly-search"><input v-model="searchText" placeholder="输入教职工姓名进行过滤" /></view>
				<scroll-view :scroll-y="true" class="scroll-h">
					<ly-tree
						ref="tree"
						:filter-node-method="filterNode"
						:default-checked-keys="checkedKeys"
						:props="props"
						:load="loadNode"
						lazy
						:show-checkbox="isCheck"
						:show-radio="isRadio"
						node-key="id"
						@check="handleCheck"
						defaultExpandAll
						check-on-click-node
						highlight-current
						childVisibleForFilterNode
						:checkOnlyLeaf="isRadio"
					></ly-tree>
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
		LyDrawer,
		LyTree,
		noData
	},
	watch: {
		searchText(val) {
			this.$refs.tree.filter(val);
		},
		classChecked(val) {
			this.selectedData = val;
		}
	},
	props: {
		isClear: {
			//关闭弹窗清楚选择
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
		teacherTag: {
			type: Boolean,
			default: false
		},
		disabled: {
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
		}
	},
	data() {
		return {
			noDataTag: false,
			searchText: '',
			props: {
				label: 'name',
				children: 'children',
				isLeaf: 'leaf'
			},
			selectedData: [],
			checkedKeys: []
		};
	},
	methods: {
		loadNode(node, resolve) {
			if (node.level === 0) {
				$ajax
					.getUrl({
						url: `${hostEnv.protal_api_11002}/school/org/getSchoolRoot/${this.schoolInfo.schoolCode}`
					}, false)
					.then(res => {
						if (!res.data) {
							this.noDataTag = true;
							resolve([]);
							return;
						}
						let orgArr = [];
						if (res.data.orgChilds.length > 0) {
							res.data.orgChilds.forEach(ele => {
								orgArr.push({
									name: ele.name,
									orgCode: ele.code,
									id: ele.code,
									type: '1',
									disabled: this.disabled
								});
							});
						}
						$ajax
							.post({
								url: `${hostEnv.protal_api_11002}/userinfo/teacher/user/node/teachers`,
								params: {
									orgCode: res.data.code,
									schoolCode: this.schoolInfo.schoolCode,
									page: 1,
									size: 99999
								}
							},false)
							.then(result => {
								if (result.data.list.length > 0) {
									orgArr.push({
										name: '其他',
										id: res.data.id,
										type: '3',
										orgCode: res.data.code,
										disabled: this.disabled
									});
								}
								this.$tools.goNext(() => {
									resolve(orgArr);
								});
							});
					})
					.catch(() => {
						this.noDataTag = true;
					});
			} else {
				if (node.level > 1) return resolve([]);
				let res = null;
				let req = {
					orgCode: node.data.orgCode,
					schoolCode: this.schoolInfo.schoolCode,
					page: 1,
					size: 99999
				};
				if (node.data.type === '3') {
					res = $ajax.post({
						url: `${hostEnv.protal_api_11002}/userinfo/teacher/user/node/teachers`,
						params: req
					},false);
				} else {
					res = $ajax.post({
						url: `${hostEnv.protal_api_11002}/userinfo/teacher/user/queryTeacherInfo`,
						params: req
					},false);
				}
				res.then(res => {
					if (!res.data || res.data.list.length === 0) {
						resolve([]);
						return;
					}
					let teaArr = [];
					res.data.list.forEach(ele => {
						teaArr.push({
							type: '2',
							name: ele.userName,
							userName: ele.userName,
							userCode: ele.userCode,
							leaf: true,
							id: ele.userCode,
							orgCode: ele.orgCode,
							orgName: ele.orgName,
							mobile: ele.mobile,
							photoUrl: ele.photoUrl,
							disabled: this.disabled
						});
					});
					this.$tools.goNext(() => {
						resolve(teaArr);
						this.setCheckedKeys();
					});
				});
			}
		},
		setCheckedKeys() {
			if(this.$refs.tree && !this.isRadio){
				this.$refs.tree.setCheckAll(false);
			}
			let arr = [];
			this.classChecked.forEach(el => {
				arr.push(el.userCode);
			});
			this.$nextTick(() => {
				this.checkedKeys = arr;
			});
		},
		handleCheck(obj) {
			this.selectedData = obj.checkedNodes;
		},
		close() {
			this.searchText = '';
			if (this.isClear && this.$refs.tree) {
				this.$refs.tree.setCheckedKeys([]);
			}
			this.$emit('close');
		},
		confirm() {
			this.searchText = '';
			this.$emit('confirm', this.selectedData.filter(item => item.type === '2'));
			if (this.isClear && this.$refs.tree) {
				this.$refs.tree.setCheckedKeys([]);
			}
		},
		filterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
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
