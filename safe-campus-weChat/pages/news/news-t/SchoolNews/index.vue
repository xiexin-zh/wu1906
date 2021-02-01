<template>
  <view class="home u-page">
    <view id="title" class="head"
      ><uni-search-bar @confirm="search" @input="input"></uni-search-bar
    ></view>
    <scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
      <view class="u-of">
        <NewCard
          @actionsheet="actionsheet"
          @goDetail="goDetail"
          :data-list="recordList"
        ></NewCard>
      </view>
    </scroll-view>
    <view class="foot" v-if="this.typeName === '教职工'"
      ><view class="float-add-btn" @click="add"></view
    ></view>
  </view>
</template>
<script>
import wxApi from '@u/wxApi'
import NewCard from "../../component/NewCard.vue";
import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue";
import { store, actions } from "../store/index.js";
import noData from "@/components/no-data/no-data.vue";
import eventBus from "@u/eventBus";
export default {
  components: {
    uniSearchBar,
    noData,
    NewCard,
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
      searchName: "",
      userName: "",
      typeName: "",
    };
  },

  filters: {},
  mounted() {
		wxApi.getConfig('protal-card')
    eventBus.$on("getList", () => {
      this.showList();
    });
    this.showList();
    this.userCode = store.userInfo.userCode;
    this.typeName = store.userInfo.typeName;
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
    loadMore() {
      if (!this.morePage) {
        this.$tools.toast("数据已加载完毕");
        return;
      }
      this.showList(true);
    },
    add() {
      this.$tools.navTo({
        url: "./addnews",
        title: "发布新闻",
      });
    },
    search(value) {
      console.log(value);
      this.searchName = value.value;
      this.showList();
    },
    actionsheet(id) {
      const arr = ["编辑", "删除"];
      this.$tools.actionsheet(["编辑", "删除"], (index) => {
        if (index == 0) {
          this.$tools.navTo({
            url: `./addnews?id=${id}`,
            title: "编辑新闻",
          });
        } else if (index == 1) {
          this.$tools.confirm("确定删除吗", () => {
            actions.delNews(id).then((res) => {
							this.$tools.toast("删除成功", 'success');
							this.$tools.goNext(() => {
							  this.showList();
							});
            });
          });
        }
      });
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
.head {
  height: 100rpx;
}
.scroll-h {
  height: calc(100vh - 100rpx);
}
</style>
