<template>
  <view class="red-flower">
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
      <view class="red-pic">
        <image
          v-show="current === 0"
          class="bg-img"
          src="http://canpointtest.com/mini-img/week-icon.png"
        ></image>
        <image
          v-show="current === 1"
          class="bg-img"
          src="http://canpointtest.com/mini-img/month-icon.png"
        ></image>
      </view>
      <view class="list-view">
        <total-select @change="changeTotal" :current="current"></total-select>
        <no-data v-if="totalList.length === 0" msg="暂无排行记录"></no-data>
        <view
          class="u-fx-ac list-item u-bd-b"
          v-for="(total, index) in totalList"
          :key="total.studentName"
        >
          <view
            :class="[
              'sort-icon',
              { one: index === 0, two: index === 1, three: index === 2 },
            ]"
            >{{ index + 1 }}</view
          >
          <view class="u-padd-l20 u-fx-f1">{{ total.studentName }}</view>
          <view class="u-tx-r u-fx-ac">
            <text class="u-type-error u-padd-r10">{{ total.flowerNum }}朵</text>
            <view>
              <u-image
                width="34rpx"
                height="34rpx"
                src="http://canpointtest.com/mini-img/red-flower.png"
              ></u-image>
            </view>
          </view>
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
        flag: 1,
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
        flag: 1,
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
.red-flower {
  .bg-img {
    width: 634rpx;
    height: 173rpx;
  }
  .red-tab {
    height: 80rpx;
  }
  .scroll-h {
    background-color: $u-type-primary;
    height: calc(100vh - 80rpx);
  }
  .red-pic {
    margin: 50rpx auto;
    width: 634rpx;
    height: 173rpx;
    display: block;
  }
  .list-view {
    overflow: hidden;
    margin: 20rpx;
    border-radius: $u-border-radius-middle;
    background-color: #fff;
    .sort-icon {
      width: 50rpx;
      height: 70rpx;
      line-height: 70rpx;
      text-align: center;
      margin-right: 20rpx;
    }
    .list-item {
      padding: 0 20rpx;
      height: 110rpx;
      .one {
        overflow: hidden;
        background: url(http://canpointtest.com/mini-img/one-icon.png) no-repeat
          center;
        background-size: 50rpx 60rpx;
        text-indent: 100rpx;
      }
      .two {
        overflow: hidden;
        background: url(http://canpointtest.com/mini-img/two-icon.png) no-repeat
          center;
        background-size: 50rpx 60rpx;
        text-indent: 100rpx;
      }
      .three {
        overflow: hidden;
        background: url(http://canpointtest.com/mini-img/three-icon.png)
          no-repeat center;
        background-size: 50rpx 60rpx;
        text-indent: 100rpx;
      }
    }
  }
}
</style>
