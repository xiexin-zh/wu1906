<template>
  <view class="task-total">
    <view class="red-tab"
      ><u-tabs
        :list="list"
        :is-scroll="false"
        active-color="#fff"
        inactive-color="#fff"
        bg-color="#7691fa"
        :current="current"
        @change="change"
      ></u-tabs
    ></view>
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="task-sort">
        <image
          class="bg-icon"
          src="http://canpointtest.com/mini-img/task-total-bg.png"
        ></image>
      </view>
      <view class="list-view">
        <total-select @change="changeTotal" :current="current"></total-select>
        <view class="total-title u-fx-ac u-padd-l20 u-padd-r20">
          <view class="u-fx-f1">姓名</view>
          <view class="u-w-100">已交</view>
          <view class="u-w-100">未交</view>
          <view class="u-w-100">优秀</view>
        </view>
        <no-data v-if="totalList.length === 0" msg="暂无排行榜"></no-data>
        <view
          class="u-fx-ac list-item u-bd-b"
          v-for="(total, index) in totalList"
          :key="total.studentCode"
        >
          <view class="u-fx-f1">
            <text>{{ index + 1 }}</text>
            <text class="u-padd-l">{{ total.studentName }}</text>
          </view>
          <view class="u-w-100 u-type-success-dark">{{ total.submitNum }}</view>
          <view class="u-w-100 u-type-error-dark">{{ total.noSubmitNum }}</view>
          <view class="u-w-100 u-type-error-dark">{{ total.goodNum }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import NoData from "../component/NoData.vue";
import baseData from "@u/base-data";
import { store, actions } from "@store";
import TotalSelect from "./component/TotalSelect.vue";
export default {
  components: {
    TotalSelect,
    NoData,
  },
  computed: {
    userInfo: () => store.userInfo,
  },
  data() {
    return {
      baseData,
      list: [
        {
          name: "周榜",
        },
        {
          name: "月榜",
        },
      ],
      current: 0,
      totalList: [],
    };
  },
  mounted() {
    const obj = {
      startTime: "",
      endTime: "",
      subjectCode: "",
    };
    this._getTaskTotal(obj);
  },
  methods: {
    async _getTaskTotal(item) {
      const res = await actions.getTaskTotal({
        classCode: this.baseData.getClassCode(),
        startTime: this.$tools.getDateTime(item.startTime, 'date'),
        endTime: this.$tools.getDateTime(item.endTime, 'date'),
        schoolCode: this.userInfo.schoolCode,
        flag: 2,
        subjectCode: item.subjectCode,
      });
      this.totalList = res.data;
    },
    change(index) {
      this.current = index;
      let startTime = "";
      let endTime = "";
      if (index === 0) {
        startTime = this.$tools.getNowWeekDate()[0].getTime();
        endTime = this.$tools.getNowWeekDate()[1].getTime();
      } else {
        startTime = this.$tools.getNowWMonthDate()[0].getTime();
        endTime = this.$tools.getNowWMonthDate()[1].getTime();
      }
      this._getTaskTotal({
        classCode: this.baseData.getClassCode(),
        startTime,
        endTime,
        schoolCode: this.userInfo.schoolCode,
        flag: 2,
        subjectCode: "",
      });
    },
    changeTotal(item) {
      this._getTaskTotal(item);
    },
  },
};
</script>

<style lang="scss" scoped>
.task-total {
  .bg-icon {
    width: 600rpx;
    height: 300rpx;
  }
  .red-tab {
    height: 80rpx;
  }
  .scroll-h {
    background-color: $u-type-primary;
    height: calc(100vh - 80rpx);
  }
  .u-w-100 {
    width: 120rpx;
    text-align: center;
  }
  .total-title {
    height: 100rpx;
    background-color: $u-bg-color;
    color: $u-content-color;
  }
  .task-sort {
    width: 600rpx;
    margin: 20rpx auto;
  }
  .list-view {
    overflow: hidden;
    margin: 20rpx;
    border-radius: $u-border-radius-middle;
    background-color: #fff;
    .sort-icon {
      width: 60rpx;
    }
    .list-item {
      padding: 0 20rpx;
      height: 110rpx;
    }
  }
}
</style>
