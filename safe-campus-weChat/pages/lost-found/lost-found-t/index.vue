<template>
  <view class="u-page">
    <scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
      <lost-list :data-list="recordList" @open="open" @click="click"></lost-list>
    </scroll-view>
    <view class="foot">
      <view class="float-add-btn" @click="add"></view>
    </view>
  </view>
</template>
<script>
import { store, actions } from "./store/index.js";
import eventBus from "@u/eventBus";
import lostList from "../component/lostList.vue";
export default {
  components: {
    lostList,
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
    };
  },
  filters: {},
  mounted() {
    eventBus.$on("getList", () => {
      this.showList();
    });
    this.showList();
  },
  methods: {
    async showList(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        schoolCode: store.userInfo.schoolCode,
        ...this.pageList,
      };
      const res = await actions.lostList(req);
      if (tag) {
        this.recordList = this.recordList.concat(res.data.list).map((el) => {
          return {
            ...el,
            show: false,
          };
        });
      } else {
        this.recordList = res.data.list.map((el) => {
          return {
            ...el,
            show: false,
          };
        });
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
    add() {
      this.$tools.navTo({
        url: "./form",
        title: "发布失物招领",
      });
    },
    click(index, index1) {
      if (index1 == 0) {
        this.$tools.delTip(`确定移除吗？`, () => {
          actions.delLost(this.recordList[index].id).then(() => {
            this.$tools.toast(`移除成功`, "success");
            this.$tools.goNext(() => {
              this.showList();
            });
          });
        });
      }
    },
    open(index) {
      this.recordList[index].show = true;
      this.recordList.map((val, idx) => {
        if (index != idx) this.recordList[idx].show = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 100rpx);
}
</style>
