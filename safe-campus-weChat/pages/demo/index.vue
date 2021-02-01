<template>
  <view>
    <scroll-view @refresherpulling="haha" scroll-y="true"  class="scroll-h">
      <view class="u-fx-ac u-bd-b item-list">
        <view>姓名：</view>
        <view class="u-fx-f1"><input class="item-input" v-model="formData.userName" style="text-align: right;" placeholder="请输入姓名" /></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view>性别：</view>
        <view class="u-fx-f1 u-fx-je">
          <radio-group @change="changeRadio">
            <label><radio value="1" checked="true" />男</label>
            <label class="radio"><radio value="2" />女</label>
          </radio-group>
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view>学号：</view>
        <view class="u-fx-f1 u-fx-je">
          <input class="item-input" v-model="formData.code" style="text-align: right;" placeholder="请输入学号" />
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view>是否已婚：</view>
        <view class="u-fx-f1 u-fx-je">
          <switch @change="switch1Change" />
        </view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view>出生日期：</view>
        <view class="u-fx-f1 u-fx-je">
          <picker mode="date" :value="formData.birthday" @change="bindTimeChange">
              <view class="uni-input">{{formData.birthday}}</view>
          </picker>
        </view>
        <view>></view>
      </view>
      <view class="u-fx-ac u-bd-b item-list">
        <view>角色：</view>
        <view class="u-fx-f1 u-fx-je">
          <picker mode="selector" :value="formData.role" :range="role" @change="chooseRole">
              {{role[formData.role] || '请选择'}}
          </picker>
        </view>
        <view>></view>
      </view>
      <view class="u-bd-b item-list">
        <view>身体状况：</view>
        <view class="u-fx-f1">
          <checkbox-group @change="checkboxChange">
            <view class="checkbox">
              <checkbox value="1" />健康
            </view>
            <view class="checkbox">
              <checkbox value="2" />发烧
            </view>
            <view class="checkbox">
              <checkbox value="3" />咳嗽
            </view>
          </checkbox-group>
        </view>
      </view>
			<view class="u-bd-b item-list">
			  <view>上传图片：</view>
			  <view class="u-fx-f1">
					<an-upload-img total="3" v-model="imgList" style="margin: 20rpx"></an-upload-img>
			  </view>
			</view>
      <view>
        {{JSON.stringify(formData)}}
      </view>
    </scroll-view>
    <view class="submit-box u-fx">
      <view class="btn" @click="confirm">确认框</view>
      <view class="btn" @click="actionsheet">actionsheet</view>
    </view>
  </view>
</template>

<script>
	import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
	export default {
		data() {
			return {
			}
		},
		components: {
			anUploadImg
		},
    computed: {
    },
    async mounted() {
    },
    methods: {
    }
	}
</script>

<style lang="scss">
</style>
