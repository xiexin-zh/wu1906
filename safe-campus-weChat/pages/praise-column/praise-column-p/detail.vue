<template>
  <view class="u-page">
    <scroll-view scroll-y="true" class="scroll-h">
      <detailList  :data-list="detail" ></detailList>
    </scroll-view>
  </view>
</template>

<script>
import eventBus from "@u/eventBus";
import { store, actions } from "./store/index.js";
import hostEnv from "../../../config/index.js";
import detailList from "../component/detailList.vue";
export default {
  components: { detailList },
  data() {
    return {
      detail: [],
      id: "",
    };
  },
  mounted() {
    this.id = this.$tools.getQuery().get("id");
    this.getDetail();
  },
  methods: {
    async getDetail() {
      const req = {
        praiseCode: this.id,
        schoolCode: store.userInfo.schoolCode,
      };
      const res = await actions.getfindPraise(req);
      this.detail = res.data.map((el) => {
        return {
          ...el,
          photoUrl: "/mobile-img/medal.png",
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh);
  
}

</style>
