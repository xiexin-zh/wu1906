<template>
  <view class="home u-page">
    <view id="title" class="head"
      ><uni-search-bar @confirm="search" @input="input"></uni-search-bar
    ></view>
    <scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
      <view class="u-of"
        ><NewCard @goDetail="goDetail" :data-list="recordList"></NewCard
      ></view>
    </scroll-view>
  </view>
</template>
<script>
import NewCard from "../../component/NewCard.vue";
import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue";
import { store, actions } from "../store/index.js";
import eventBus from "@u/eventBus";
export default {
  components: {
    uniSearchBar,
    NewCard,
  },
  data() {
    return {
      recordList: [],
      pageList: {
        page: 1,
        size: 20,
      },
      morePage: false,
      searchName: "",
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
        title: this.searchName,
      };
      const res = await actions.newsList(req);
      if (tag) {
        this.recordList = this.recordList.concat(res.data.list);
      } else {
        this.recordList = res.data.list;
      }
      this.morePage = res.data.hasNextPage;
    },
    search(value) {
      console.log(value);
      this.searchName = value.value;
      this.showList();
    },
    loadMore() {
      if (!this.morePage) {
        this.$tools.toast("数据已加载完毕");
        return;
      }
      this.showList(true);
    },
    goDetail(id) {
      this.$tools.navTo({
        url: "./detail?id=" + id,
        title: "详情",
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
