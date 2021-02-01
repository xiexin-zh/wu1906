<template>
  <view class="home u-page">
    <view id="title" class="head"
      ><uni-search-bar @confirm="search" @input="input"></uni-search-bar
    ></view>
    <noData msg="暂无数据~" v-if="recordList.length === 0"></noData>
    <scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
      <view class="u-of">
        <view
          class="notice-card u-fx"
          v-for="item in recordList"
          :key="item.id"
          @click="goDetail(item)"
        >
          <view class="notice-img"> </view>
          <view class="u-fx-f1 u-fx-jsb u-fx-ver u-mar-l">
            <view class="u-fx-ac u-fx-jsb title">
              <view class="u-fx-f1 u-font-1 u-te">{{ item.title }}</view>
            </view>
            <view class="content u-content-color u-te2">{{
              item.content
            }}</view>
            <view class="time u-light-color u-font-02 u-fx-jsb">
              <text>发布于 {{ item.createTime | getToDate }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue";
import { store, actions } from "../store/index.js";
import noData from "@/components/no-data/no-data.vue";
import eventBus from "@u/eventBus";
export default {
  components: {
    uniSearchBar,
    noData,
  },
  data() {
    return {
      recordList: [],
      searchObj: {},
      total: 0,
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
        userCode: store.userInfo.userCode,
        ...this.searchObj,
        ...this.pageList,
        title: this.searchName,
      };
      const res = await actions.getlistByUser(req);
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
    search(value) {
      console.log(value);
      this.searchName = value.value;
      this.showList();
    },
    async goDetail(item) {
      this.$tools.navTo({
        url: "./detail?id=" + item.id,
        title: "公告详情",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.head {
  height: 100rpx;
}
.scroll-h {
  height: calc(100vh - 100rpx);
}
.notice-card {
  border-radius: $u-border-radius;
  background-color: #fff;
  padding: $u-mp-20;
  margin: $u-mp-20;
  .notice-img {
    width: 0rpx;
    height: 180rpx;
  }
  .tips-w {
    width: 80rpx;
  }
  .tips {
    width: 80rpx;
    text-align: right;
    line-height: 60rpx;
    height: 100rpx;
    top: -30rpx;
    right: 0;
    position: absolute;
    z-index: 99;
    font-size: 60rpx;
  }
}
</style>
