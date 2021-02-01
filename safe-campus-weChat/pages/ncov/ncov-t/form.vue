<template>
  <view>
    <scroll-view scroll-y="true"  class="scroll-h u-bg-fff">
      <view class="u-fx-ac u-bd-b item-list">
        <view class="tip">姓名：</view>
        <view class="u-fx-f1 u-fx-je u-content-color"> 
					{{formData.userName}}
				</view>
      </view>
			<view class="u-fx-ac u-bd-b item-list">
        <view class="tip">体温：</view>
        <view class="u-fx-f1"><input class="item-input u-font-01 u-content-color u-tx-r" v-model="formData.temperature" placeholder="请输入测量值，正常值为36.3~37.3" /></view>
      </view>
    </scroll-view>
		<view class="submit-btn">
			<u-button type="primary" @click="submitForm">提交</u-button>
		</view>
  </view>
</template>

<script>
	import eventBus from '@u/eventBus'
	import validateForm from '@u/validate'
	import { actions, store } from './store/index'
	const yzForm = {
		userName: '请输入用户名',
		temperature: '请输入测量值，正常值为36.3~37.3'
	}
	export default {
		data() {
			return {
				formData: {
					userName: '',
					temperature: ''
				}
			}
		},
		mounted() {
			this.formData.userName = store.userInfo.userName
		},
    methods: {
			async submitForm () {
				validateForm(yzForm, this.formData, () => {
					console.log(this.formData)
					const req = {
						...this.formData,
						userCode: store.userInfo.userCode,
						userType: store.userInfo.typeCode,
						schoolCode: store.userInfo.schoolCode,
						reportName: store.userInfo.userName,
					}
					actions.addReport(req).then(res=>{
						this.$tools.toast('提交成功', 'success')
						this.$tools.goNext(() => {
						  eventBus.$emit('getList')
						  this.$tools.goBack()
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
			content: "*";
			top: 30rpx;
			color: $u-type-error;
			font-weight: bold;
			left: 8rpx;
		}
  }
  .item-input {
    width: 100%;
    color: $u-content-color;
  }
  .submit-btn {
    height: 120rpx;
		padding: 20rpx
  }
</style>
