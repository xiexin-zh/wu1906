<template>
	<view class="" @click="closeActive">
		<view class="top u-fx-je u-padd-20" :style="{backgroundSize: dataList.length === 0 ? '100% 100px' : '100% 140px'}">
			<u-icon class="u-icon-46 camera u-mar-r10" name="camera-fill" color="white" @tap="goAdd"></u-icon>
		</view>
		<scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
			<no-data class="u-mar-t20" v-if="dataList.length === 0" msg="暂无数据,下拉刷新~"></no-data>
			<detail-show v-else ref="detailShow" :newsList="dataList" :unReadCommentInfo="unReadCommentInfo" @handleComment="handleComment" @showLike="showLike" :userType="userType" @refresh="refresh"></detail-show>
		</scroll-view>
		<!-- 底部聊天输入框-->
		<comment-input v-if="showInput" :showInputTag="showInput" @sendMsg="sendMsg" @blurInput="blurInput"></comment-input>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import NoData from '../component/NoData.vue'
import { store, actions } from '@store';
import DetailShow from './component/DetailShow.vue';
import CommentInput from './component/CommentInput.vue';
export default {
	name: 'ClassCircle',
	components: {
		NoData,
		DetailShow,
		CommentInput
	},
	computed: {
		userInfo: () => store.userInfo,
		currentUserType: () => store.currentUserType,
		currentBindClass: () => store.currentBindClass,
		currentBindStudent: () => store.currentBindStudent
	},
	data() {
		return {
			userType: 1,
			pageList: {
				page: 1,
				size: 20
			},
			morePage: false,
			dataList: [],
			unReadCommentInfo: {},
			showInput: false
		};
	},
	onPullDownRefresh() {
		this.pageList.page = 1
		this.showList()
		setTimeout(() => {
			uni.stopPullDownRefresh()
		}, 1500);
	},
	async created() {
		if (this.currentUserType === '4') {
			this.userType = 1
			if(!this.currentBindClass.classCode){
				this.$tools.toast('请绑定班级')
				return
			}
			if(this.currentBindClass.isBzr){
				this.userType = 2
			}
			this.userCode = this.userInfo.userCode
			this.userName = this.userInfo.userName
			this.classCode = this.currentBindClass.classCode
			this.className = this.currentBindClass.className
			this.gradeName = this.currentBindClass.gradeName
			this.gradeCode = this.currentBindClass.gradeCode
			this.photoUrl = this.userInfo.photoUrl
		} else if (this.currentUserType === '16') {
			this.userType = 3
			if(!this.currentBindStudent.userCode){
				this.$tools.toast('请绑定学生')
				return
			}
			this.classCode = this.currentBindStudent.classCode;
			this.gradeCode = this.currentBindStudent.gradeCode;
			this.userCode = this.currentBindStudent.userCode;
			this.userName = this.currentBindStudent.userName;
			this.className = this.currentBindStudent.className;
			this.gradeName = this.currentBindStudent.gradeName;
			this.relationship = this.currentBindStudent.relationship;
			this.photoUrl = this.currentBindStudent.photoUrl
		}
		eventBus.$on('getList', () => {
			this.showList();
		});
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
				category: this.currentUserType === '4' ? 1 : 3,
				schoolCode: this.userInfo.schoolCode,
				classCode: this.classCode,
				createUsercode: this.userInfo.userCode,
			};
			if(this.currentUserType === '16'){
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
		refresh(){
			this.showList();
		},
		//开启点赞评论
		showLike(index){
			this.dataList = this.dataList.map((el, i) => {
				return {
					...el,
					showAction: i === index ? !el.showAction : false,
					isLike: el.likeList.findIndex(list => list.createUsercode === this.userCode) !== -1
				}
			})
		},
		//评论
		async sendMsg(value) {
			if (!this.$u.trim(value)) {
				this.$tools.toast('请输入评论内容');
				return;
			}
			const req = {
				schoolCode: this.userInfo.schoolCode,
				classCode: this.classCode,
				gradeCode: this.gradeCode,
				createUsercode: this.userInfo.userCode,
				createUsername: this.userInfo.userName,
				createPhotoUrl: this.photoUrl,
				momentsId: this.momontInfo.id,
				msg: value,
				category: this.currentUserType === '4' ? 1 : 3
			};
			if (this.commentInfo && this.commentInfo.createUsercode !== this.userCode) {
				req.replyPhotoUrl = this.commentInfo.createPhotoUrl
				req.replyUsercode = this.commentInfo.createUsercode
				req.replyUsername = this.commentInfo.createUsername
				req.replyRelationship = this.commentInfo.createRelationship
				req.replyChildrenName = this.commentInfo.childrenName
				req.replyChildrenCode = this.commentInfo.childrenCode
			}
			if(this.currentUserType === '16'){
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
			uni.showActionSheet({
			    itemList: ['图片', '视频'],
			    success: (action) => {
						this.$tools.navTo({
							url: `./form?type=${action.tapIndex}`
						});
					}
				})
		}
	}
};
</script>

<style lang="scss" scoped>
.top {
	height: 140rpx;
	background: url(http://canpointtest.com/mini-img/class-circle-top.png) no-repeat;
	background-size: 100% 140rpx;
	.camera {
		height: 60rpx;
	}
}
.scroll-h{
	margin-top: -60rpx;
	height: calc(100vh - 80rpx);
}
.u-icon-46{
	font-size: 46rpx;
}
</style>
