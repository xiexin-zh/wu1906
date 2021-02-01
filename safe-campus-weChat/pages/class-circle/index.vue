<template>
	<view class="" @tap="closeActive">
		<choose-child v-if="userType === 3" @change="childInfo"></choose-child>
		<view class="top u-fx-jsb u-padd-20">
			<view class="dropdown u-fx">
				<ms-dropdown-menu v-if="userType !== 3 && showClass"><ms-dropdown-item v-model="value0" :list="classList" :title="defTitle"></ms-dropdown-item></ms-dropdown-menu>
			</view>
			<u-icon class="u-icon-46 camera u-mar-r10" name="camera-fill" color="white" @tap="goAdd"></u-icon>
		</view>
		<scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
			<y-refresh ref="mixPulldownRefresh" @refresh="onPulldownReresh" class="u-auto">
				<no-data class="u-mar-t20" v-if="dataList.length === 0" msg="暂无数据,下拉刷新~"></no-data>
				<detail-show v-else ref="detailShow" :newsList="dataList" :unReadCommentInfo="unReadCommentInfo" @handleComment="handleComment" :userType="userType" @refresh="refresh"></detail-show>
			</y-refresh>
		</scroll-view>
		<!-- 底部聊天输入框-->
		<comment-input :showInputTag="showInput" @sendMsg="sendMsg" @blurInput="blurInput"></comment-input>
	</view>
</template>

