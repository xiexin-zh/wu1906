<template>
  <view class="invite u-page">
    <uni-search-bar
      class="search"
      placeholder="输入姓名搜索"
      @confirm="search"
    ></uni-search-bar>
    <dropdown-menu
      :statusList="statusList"
      @value0Change="value0Change"
      @value1Change="value1Change"
      @value2Change="value2Change"
    ></dropdown-menu>
    <no-data v-if="appointList.length === 0" msg="暂无数据"></no-data>
    <scroll-view
      v-else
      scroll-y="true"
      @scrolltolower="loadMore"
      class="scroll-h"
    >
      <view class="approve-list" v-for="(item, i) in appointList" :key="i">
        <view class="detail u-fx">
          <view class="process-type"
            ><view
              class="wait"
              @click="appoint(item)"
              v-if="infoList.respondentName != ''"
              >···</view
            ></view
          >
          <view class="info u-fx-ac">
            <view class="img"
              ><image
                :src="item.registPhoto ? item.registPhoto : errorImg"
                alt=""
            /></view>
            <view class="list u-fx-f1">
              <view class="name">{{ item.visitorName }}</view>
              <view
                >预计到达时间：{{ item.accessStartTime | getFullDate }}</view
              >
              <!-- <view>结束时间：{{ item.accessEndTime | getFullDate }}</view> -->
              <view>来访事由：{{ item.causeName }}</view>
              <view>
                状态：
                <text
                  :class="
                    item.state === 2
                      ? 'refuse'
                      : item.state === 1
                      ? 'agree'
                      : item.state === 0
                      ? 'wait'
                      : 'cancel'
                  "
                >
                  {{ item.state | visitApproveState }}
                </text>
              </view>
            </view>
          </view>
        </view>
        <view class="line u-bd-t"></view>
        <view class="see u-fx-jsb">
          <text>{{ item.createTime | getFullDate }}</text>
          <view class="u-fx u-fx-ac">
            <text @click="goDetail(item.id)">查看详情</text>
            <view class="rit-icon"></view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="float-add-btn" @click="add"></view>
  </view>
</template>

