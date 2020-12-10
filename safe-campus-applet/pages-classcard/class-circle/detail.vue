<template>
	<view class="" @tap="closeActive">
		<scroll-view scroll-y="true" class="scroll-h">
			<detail-show :newsList="dataList" :userType="userType" @showLike="showLike" @handleComment="handleComment" :showNewTag="false" @refresh="refresh"></detail-show>
			<!-- 底部聊天输入框-->
			<comment-input :showInputTag="showInput" @sendMsg="sendMsg" @blurInput="blurInput"></comment-input>
		</scroll-view>
	</view>
</template>

<script>
import DetailShow from './component/DetailShow.vue';
import CommentInput from './component/CommentInput.vue';
import { store, actions } from '@store';
export default {
	name: 'detail',
	components: {
		DetailShow,
		CommentInput
	},
	data() {
		return {
			dataList: [],
			userType: 1,
			showInput: false,
			id: ''
		};
	},
	computed: {
		userInfo: () => store.userInfo,
		currentUserType: () => store.currentUserType,
		currentBindClass: () => store.currentBindClass,
		currentBindStudent: () => store.currentBindStudent
	},
	onLoad: function (options) {
		this.id = options.id;
		this.userType = options.userType
	},
	mounted() {
		if(this.id){
			this.showData();
		}
	},
	methods: {
		async showData() {
			const res = await actions.getMomentDetail(this.id);
			this.dataList = [res.data];
		},
		closeActive() {
			this.dataList.forEach(el => {
				el.showAction = false;
			});
		},
		//开启点赞评论
		showLike(index){
			this.dataList = this.dataList.map((el, i) => {
				return {
					...el,
					showAction: i === index ? !el.showAction : false,
					isLike: i === index ? el.likeList.findIndex(list => list.createUsercode === this.userCode) !== -1 : false
				}
			})
		},
		//点击评论 唤出输入框和键盘
		handleComment(item, comment) {
			this.showInput = true;
			this.momontInfo = item;
			this.commentInfo = comment;
		},
		refresh(value) {
			if (value === 'delete') {
				this.$tools.navTo({
					url: `./index`
				});
			} else {
				this.showData();
			}
		},
		//失去焦点触发
		blurInput() {
			this.showInput = false;
			this.momontInfo = {};
			this.commentInfo = {};
			uni.hideKeyboard();
		},
		//评论
		async sendMsg(value) {
			if (!this.$u.trim(value)) {
				this.$tools.toast('请输入评论内容');
				return;
			}
			const req = {
				schoolCode: this.userInfo.schoolCode,
				classCode: this.currentUserType === '4' ? this.currentBindClass.classCode : this.currentBindStudent.classCode,
				gradeCode: this.currentUserType === '4' ? this.currentBindClass.gradeCode : this.currentBindStudent.gradeCode,
				createUsercode: this.userInfo.userCode,
				createUsername: this.userInfo.userName,
				createPhotoUrl: this.userInfo.photoUrl,
				momentsId: this.momontInfo.id,
				msg: value,
				category: this.currentUserType === '4' ? 1 : 3
			};
			if (this.commentInfo && this.commentInfo.createUsercode !== (this.currentUserType === '4' ? this.currentBindClass.userCode : this.currentBindStudent.userCode)) {
				req.replyPhotoUrl = this.commentInfo.createPhotoUrl
				req.replyUsercode = this.commentInfo.createUsercode
				req.replyUsername = this.commentInfo.createUsername
				req.replyRelationship = this.commentInfo.createRelationship
				req.replyChildrenName = this.commentInfo.childrenName
				req.replyChildrenCode = this.commentInfo.childrenCode
			}
			if(this.userType === 3){
				req.childrenCode = this.currentBindStudent.userCode,
				req.childrenName = this.currentBindStudent.userName,
				req.createRelationship = this.currentBindStudent.relationship
			}
			console.log(req);
			const res = await actions.addComment(req);
			this.$tools.toast('评论成功', 'success');
			this.showInput = false;
			this.$tools.goNext(() => {
				this.showData();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh);
}
</style>
