<template>
  <view class="home u-page u-fx u-fx-ver">
    <view id="title" class="head"
      ><uni-search-bar @confirm="search" @input="input"></uni-search-bar
    ></view>
    <scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
      <view class="u-of">
        <NoticeCard
          @actionsheet="actionsheet"
          @goDetail="goDetail"
          @readStatus="readStatus"
          :data-list="recordList"
        ></NoticeCard>
      </view>
    </scroll-view>
    <view class="float-add-btn" @click="add"></view>
  </view>
</template>
<script>
import NoticeCard from "../../component/NoticeCard.vue";
import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue";
import { store, actions } from "../store/index.js";
import noData from "@/components/no-data/no-data.vue";
import eventBus from "@u/eventBus";
export default {
  components: {
    uniSearchBar,
    noData,
    NoticeCard,
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
      userName: "",
    };
  },
  filters: {},
  mounted() {
    eventBus.$on("getList", () => {
      this.showList();
    });
    this.userCode = store.userInfo.userCode;
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
        ...this.searchObj,
        ...this.pageList,
        title: this.searchName,
        userCode: store.userInfo.userCode,
      };
      const res = await actions.getlistByTeacher(req);
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
        title: "发布公告",
      });
    },
    search(value) {
      this.searchName = value.value;
      this.showList();
    },
    actionsheet(id) {
      const arr = ["编辑", "删除"];
      this.$tools.actionsheet(["编辑", "删除"], (index) => {
        if (index == 0) {
          this.$tools.navTo({
            url: `./addnews?id=${id}`,
            title: "编辑公告",
          });
        } else if (index == 1) {
          this.$tools.confirm("确定删除吗", () => {
            actions.delNotice([id]).then((res) => {
              this.$tools.toast("删除成功", 'success');
							this.$tools.goNext(() => {
							  this.showList();
							});
            });
          });
        }
      });
    },
    async goDetail(id, notice) {
      // noticeType  1-其他公告   2-教学评价 3-问卷调查
      const { noticeType, bussId } = notice;
      if (noticeType === "2" || noticeType === "3") {
        this.$tools.navTo({
          url: `../../../academic-education/${ noticeType === "2" ? 'quality' : 'survey'}/index?id=${id}&bussId=${bussId}`,
        });
        return;
      }
      this.$tools.navTo({
        url: "./detail?id=" + id,
        title: "公告详情",
      });
    },
    readStatus(id) {
      this.$tools.navTo({
        url: "./ReadStatus?id=" + id,
        title: "阅读状态",
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
