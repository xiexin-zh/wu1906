<template>
  <view class="add u-bg-fff">
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="u-bd-b item-list">
        <view class="tip">输入内容：</view>
        <view class="u-fx-f1 u-mar-t20">
          <textarea
            class="item-text-area"
            maxlength="100"
            v-model="formData.content"
            placeholder-style="padding: 20rpx;font-size: 26rpx"
            placeholder="请输入失物招领内容"
          />
        </view>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="submit"
        >发布</u-button
      >
    </view>
  </view>
</template>

<script>
import { actions, store } from "./store/index";
import eventBus from "@u/eventBus";
export default {
  data() {
    return {
      formData: {
        content: "",
      },
    };
  },
  created() {},
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    async submit() {
      if (this.formData.content === "") {
        this.$tools.toast("请输入失物招领内容");
        return false;
      }
      const req = {
        schoolCode: store.userInfo.schoolCode,
        createUserCode: store.userInfo.userCode,
        createUserName: store.userInfo.userName,
        content: this.formData.content,
      };
      await actions.addlost(req);
      this.$tools.toast("操作成功");
      this.$tools.goNext(() => {
        eventBus.$emit("getList");
        this.$tools.goBack();
      });
    },
  },
};
</script>

<style lang="scss">
.add {
  position: relative;
  .scroll-h {
    height: calc(100vh - 100rpx);
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
}
.item-text-area {
  height: 120rpx;
  width: 100%;
  line-height: 40rpx;
}
</style>
