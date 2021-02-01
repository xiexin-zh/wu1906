<template>
	<view class="" @tap="closeActive">
		<scroll-view scroll-y="true" class="scroll-h">
			<detail-show :newsList="dataList" :userType="userType" @handleComment="handleComment" :showNewTag="false" @refresh="refresh"></detail-show>
			<!-- 底部聊天输入框-->
			<comment-input :showInputTag="showInput" @sendMsg="sendMsg" @blurInput="blurInput"></comment-input>
		</scroll-view>
	</view>
</template>

<script>
import DetailShow from './component/DetailShow.vue';
import CommentInput from './component/CommentInput.vue';
import { store, actions } from './store/index.js';
export default {
	name: 'detail',
	components: {
		DetailShow,
		CommentInput
	},
	data() {
		return {
			dataList: [],
			userType: 0,
			showInput: false
		};
	},
	watch: {},
	async created() {
		this.id = this.$tools.getQuery().get('id');
		this.userType = parseInt(this.$tools.getQuery().get('userType'));
		this.showData();
		console.log(uni.getStorageSync('bindInfo'));
	},
	mounted() {},
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
				schoolCode: store.userInfo.schoolCode,
				classCode: uni.getStorageSync('bindInfo').classCode,
				gradeCode: uni.getStorageSync('bindInfo').gradeCode,
				createUsercode: store.userInfo.userCode,
				createUsername: store.userInfo.userName,
				createPhotoUrl: store.userInfo.photoUrl,
				momentsId: this.momontInfo.id,
				msg: value,
				category: this.userType
			};
			if (this.commentInfo && this.commentInfo.createUsercode !== uni.getStorageSync('bindInfo').userCode) {
				req.replyPhotoUrl = this.commentInfo.createPhotoUrl
				req.replyUsercode = this.commentInfo.createUsercode
				req.replyUsername = this.commentInfo.createUsername
				req.replyRelationship = this.commentInfo.createRelationship
				req.replyChildrenName = this.commentInfo.childrenName
				req.replyChildrenCode = this.commentInfo.childrenCode
			}
			if(this.userType === 3){
				req.childrenCode = uni.getStorageSync('bindInfo').userCode,
				req.childrenName = uni.getStorageSync('bindInfo').userName,
				req.createRelationship = uni.getStorageSync('bindInfo').relationship
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
