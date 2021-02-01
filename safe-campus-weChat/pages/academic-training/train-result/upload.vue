<template>
  <view class="upload u-fx-ver">
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="item-list">
        <view class="up-title">
          <text class="required">*</text>
          <text>培训心得：</text>
        </view>
        <view class="up-content">
          <textarea
            class="item-input"
            style="font-size: 14px"
            maxlength="100"
            v-model.trim="content"
            placeholder="请输入"
          />
          <view class="length-tip">{{ content.length }}/100</view>
        </view>
      </view>
      <view class="item-list">
        <view class="up-title">
          <view class="title-text">上传附件(限制9张内)：</view>
          <an-upload-img
            total="9"
            :schoolCode="schoolCode"
            v-model="photoList"
          ></an-upload-img>
        </view>
      </view>
    </scroll-view>
    <view class="upload-btn u-fx-ac-jc">
      <u-button style="width: 100%" type="primary" @click="submitForm"
        >提交</u-button
      >
    </view>
  </view>
</template>

<script>
import wxApi from '@u/wxApi'
import anUploadImg from "@/components/an-uploadImg/an-uploadImg";
import { store, actions } from "../store/index.js";
export default {
  name: "TrainResult",
  components: {
    anUploadImg,
  },
  data() {
    return {
      content: "",
      photoList: [],
    };
  },
  computed: {
    schoolCode() {
      return store.userInfo.schoolCode;
    },
  },
  created() {
    this.listId = this.$route.query.id;
  },
  mounted() {
    wxApi.getConfig('protal-academic')
  },
  methods: {
    async submitForm() {
      const req = {
        content: this.content,
        createTime: new Date().getTime(),
        trainingPlanId: this.listId,
        userCode: store.userInfo.userCode,
        userName: store.userInfo.userName,
        photoUrlList: this.photoList.map(item => item.url),
      };
      await actions.addFeel(req);
      this.$tools.toast("上传成功", 1);
      this.$tools.goNext(this.$tools.goBack);
    },
  },
};
</script>

<style lang="less" scoped>
.upload {
  background-color: #fff;
}
.scroll-h {
  height: calc(100vh - 120rpx);
}
.item-list {
  padding: 20rpx;
}
.up-title {
  font-size: 14px;
  .title-text {
    margin-bottom: 10rpx;
  }
  .required {
    color: red;
    margin-right: 8rpx;
  }
}
.up-content {
  border: 1px solid rgb(235, 233, 233);
  margin-top: 20rpx;
  padding: 10rpx;
  box-sizing: border-box;
  position: relative;
  padding-bottom: 20rpx;

  .item-input {
    width: 100%;
    height: 400rpx;
    display: block;
  }

  .length-tip {
    position: relative;
    height: 20rpx;
    bottom: 0;
    text-align: right;
    color: #cccccc;
  }
}
.upload-btn {
  height: 120rpx;
  padding: 20rpx;
  color: #ffffff;
}
</style>
