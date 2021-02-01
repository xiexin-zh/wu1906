<template>
  <view class="sign u-fx-ver">
    <view class="sign-list u-fx-f1">
      <view class="search">
        <ms-dropdown-menu
          ><ms-dropdown-item
            v-model="searchValue"
            :list="options"
          ></ms-dropdown-item
        ></ms-dropdown-menu>
      </view>
      <view class="user">
        <text>未签到：</text>
        <text class="has-sign"> {{ allCount - signCount }} </text>
        <text>已签到：</text>
        <text style="color: #0084ff"> {{ signCount }} </text>
      </view>
      <scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
        <view class="u-padd-20">
          <no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
          <view class="u-border-radius">
            <view class="list u-bg-fff" v-for="item in dataList" :key="item.id">
              <view class="u-padd-l20 u-padd-r20">
                <view class="list-border u-fx-jsb u-fx-ac">
                  <view class="u-fx">
                    <text class="user-name">{{ item.userName }}</text>
                    <text>{{ item.userMobile }}</text>
                  </view>
                  <text
                    class="u-tips-color"
                    :style="{ color: item.hasSignIn ? '#0084FF' : 'red' }"
                    >{{ item.hasSignIn ? "已签到" : "未签到" }}</text
                  >
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import noData from "@/components/no-data/no-data.vue";
import msDropdownMenu from "@/components/ms-dropdown/dropdown-menu.vue";
import msDropdownItem from "@/components/ms-dropdown/dropdown-item.vue";
import { store, actions } from "../store";
export default {
  name: "SignUser",
  components: {
    noData,
    msDropdownMenu,
    msDropdownItem,
  },
  data() {
    return {
      title: "全部",
      pageList: {
        page: 1,
        size: 20,
      },
      searchValue: "0",
      options: [
        {
          value: "",
          text: "全部",
        },
        {
          value: "1",
          text: "已签到",
        },
        {
          value: "2",
          text: "未签到",
        },
      ],
      dataList: [],
      allCount: 0,
      signCount: 0,
    };
  },
  watch: {
    searchValue(val, oldval) {
      if (val !== oldval) {
        this.showList();
      }
    },
  },
  created() {
    this.allCount = this.$route.query.allCount;
    this.signCount = this.$route.query.signCount;
  },
  mounted() {
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
        ...this.pageList,
        hasSignIn:
          this.searchValue === "1"
            ? true
            : this.searchValue === "2"
            ? false
            : "",
        trainingPlanId: this.$route.query.id,
      };
      const res = await actions.getSignUser(req);
      if (tag) {
        this.dataList = this.dataList.concat(res.data.records);
      } else {
        this.dataList = res.data.records;
      }
      this.morePage = res.data.current < res.data.pages;
    },
    loadMore() {
      if (!this.morePage) {
        this.$tools.toast("数据已加载完毕");
        return;
      }
      this.showList(true);
    },
    changeSelect(val) {
      this.pageList = {
        page: 1,
        size: 20,
      };
      const obj = this.options.find((item) => item.value === val);
      this.title = obj.label;
      this.showList();
    },
  },
};
</script>

<style lang="less" scoped>
.sign {
  height: 100vh;
}
.search {
  background-color: #fff;
}
.user {
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20rpx 30rpx 0;
  box-sizing: border-box;

  .has-sign {
    color: red;
    margin-right: 30rpx;
  }
}
.scroll-h {
  height: calc(100vh - 160rpx);
}
.sign-list {
  .list {
    .list-border {
      padding: 26rpx 15rpx;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
    }
  }
  .list:last-child .list-border {
    border-bottom: 1px solid #fff;
  }
  .user-name {
    width: 200rpx;
  }
}
.u-border-radius {
  border-radius: 16rpx !important;
  overflow: hidden;
}
</style>
