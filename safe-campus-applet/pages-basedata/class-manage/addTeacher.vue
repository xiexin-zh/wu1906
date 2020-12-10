<template>
	<view class="add-teacher">
		<view class="form-item u-fx-ac">
			<view>姓名</view>
			<view class="u-fx-f1 u-fx-je u-tips-color">
				{{ userDetail.teacherName }}
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view>性别</view>
			<view class="u-fx-f1 u-fx-je u-tips-color">
			{{ userDetail.gender == 1 ? '男' : '女' }}
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view>编号</view>
			<view class="u-fx-f1 u-fx-je u-tips-color">
				{{ userDetail.userNo || '无' }}
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view>任职科目</view>
			<view class="u-fx-f1 u-fx-je u-tips-color">
			{{ userDetail.subjectName}}
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="form-item u-fx-ac">
			<view>手机号码</view>
			<view class="u-fx-f1 u-fx-je u-tips-color">
				{{ userDetail.mobile}}
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="u-fx-ac u-padd-t u-padd-b u-bd-b">
			<view>头像</view>
			<view class="u-fx-f1 u-fx-je" @tap="seePhoto">
				<u-image :src="userDetail.photoSrc" width="120rpx" height="120rpx" border-radius="10rpx"></u-image>
			</view>
			<view class="rit-arrow"></view>
		</view>
		<view class="u-padd-b30" v-if="currentBindClass.isBzr">
			<view class="primary-btn u-fx-f1 u-mar-t40 u-mar-l40 del-bg" @tap="_removeTeacher">移出班级</view>
		</view>
	</view>
</template>

<script>
	import { store } from '@store'
	import { actions } from '@store'
	import eventBus from '@u/eventBus'
	export default {
		computed: {
			currentBindClass: () => store.currentBindClass,
		},
		mounted () {
		},
		data () {
			return {
				userDetail: {}
			}
		},
		mounted () {
			this.userDetail = uni.getStorageSync('classUserInfo')
		},
		methods: {
		 _removeTeacher () {
				this.$tools.delTip('您确定把该老师移出班级吗?', async () => {
					this.$tools.showLoading('移除中...')
					await actions.removeTeacher(this.userDetail.id)
					this.$tools.toast('移除成功')
					this.$tools.goNext(() => {
						eventBus.$emit('initClass', 0)
						this.$tools.goBack()
					})
				})
			},
			seePhoto () {
				uni.previewImage({
						urls: [this.userDetail.photoSrc],
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-teacher {
		background-color: #fff;
		padding: 20rpx 20rpx;
		.del-bg {
			border: 1px $u-type-error-disabled solid;
			background-color: $u-type-error-dark;
			color:#fff;
		}
	}
</style>
