<template>
  <view class="u-page u-bg-fff">
    <scroll-view scroll-y="true" class="scroll-h">
      <NewDetail :detail="detail"></NewDetail>
    </scroll-view>
  </view>
</template>

<script>
import { actions } from "../store/index.js";
import NewDetail from "../../component/NewDetail.vue";
export default {
  components: {
    NewDetail,
  },
  data() {
    return {
      detail: {},
    };
  },
  mounted() {
    const id = this.$tools.getQuery().get("id");
    this.getDetail(id);
  },
  methods: {
    async getDetail(id) {
      const res = await actions.getNewsDetail(id);
      this.detail = res.data;
    },
  },
};
</script>
<style lang="scss" scoped>
.scroll-h {
  height: 100vh;
}
</style>
