<template>
	<view class="u-page">
		<view class="list">
			<view class="head"><uni-search-bar class="search" placeholder="输入姓名/手机号/工号搜索" @confirm="search"></uni-search-bar></view>
			<view class="th u-fx-jsa u-fx-ac u-fx-jc title_">
				<text class="left">选择</text>
				<view class="u-checkbox__label">
					<text>姓名</text>
					<text>工号</text>
					<text>手机号</text>
				</view>
			</view>
			<scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
				<u-checkbox-group class="u-fx-ver" width="100%">
					<label class="tbody u-bd-b u-fx-jsa" v-for="(item, index) in dataList" :key="index">
						<u-checkbox @change="checkBox" v-model="item.checked" class="u-fx-jsb" :name="`${item.userCode}^${item.userName}`">
								<text>{{ item.userName }}</text>
								<text>{{ item.workNo || '--' }}</text>
								<text>{{ item.mobile }}</text>
						</u-checkbox>

					</label>
				</u-checkbox-group>
			</scroll-view>
		</view>
		<view class="submit-box u-fx">
			<view class="btn1" @click="cancel()">取消</view>
			<view class="btn2" @click="addInfo()">保存</view>
		</view>
	</view>
</template>

<script>
import eventBus from '@u/eventBus'
import { actions, store } from '../store/index';
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
export default {
	components: {
		uniSearchBar
	},
	data() {
		return {
			dataList: [],
			userInfoList: [],
			pageList: {
				page: 1,
				size: 15
			},
			morePage: false,
			ruleGroupCode: '',
			userGroupCode: '',
			keyword: '',
			checkList: []
		};
	},
	watch: {
		checkList: {
			handler: function(val, oldval) {
				this.userInfoList = [];
				val.map(el => {
					this.userInfoList.push({
						userCode: el.split('^')[0],
						userName: el.split('^')[1],
						userType: '1'
					});
				});
				console.log(this.userInfoList);
			},
			deep: true
		}
	},
	async mounted() {
		this.ruleGroupCode = this.$tools.getQuery().get('ruleGroupCode');
		this.userGroupCode = this.$tools.getQuery().get('userGroupCode');
		await this.hasUser();
		this.showList();
	},
	methods: {
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				...this.pageList,
				keyword: this.keyword,
				orgCode: '',
				schoolCode: store.userInfo.schoolCode
			};
			const res = await actions.getOrgUser(req);
			res.data.list.forEach(ele => {
				this.userInfoList.forEach(item => {
					if (ele.userCode === item.userCode) {
						ele.checked = true;
					}
				});
			});
			if (tag) {
				this.dataList = this.dataList.concat(res.data.list);
			} else {
				this.dataList = res.data.list;
			}
			this.morePage = res.data.hasNextPage;
		},
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
		async hasUser(tag = false) {
			const req = {
				schoolCode: store.userInfo.schoolCode,
				ruleGroupCode: this.ruleGroupCode,
				userGroupCode: this.userGroupCode
			};
			const res = await actions.getgroupuserList(req);
			res.data.list.forEach(ele => {
				this.userInfoList.push({
					userCode: ele.userCode,
					userName: ele.userName,
					userType: ele.userType
				});
			});
			this.checkList = res.data.list.map(el => {
				return `${el.userCode}^${el.userName}`;
			});
		},
		cancel() {
			this.userInfoList = [];
			this.checkList = [];
			eventBus.$emit('getList')
			this.$tools.goBack();
			/* this.$tools.redirectTo({
				url: './detail?ruleGroupCode=' + this.ruleGroupCode + '&userGroupCode=' + this.userGroupCode,
				title: '查看人员列表'
			}); */
		},
		checkBox(e) {
			if (e.value) {
				this.checkList.push(e.name);
			} else {
				this.checkList.splice(this.checkList.indexOf(e.name), 1);
			}
		},
		addInfo() {
			const req = {
				schoolCode: store.userInfo.schoolCode,
				ruleGroupCode: this.ruleGroupCode,
				userGroupCode: this.userGroupCode,
				userType: '1'
			};
			// 去重
			let object = {};
			let objres = [];
			objres = this.userInfoList.reduce((item, next) => {
				object[next.userCode] ? '' : (object[next.userCode] = true && item.push(next));
				return item;
			}, []);
			req.userInfoList = objres;
			console.log(3, req.userInfoList);
			actions.addgroupuserList(req).then(res => {
				this.$tools.toast('操作成功', 'success');
				this.$tools.goNext(() => {
					this.userInfoList = [];
					eventBus.$emit('getList')
					this.$tools.goBack();
/* 					this.$tools.redirectTo({
						url: './detail?ruleGroupCode=' + this.ruleGroupCode + '&userGroupCode=' + this.userGroupCode,
						title: ''
					}); */
				});
			});
		},
		search(value) {
			console.log(value);
			this.keyword = value.value;
			this.showList();
		}
	}
};
</script>

<style lang="scss">
.scroll-h {
	height: calc(100vh - 330rpx);
}
.head {
	height: 100rpx;
}
.submit-box {
	height: 100rpx;
	width: 100%;
	position: fixed;
	bottom: 0;
	.btn1 {
		width: 50%;
		line-height: 100rpx;
		text-align: center;
		letter-spacing: 8rpx;
		background-color: #fff;
		color: #000;
		border-radius: $u-border-radius;
	}
	.btn2 {
		width: 50%;
		line-height: 100rpx;
		text-align: center;
		letter-spacing: 8rpx;
		background-color: $u-type-primary;
		color: #fff;
		border-radius: $u-border-radius;
	}
}
.title_ {
	height: 80rpx;
}
.list {
	padding: 25rpx 20rpx;
	font-size: 28rpx;
	.th {
		background: #7b92f5;
		padding: 20rpx;
		border-radius: 8rpx;
		color: #fff;
	}
	.tbody {
		position: relative;
		padding: 25rpx 20rpx;
		background: $uni-bg-color;
	}
	.tbody:nth-child(even) {
		background: $u-bg-color;
	}
	.left {
		width: 10%;
		text-align: center;
	}
}
.u-checkbox-group,.u-checkbox {
	width: 100%;
}
/deep/ .u-checkbox__label{
	width: 90%;
	margin: 0;
	display: flex;
	justify-content: space-between;	
	text{
		text-align: center;
	}
	text:nth-child(1){
		width:30%;
	}
	text:nth-child(2){
		width:30%;
	}
	text:nth-child(3){
		width:40%;
	}
}
/deep/ .u-checkbox__icon-wrap{
	width: 10%;
}
/deep/ .u-checkbox__icon{
	margin:0 auto;
}
</style>