<script>
import eventBus from "@u/eventBus";
import DropdownMenu from "../component/DropdownMenu.vue";
import noData from "@/components/no-data/no-data.vue";
import { store, actions } from "../store/index.js";
export default {
  components: {
    DropdownMenu,
    noData,
  },
  data() {
    return {
      errorImg: "/mobile-img/person-auto.png",
      statusList: [
        {
          text: "全部状态",
          value: "0",
        },
        {
          text: "待处理",
          value: "00",
        },
        {
          text: "同意",
          value: "1",
        },
        {
          text: "拒绝",
          value: "2",
        } /* ,
				{
					text: '撤销',
					value: '3'
				} */,
      ],
      pageList: {
        page: 1,
        size: 15,
      },
      morePage: false,
      appointList: [],
      value0: "0",
      value1: "0",
      value2: "0",
      record: "",
      infoList: [],
    };
  },
  mounted() {
    this.getInfo();
    eventBus.$on("getList", () => {
      this.showList();
    });
    this.showList();
  },
  methods: {
    async getInfo() {
      const req = {
        schoolCode: store.userInfo.schoolCode,
        userName: store.userInfo.userName,
        userCode: store.userInfo.userCode,
      };
      const res = await actions.getInfoDetail(req);
      this.infoList = res.data;
    },
    value0Change(val) {
      console.log(val);
      this.value0 = val;
      this.showList();
    },
    value1Change(val) {
      console.log(val);
      this.value1 = val;
      this.showList();
    },
    value2Change(val) {
      console.log(val);
      this.value2 = val;
      this.showList();
    },
    // 访客记录
    async showList(tag = false) {
      let queryTime = new Date();
      if (this.value1 === "0") {
        queryTime = "";
      } else if (this.value1 === "1") {
        queryTime = new Date(new Date().setDate(new Date().getDate() - 7));
      } else if (this.value1 === "2") {
        queryTime = new Date(new Date().setDate(new Date().getDate() - 30));
      } else if (this.value1 === "3") {
        queryTime = new Date(new Date().setDate(new Date().getDate() - 180));
      }
      let state = "";
      if (this.value2 === "0") {
        state = "";
      } else if (this.value2 === "00") {
        state = "0";
      } else {
        state = this.value2;
      }
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        schoolCode: store.userInfo.schoolCode,
        pageNum: this.pageList.page,
        pageSize: this.pageList.size,
        userName: this.searchName,
        userCode: store.userInfo.userCode,
        causeId: this.value0 === "0" ? "" : this.value0,
        queryTime,
        state,
        queryType: 1,
        type: 1,
      };
      const res = await actions.getInviteList(req);
      if (tag) {
        this.appointList = this.appointList.concat(res.data.list);
      } else {
        this.appointList = res.data.list;
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
    goDetail(id) {
      this.$tools.navTo({
        url: "./detail?id=" + id,
      });
    },
    add() {
      if (this.infoList.respondentName === "") {
        this.$tools.toast("您不具备权限");
        return;
      }
      this.$tools.navTo({
        url: "./form",
        title: "发起邀约",
      });
    },
    appoint(record) {
      this.record = record;
      if (record.state == 0) {
        this.check(["修改", "再次发起邀约"]);
      } else {
        this.check(["再次发起邀约"]);
      }
    },
    check(arr) {
      this.$tools.actionsheet(arr, (index) => {
        this.$tools.navTo({
          url:
            "./form?id=" +
            this.record.id +
            "&type=" +
            (arr[index] === "修改" ? "0" : "1"),
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  height: 104rpx;
}
.approve-list {
  background-color: $uni-bg-color;
  border-radius: 16rpx;
  margin: 20rpx;
  position: relative;
  .detail {
    padding: 20rpx;
  }
  .process-type {
    top: 0;
    right: 20rpx;
    position: absolute;
    font-size: 48rpx;
  }
  .see {
    padding: 20rpx 10rpx 20rpx 20rpx;
    text {
      color: $u-tips-color;
      font-size: 24rpx;
    }
  }
  .info {
    .img {
      width: 160rpx;
      height: 200rpx;
      margin-right: 20rpx;
      image {
        width: 160rpx;
        height: 200rpx;
        background-color: $u-border-color;
      }
    }
    .list {
      view {
        font-size: 24rpx;
        margin: 10rpx 0;
      }
      .name {
        padding-bottom: 10rpx;
        font-size: 28rpx;
        font-weight: bold;
      }
    }
  }
}
.scroll-h {
  height: calc(100vh - 190rpx);
}
.dropdown {
  height: 86rpx;
  padding: 4rpx 18rpx 18rpx 18rpx;
  background: $uni-bg-color;
  font-size: 12px;
}
.dropdown-menu {
  width: 50%;
  padding: 2rpx 0;
  border: 1rpx solid $u-border-color;
}
.dropdown-menu:first-child {
  border-top-left-radius: 8rpx;
  border-bottom-left-radius: 8rpx;
}
.dropdown-menu:last-child {
  border-top-right-radius: 8rpx;
  border-bottom-right-radius: 8rpx;
}
.dropdown-item__selected {
  padding: 10rpx;
}

.icon {
  margin-left: 10rpx;
}

.down {
  transition: transform 0.3s;
  transform: rotateZ(0);
}
.up {
  transition: transform 0.3s;
  transform: rotateZ(-180deg);
}
.right {
  transform: rotateZ(-90deg);
}
.pop {
  text-align: center;
  text {
    padding: 20rpx 0;
  }
  text:not(:last-child) {
    border-bottom: 1rpx solid $u-border-color;
  }
  .title {
    padding: 20rpx 0 0 0;
  }
  input {
    border: 1rpx solid $u-border-color;
    margin: 20rpx 0;
  }
  .btn {
    padding: 0 20rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    letter-spacing: 8rpx;
    background-color: $u-type-primary;
    color: $uni-bg-color;
  }
}
</style>
