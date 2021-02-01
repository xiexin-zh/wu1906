<template>
  <view class="">
    <uni-search-bar
      placeholder="输入关键字搜索"
      @confirm="search"
    ></uni-search-bar>
    <scroll-view scroll-y="true" @scrolltolower="loadMore" class="scroll-h">
      <view class="u-auto">
        <no-data v-if="dataList.length === 0" msg="暂无数据"></no-data>
        <view
          v-else
          class="u-padd-l20 u-padd-r20"
          v-for="item in dataList"
          :key="item.id"
        >
          <view class="list u-bg-fff u-border-radius u-padd-20 u-mar-t20">
            <view>
              <view class="u-fx-jsb u-fx-ac u-mar-b40 u-padd-t20">
                <text style="font-weight: 900; font-size: 16px">{{
                  item.title.substr(0, 15)
                }}</text>
                <u-tag
                  :text="getStatus(item.status)[0]"
                  :style="{
                    background: getStatus(item.status)[1],
                    color: '#fff',
                    border: '0',
                  }"
                  shape="square"
                />
              </view>
              <view class="font-color u-fx-ac u-mar-b40">
                <text class="u-tips-color u-font-02 u-te"
                  >发起人：</text
                >{{ item.createUserName }}
              </view>
              <view class="font-color u-fx-ac u-mar-b40">
                <text class="u-tips-color u-font-02 u-te"
                  >培训地点：</text
                >{{ item.address.substr(0, 20) }}
              </view>
              <view class="font-color u-fx-ac u-mar-b40">
                <text class="u-tips-color u-font-02 u-te"
                  >培训时间：</text
                >{{
                  `${$tools.getDateTime(item.trainingDate, "date")} ${
                    item.startTime
                  }-${item.endTime}`
                }}
              </view>

              <view class="font-color u-fx-ac u-mar-b40">
                <text class="u-tips-color u-font-02 u-te"
                  >签到统计：</text
                >
                <text
                  class="sign-style"
                  @click="
                    toDetails(item.id, item.totalUserNum, item.signInUserNum)
                  "
                  >{{ item.signInUserNum + "/" + item.totalUserNum }}</text
                >
              </view>
            </view>
            <view class="list-bottom u-fx u-padd-t20">
              <view
                class="result u-fx-f1 u-fx-ac-jc"
                @click="uploadResult(item.id)"
                >培训成果</view
              >
              <view
                class="u-fx-f1 u-fx-ac-jc"
                @click="signUser(item.id, item.status)"
                >培训签到</view
              >
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <u-modal
      v-model="showSign"
      content="确定签到吗？"
      @confirm="confirmSign"
      @cancel="showSign = false"
      :show-cancel-button="true"
    ></u-modal>
  </view>
</template>

<script>
// import eventBus from '@u/eventBus';
import $tools from "@u/tools";
import noData from "@/components/no-data/no-data.vue";
import { store, actions } from "../store/index.js";
export default {
  name: "TrainList",
  components: {
    noData,
  },
  data() {
    return {
      keyword: "",
      pageList: {
        page: 1,
        size: 20,
      },
      morePage: false,
      dataList: [],
      showSign: false,
    };
  },
  watch: {},
  mounted() {
    this.showList();
  },
  methods: {
    search(value) {
      this.keyword = value.value;
      this.pageList = {
        page: 1,
        size: 20,
      };
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
        keyword: this.keyword,
        schoolCode: store.userInfo.schoolCode,
        userCode: store.userInfo.userCode,
      };
      const res = await actions.getTrainList(req);
      if (tag) {
        this.dataList = this.dataList.concat(res.data.records);
      } else {
        this.dataList = res.data.records;
      }
      this.morePage = res.data.current < res.data.pages;
    },
    getStatus(val) {
      if (val === "1") {
        return ["未开始", "#00A35F"];
      }
      if (val === "2") {
        return ["进行中", "#FF5454"];
      }
      if (val === "3") {
        return ["已结束", "#CCCCCC"];
      }
      return ["", ""];
    },
    loadMore() {
      if (!this.morePage) {
        this.$tools.toast("数据已加载完毕");
        return;
      }
      this.showList(true);
    },
    // 培训心得
    uploadResult(id) {
      this.$tools.navTo({
        url: `../train-result/index?id=${id}`,
      });
    },
    // 签到统计
    toDetails(id, allCount, signCount) {
      this.$tools.navTo({
        url: `../sign-user/index?id=${id}&allCount=${allCount}&signCount=${signCount}`,
      });
    },
    // 培训签到
    signUser(id, status) {
      if (status === "3") {
        this.$tools.toast("该培训计划已结束");
        return;
      }
      this.listId = id;
      this.showSign = true;
    },
    async confirmSign() {
      const req = {
        userCode: store.userInfo.userCode,
        id: this.listId,
      };
      await actions.signOk(req);
      this.$tools.toast("签到成功", 1);
      this.$tools.goNext(this.showList);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-list {
  height: 100rpx;
  width: 100%;
  padding: 20rpx;
  position: relative;
  .search-icon {
    margin-left: 20rpx;
    color: $u-type-primary;
  }
}
.scroll-h {
  height: calc(100vh - 120rpx);
}
.list {
  .sign-style {
    color: #0084ff;
  }
  .list-bottom {
    height: 30px;
    border-top: 1px solid #eee;
    color: #0084ff;

    .result {
      border-right: 1px solid #eee;
    }
  }
}
.font-color {
  color: #333;
  font-size: 28rpx;
}
.u-border-radius {
  border-radius: 16rpx !important;
}
</style>
