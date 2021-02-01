<template>
  <view class="u-page u-bg-fff">
    <scroll-view scroll-y="true" class="scroll-h">
      <NoticeDetail :detail="detail"></NoticeDetail>
    </scroll-view>
  </view>
</template>

<script>
import { actions } from "../store/index.js";
import NoticeDetail from "../../component/NoticeDetail.vue";
export default {
  components: {
    NoticeDetail,
  },
  data() {
    return {
      detail: {},
      noticeId: "",
    };
  },
  mounted() {
    const id = this.$tools.getQuery().get("id");
    this.getDetail(id);
    this.updateStatu();
  },
  methods: {
    async getDetail(id) {
      const res = await actions.getNoticeDetail(id);
      this.detail = res.data;
    },
    async updateStatu() {
      this.noticeId = this.$tools.getQuery().get("id");
      const req = {
        query: `${this.noticeId}/${
          JSON.parse(uni.getStorageSync("protal")).userInfo.userCode
        }/${JSON.parse(uni.getStorageSync("protal")).userInfo.typeCode}`,
      };
      const res = await actions.updateStatus(req);
    },
  },
};
</script>
<style lang="scss" scoped>
.scroll-h {
  height: 100vh;
}
</style>
