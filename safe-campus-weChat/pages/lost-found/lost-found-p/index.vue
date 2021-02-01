<template>
  <view class="u-page">
    <choose-child @change="childInfo"></choose-child>
    <scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
      <lost-list :data-list="recordList"></lost-list>
    </scroll-view>
  </view>
</template>
<script>
import { store, actions } from "./store/index.js";
import lostList from "../component/lostList.vue";
import chooseChild from "@/components/choose-child/choose-child.vue";
export default {
  components: {
    lostList,
    chooseChild,
  },
  data() {
    return {
      recordList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20,
      },
      morePage: false,
      userCode: "",
    };
  },
  async created() {
    this.userCode = store.childList[0].userCode;
  },
  mounted() {
    this.showList();
  },
  methods: {
    childInfo(item) {
      this.userCode = item.userCode;
      this.showList();
    },
    async showList(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        schoolCode: store.userInfo.schoolCode,
        userCode: this.userCode,
        ...this.pageList,
      };
      const res = await actions.lostList(req);
      if (tag) {
        this.recordList = this.recordList.concat(res.data.list);
      } else {
        this.recordList = res.data.list;
      }
      this.morePage = res.data.hasNextPage;
    },
    loadMore() {
      if (!this.morePage) {
        this.$tools.toast("数据已加载完毕");
        return;
      }
      this.showList(true);
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 100rpx);
}
</style>
