<template>
  <view class="u-page u-bg-fff">
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="detail">
        <view class="title u-padd-t u-font-3">{{ detail.title }}</view>
        <view class="tips u-mar-t u-mar-b u-tips-color">
          <text class="createBy u-padd-r">{{ detail.createBy }}</text>
          <text>发布于: {{ $tools.getDateTime(detail.createTime) }}</text>
        </view>
        <view
          class="content u-padd-t u-content-color"
          v-html="detail.content"
        ></view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { store, actions } from "../store/index.js";
import eventBus from "@u/eventBus";
export default {
  components: {},
  data() {
    return {
      detail: {},
      id: "",
      noticeId: "",
    };
  },
  mounted() {
    this.id = this.$tools.getQuery().get("id");
    this.getDetail();
    this.updateStatu();
  },
  methods: {
    async getDetail() {
      let id = this.id;
      const res = await actions.getNoticeDetail(id);
      this.detail = res.data;
    },
    async updateStatu() {
      this.noticeId = this.$tools.getQuery().get("id");
      const req = {
        query: `${this.noticeId}/${
          JSON.parse(uni.getStorageSync("protal")).userInfo.userCode
        }`,
      };
      const res = await actions.updateStatus(req);
    },
  },
};
</script>
<style lang="scss" scoped>
.detail {
  overflow-x: hidden;
  padding: $u-mp-20 0;
  margin: 0 $u-mp-20;
  .content {
    text-indent: 50rpx;
    line-height: 46rpx;
  }
  .content /deep/ img {
    display: block;
    width: 100%;
    margin-bottom: 20rpx;
  }
}
</style>
