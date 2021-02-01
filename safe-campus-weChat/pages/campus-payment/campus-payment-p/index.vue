<template>
  <view class="site u-page">
    <choose-child @change="childInfo"></choose-child>
    <tab-menu :data-list="list" @change="tabChange"></tab-menu>
    <no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
    <scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
      <view class="u-auto">
        <view
          class="u-padd-40 u-bg-fff u-border-radius"
          v-for="(item, i) in dataList"
          :key="i"
          @click="goDetail(item)"
        >
          <view class="u-fx-jsb u-fx-ac">
            <view class="u-fx-ver">
              <view class="u-main-color u-mar-b20 u-font-1">{{
                item.billName
              }}</view>
              <view class="u-type-info-dark">{{ item.createTime }}</view>
            </view>
            <view class="tag">
              <view>{{ item.billMoney }}.00</view>
            </view>
          </view>
          <view class="u-bd-x u-mar-t20 u-mar-b20"></view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import eventBus from "@u/eventBus";
import noData from "@/components/no-data/no-data.vue";
import { store, actions } from "./store/index.js";
import chooseChild from "@/components/choose-child/choose-child.vue";
export default {
  components: {
    noData,
    chooseChild,
  },
  data() {
    return {
      pageList: {
        page: 1,
        size: 15,
      },
      morePage: false,
      dataList: [],
      list: [
        {
          name: "待缴费",
        },
        {
          name: "缴费逾期",
        },
        {
          name: "已缴费",
        },
      ],
      current: 0,
    };
  },
  async mounted() {
    this.showList();
  },
  methods: {
    childInfo(item) {
      if (item.userCode !== this.userCode) {
        this.userCode = item.userCode;
        this.showList();
      }
    },
    tabChange(item) {
      this.current = item;
      this.pageList.page = 1;
      this.showList();
    },
    async showList(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        schoolCode: store.userInfo.schoolCode,
        userCode: this.userCode,
        billStatus: this.current === 0 ? 1 : this.current === 1 ? 4 : 2,
      };
      const res = await actions.getbillInfo(req);
      this.total = res.data.total;
      if (tag) {
        this.dataList = this.dataList.concat(res.data.records);
      } else {
        this.dataList = res.data.records;
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
    goDetail(item) {
      this.$tools.navTo({
        url: "./detail?id=" + item.id + "&taskCode=" + item.taskCode,
        title: "查看",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 80rpx);
  margin-top: 20rpx;
}
.u-bd-x {
  border-top: 1px solid #f2f2f2;
}
</style>