<script>
import wxApi from '@u/wxApi'
import chooseChild from '@/components/choose-child/choose-child.vue';
import eventBus from '@u/eventBus';
import noData from '@/components/no-data/no-data.vue';
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
import YRefresh from './component/y-Refresh.vue';
import { store, actions } from './store/index.js';
import DetailShow from './component/DetailShow.vue';
import CommentInput from './component/CommentInput.vue';
export default {
	name: 'ClassCircle',
	components: {
		msDropdownMenu,
		msDropdownItem,
		YRefresh,
		noData,
		DetailShow,
		CommentInput,
		chooseChild
	},
	data() {
		return {
			currentClass: uni.getStorageSync('currentClass') || 0,
			userType: 2, // 1.班主任，2.教职工，3.家长
			value0: '',
			classList: [],
			defTitle: '',
			pageList: {
				page: 1,
				size: 10
			},
			morePage: false,
			showClass: false,
			dataList: [],
			unReadCommentInfo: {},
			showInput: false,
			content: '',
		};
	},
	watch: {
		value0(val, oldval) {
			if (this.userType === 3) {
				return;
			}
			if (val !== oldval) {
				let choose =  this.classList.filter(el => {
					return el.value === val;
				})[0]
				this.defTitle = choose.text;
				this.classCode = val;
				if ((store.isBZR && val === store.isBZR.classCode) || choose.isBZR) {
					this.userType = 1;
				} else {
					this.userType = 2;
				}
				console.log(this.userType)
				uni.setStorageSync('bindInfo', {
					...this.classList.filter(el => {
						return el.value === val;
					})[0],
					classCode: val
				});
				eventBus.$on('getList', () => {
					this.showList();
				});
				this.showList();
			}
		}
	},
	mounted () {
		wxApi.getConfig('protal-card')
	},
	async created() {
		if (store.userInfo.typeCode === '4') {
			this.userType = 2;
			this.classList = JSON.parse(uni.getStorageSync('protal')).teachClassList;
			if(this.classList.length === 0){
				this.$tools.toast('请绑定班级')
				return
			}
			this.userCode = store.userInfo.userCode
			this.userName = store.userInfo.userName
			this.classCode = this.classList[this.currentClass].value
			this.className = this.classList[this.currentClass].className
			this.gradeName = this.classList[this.currentClass].gradeName
			this.gradeCode = this.classList[this.currentClass].gradeCode
			this.photoUrl = store.userInfo.photoUrl
			this.showClass = true;
			this.defTitle = this.classList[this.currentClass].text;
			this.value0 = this.classList[this.currentClass].value;
			uni.setStorageSync('bindInfo', {
				...this.classList[this.currentClass],
				classCode: this.classList[this.currentClass].value
			});
		} else if (store.userInfo.typeCode === '16') {
			this.userType = 3;
			this.classCode = store.childList[0].classCode;
			this.gradeCode = store.childList[0].gradeCode;
			this.userCode = store.childList[0].userCode;
			this.userName = store.childList[0].userName;
			this.className = store.childList[0].className;
			this.gradeName = store.childList[0].gradeName;
			this.relationship = store.childList[0].relationship;
			this.photoUrl = store.childList[0].photoUrl
			uni.setStorageSync('bindInfo', {
				...store.childList[0]
			});
			eventBus.$on('getList', () => {
				this.showList();
			});
			this.showList();
		}
	},
	methods: {
		childInfo(item) {
			if (item.userCode !== this.userCode) {
				this.userCode = item.userCode;
				this.gradeCode = item.gradeCode;
				this.classCode = item.classCode;
				this.userName = item.userName
				this.photoUrl = item.photoUrl
				this.relationship = item.relationship;
				this.className = item.className;
				this.gradeName = item.gradeName;
				this.$refs.detailShow.userCode = item.userCode;
				this.showList();
				uni.setStorageSync('bindInfo', {
					...item
				});
			}
		},
		//下拉刷新
		onPulldownReresh() {
			this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
			this.showList();
		},
		refresh(){
			this.showList();
		},
		async showList(tag = false) {
			if (tag) {
				this.pageList.page += 1;
			} else {
				this.pageList.page = 1;
			}
			const req = {
				...this.pageList,
				category: this.userType === 1 ? 1 : 3,
				schoolCode: store.userInfo.schoolCode,
				classCode: this.classCode,
				createUsercode: store.userInfo.userCode,
			};
			if(this.userType === 3){
				req.childrenCode = this.userCode
			}
			console.log(req);
			const res = await actions.getMomentList(req);
			if (tag) {
				this.dataList = this.dataList.concat(res.data.pageInfo.list);
			} else {
				this.dataList = res.data.pageInfo.list;
			}
			this.unReadCommentInfo.lastReplyPhotoUrl = res.data.lastReplyPhotoUrl;
			this.unReadCommentInfo.unReadCommentCount = res.data.unReadCommentCount;
			this.morePage = res.data.pageInfo.hasNextPage;
		},
		loadMore() {
			if (!this.morePage) {
				this.$tools.toast('数据已加载完毕');
				return;
			}
			this.showList(true);
		},
		//评论
		async sendMsg(value) {
			if (!this.$u.trim(value)) {
				this.$tools.toast('请输入评论内容');
				return;
			}
			const req = {
				schoolCode: store.userInfo.schoolCode,
				classCode: this.classCode,
				gradeCode: this.gradeCode,
				createUsercode: store.userInfo.userCode,
				createUsername: store.userInfo.userName,
				createPhotoUrl: this.photoUrl,
				momentsId: this.momontInfo.id,
				msg: value,
				category: this.userType
			};
			if (this.commentInfo && this.commentInfo.createUsercode !== this.userCode) {
				req.replyPhotoUrl = this.commentInfo.createPhotoUrl
				req.replyUsercode = this.commentInfo.createUsercode
				req.replyUsername = this.commentInfo.createUsername
				req.replyRelationship = this.commentInfo.createRelationship
				req.replyChildrenName = this.commentInfo.childrenName
				req.replyChildrenCode = this.commentInfo.childrenCode
			}
			if(this.userType === 3){
				req.childrenCode = this.userCode,
				req.childrenName = this.userName,
				req.createRelationship = this.relationship
			}
			console.log(req);
			const res = await actions.addComment(req);
			this.$tools.toast('评论成功', 'success');
			this.showInput = false;
			this.$tools.goNext(() => {
				this.showList();
			});
		},
		//点击评论 唤出输入框和键盘
		handleComment(item, comment) {
			console.log(comment)
			this.showInput = true;
			this.momontInfo = item;
			this.commentInfo = comment;
		},
		//失去焦点触发
		blurInput() {
			this.showInput = false;
			this.momontInfo = {};
			this.commentInfo = {};
			uni.hideKeyboard();
		},
		closeActive() {
			this.dataList.forEach(el => {
				el.showAction = false;
			});
		},
		goAdd() {
			this.$tools.actionsheet(
				[
					{
						key: 1,
						label: '照片'
					},
					{
						key: 2,
						label: '视频'
					}
				],
				item => {
					this.$tools.navTo({
						url: `./form?type=${item.key}&category=${this.userType}`
					});
				}
			);
			/* ; */
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	margin-top: -60rpx;
	height: calc(100vh - 80rpx);
}

.top {
	height: 140rpx;
	background: url(/mobile-img/class-circle-top.png) no-repeat;
	background-size: 100% 140rpx;
	position: relative;
	.camera {
		height: 60rpx;
	}
	.dropdown {
		height: 60rpx;
		/deep/ .dropdown-item__selected {
			width: 300rpx;
			height: 60rpx;
			background: url(/mobile-img/class-circle-button.png) no-repeat;
			background-size: 300rpx 60rpx;
			.selected__name {
				color: $u-type-white;
				font-size: $u-font-03;
			}
		}
		/deep/ .iconfont {
			color: $u-type-white;
		}
	}
}
.u-icon-46{
	font-size: 46rpx;
}
</style>
