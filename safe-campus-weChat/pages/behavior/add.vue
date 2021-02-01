<template>
  <view>
    <scroll-view scroll-y="true"  class="scroll-h u-bg-fff">
			<view class="u-bd-b item-list">
			  <view class="tip">{{name}} :</view>
			  <view class="u-fx-f1">
					<an-upload-img total="9" v-model="formData.urlList" style="margin: 20rpx"></an-upload-img>
			  </view>
			</view>
			<view class="u-bd-b item-list">
			  <view>文字描述：</view>
			  <view class="u-fx-f1">
					<textarea class="item-text-area" v-model="formData.content" placeholder="请输入文字描述"  maxlength="200"/>
				</view>
			</view>
    </scroll-view>
		<view class="submit-btn">
			<u-button type="primary" @click="submitForm">提交</u-button>
		</view>
  </view>
</template>

<script>
	import validateForm from '@u/validate'
	import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
	import { store, actions } from './store'
	const yzForm = {
		urlList: '请上传图片'
	}
	export default {
		data() {
			return {
				roleTag: false,
				birthdayTag: false,
				formData: {
					urlList: []
				},
				studentList: [],
				appraiseItemId: '',
				name: ''
			}
		},
		components: {
			anUploadImg
		},
		mounted() {
			this.appraiseItemId = this.$tools.getQuery().get('id')
			this.name = this.$tools.getQuery().get('name')
			this.studentList = JSON.parse(this.$tools.getQuery().get('studentInfo'))
			console.log(this.studentList)
		},
    methods: {
		  submitForm () {
				validateForm(yzForm, this.formData, () => {
					this.formData.schoolCode = store.userInfo.schoolCode
					this.formData.appraiserCode = store.userInfo.userCode
					this.formData.appraiserName = store.userInfo.userName
					this.formData.appraiseItemId = this.appraiseItemId
					this.formData.base64List = this.formData.urlList.map(el => {
						return el.url
					})
					const req  = {
						...this.formData,
						studentList:	this.studentList,
						studentUrl:	this.studentList.photoUrl,
						schoolCode: store.userInfo.schoolCode,
						appraiserCode: store.userInfo.userCode,
						appraiserName: store.userInfo.userName,
						appraiseItemId: this.appraiseItemId
					}
					actions.addBehavior(req).then(res=>{
						this.$tools.toast("操作成功")
						this.$tools.goNext(() => {
							this.$tools.navTo({
								url: './record'
							})
						})
					})
				})
			}
    }
	}
</script>

<style lang="scss">
  .scroll-h {
    height: calc(100vh - 120rpx);
  }
  .item-list {
    padding: 25rpx 15rpx 25rpx 25rpx;
		.tip::before {
			position: absolute;
			z-index: 99;
			content: "|";
			top: 22rpx;
			color: $u-type-primary;
			font-weight: bolder;
			left: 8rpx;
		}
  }
	.item-text-area {
		height: 120rpx;
		width: 100%;
		line-height: 40rpx;
		padding-top: 15rpx;
		color: $u-content-color;
		font-size: 24rpx;
	}
  .submit-btn {
    height: 120rpx;
		padding: 20rpx
  }
	.item-text-area{
		height: 200rpx;
	}
</style>
