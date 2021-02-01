<template>
  <view class="site u-page">
    <tab-menu :data-list="list" @change="tabChange"></tab-menu>
    <dropdown-menu
      @value0Change="value0Change"
      @searchChange="searchChange"
    ></dropdown-menu>
    <no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
    <scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
      <view
        class="approve-list u-border-radius"
        v-for="(item, i) in dataList"
        :key="i"
        @click="goDetail(item.id)"
      >
        <view class="detail u-fx">
          <view class="process-type">
            <u-tag
              v-if="item.state === '0'"
              mode="dark"
              type="primary"
              text="待审批"
            />
            <u-tag
              v-if="item.state === '1'"
              mode="dark"
              type="warning"
              text="待发放"
            />
            <u-tag
              v-if="item.state === '2'"
              mode="dark"
              type="error"
              text="已退回"
            />
            <u-tag
              v-if="item.state === '3'"
              mode="dark"
              type="success"
              text="已发放"
            />
          </view>
          <view class="u-fx-ac">
            <view class="u-fx-f1">
              <view class="u-main-color u-font-1 u-mar-t20">
                <view
                  v-for="(ele, index) in item.collectNaterialNameList"
                  :key="index"
                  >{{ ele.materialTypeName }}-{{ ele.materialName }}-{{
                    ele.number
                  }}份</view
                >
              </view>
              <view class="u-tips-color u-mar-t20"
                >申请时间：{{ item.createTime | gmtToDate("dateTime") }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="float-add-btn" @click="add" v-if="this.current === 0"></view>
  </view>
</template>
<script>
import eventBus from "@u/eventBus";
import DropdownMenu from "./component/DropdownMenu.vue";
import noData from "@/components/no-data/no-data.vue";
import { store, actions } from "./store/index.js";
export default {
  components: {
    DropdownMenu,
    noData,
  },
  data() {
    return {
      value0: "",
      searchObj: {
        startTime: "",
      },
      pageList: {
        page: 1,
        size: 15,
      },
      morePage: false,
      dataList: [],
      list: [
        {
          name: "我提交的",
        },
        {
          name: "我审批的",
        },
        {
          name: "我发放的",
        },
      ],
      current: 0,
      collectNaterialNameList: [],
    };
  },
  async mounted() {
    eventBus.$on("getList", () => {
      this.showList();
    });
    this.showList();
  },
  methods: {
    tabChange(item) {
      console.log(item);
      this.current = item;
      this.pageList.page = 1;
      this.showList();
    },
    value0Change(val) {
      console.log(val);
      this.value0 = val;
      this.showList();
    },
    searchChange(val) {
      console.log(val);
      this.searchObj = val;
      this.showList();
    },
    async showList(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        ...this.pageList,
        schoolCode: store.userInfo.schoolCode,
        userCode: store.userInfo.userCode,
        date: this.searchObj.startTime,
        queryType: this.current === 0 ? 1 : this.current === 1 ? 2 : 3,
        state: this.value0,
      };
      const res = await actions.getcollectionList(req);
      this.total = res.data.total;
      if (tag) {
        this.dataList = this.dataList.concat(res.data.list);
      } else {
        this.dataList = res.data.list;
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
    goDetail(id) {
      this.$tools.navTo({
        url: "./detail?id=" + id,
        title: "查看",
      });
    },
    add() {
      this.$tools.navTo({
        url: "./form",
        title: "物品领用",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 180rpx);
  margin-top: 20rpx;
}
.approve-list {
  background-color: $uni-bg-color;
  margin: $u-mp-20;
  position: relative;
  &:first-child {
    margin-top: 0;
  }
  .detail {
    padding: 20rpx;
  }
  .process-type {
    top: 10rpx;
    right: 20rpx;
    position: absolute;
    font-size: 48rpx;
  }
}
</style>
