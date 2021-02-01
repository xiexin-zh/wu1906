<template>
  <view class="u-page">
    <view class="head u-padd-t10">
      <button
        plain
        class="date-search u-mar-20 u-mar-t10"
        @click="onShowDatePicker('rangetime')"
      >
        <view
          class="u-placeholder-color u-fx-jsa"
          v-if="rangetime && rangetime.length !== 0"
        >
          <text>{{ rangetime[0] | gmtToDate("date") }}</text>
          <text>~</text>
          <text>{{ rangetime[1] | gmtToDate("date") }}</text>
        </view>
        <view v-else class="u-placeholder-color u-fx-jsa">
          <text>开始时间</text>
          <text>~</text>
          <text>结束时间</text>
        </view>
        <view v-if="rangetime.length !== 0" class="clear" @click.stop="clear"
          ><uni-icons color="#fff" class="u-type-info" size="20" type="clear"
        /></view>
      </button>
      <view class="report">
        <div class="u-fx-jc">
          <view class="info">
            <view class="u-type-primary u-font-3"
              >{{ this.countList.sum || 0 }}人</view
            >
            <view class="u-type-info-dark">中途外出</view>
          </view>
          <view class="info">
            <view class="u-type-success u-font-3"
              >{{ this.countList.returnNum || 0 }}人</view
            >
            <view class="u-type-info-dark">外出已归</view>
          </view>
          <view class="info">
            <view class="u-type-error u-font-3"
              >{{ this.countList.unReturnNum || 0 }}人</view
            >
            <view class="u-type-info-dark">外出未归</view>
          </view>
        </div>
      </view>
    </view>
    <view class="">
      <mx-date-picker
        :show="showPicker"
        :type="type"
        :value="value"
        :show-tips="true"
        :begin-text="'开始'"
        :end-text="'结束'"
        :show-seconds="true"
        @confirm="onSelected"
        @cancel="onSelected"
      />
    </view>
    <view class="list u-bg-fff u-mar-20 u-padd-20">
      <view class="th u-fx-jsa u-fx-ac u-fx-jc u-mar-b20">
        <text class="left">姓名</text>
        <view class="md u-fx-ac u-fx-jc">
          <text>外出时间</text>
          <view class="icon u-fx-ver"></view>
        </view>
        <text class="right u-padd-l20">回归时间</text>
      </view>
      <no-data msg="暂无外出记录~" v-if="recordList.length === 0"></no-data>
      <scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
        <view
          v-for="(item, i) in recordList"
          :key="i"
          class="tbody u-bd-b u-fx-jsb u-fx-ac"
        >
          <text class="left">{{ item.userName }}</text>
          <text class="md">{{ getDateTime(new Date(item.outTime)) }}</text>
          <text class="right u-text-center">{{
            item.returnTime ? getDateTime(new Date(item.returnTime)) : '未归'
          }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
import { store, actions } from "../store/index.js";
import noData from "@/components/no-data/no-data.vue";
export default {
  components: {
    MxDatePicker,
    noData,
  },
  data() {
    return {
      showPicker: false,
      rangetime: [],
      type: "rangetime",
      value: "",
      recordList: [],
      pageList: {
        page: 1,
        size: 20,
      },
      morePage: false,
      countList: [],
      searchObj: {},
    };
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
        schoolCode: store.userInfo.schoolCode,
        ...this.pageList,
        ...this.searchObj,
      };
      const res = await actions.getoutRecord(req);
      const con = await actions.getrecordCoutn(req);
      this.countList = con.data;
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
    clear() {
      this.rangetime = [];
      this.searchObj = {};
      this.showList();
    },
    onShowDatePicker(type) {
      //显示
      this.type = type;
      this.showPicker = !this.showPicker;
      this.value = this[type];
    },
    onSelected(e) {
      this.showPicker = false;
      if (!e) {
        return;
      }
      this[this.type] = e.value;
      this.searchObj = {
        startTime: this.getDateTime(new Date(e.value[0])),
        endTime: this.getDateTime(new Date(e.value[1])),
      };
      this.showList();
    },
    getDateTime(date, type) {
      if (date === "" || date === null) {
        return "--";
      }
      const d = new Date(date);
      return (
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)) +
        "-" +
        (d.getDate() > 9 ? d.getDate() : "0" + d.getDate())
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.head {
  height: 293rpx;
  background: url("http://canpointtest.com/mobile-img/inoutRecord.png")
    no-repeat;
  background-size: 100% 293rpx;
  button {
    font-size: 28upx;
  }
  .name-search {
    background-color: transparent;
  }
  .date-search {
    position: relative;
    border: 2rpx solid #fff;
    .u-placeholder-color {
      color: #fff;
    }
    .clear {
      align-items: center;
      line-height: 24px;
      position: absolute;
      right: 10rpx;
      top: 12rpx;
      z-index: 99;
      .u-type-info {
        font-size: 36rpx;
      }
    }
  }
}

.list {
  font-size: 28rpx;
  border-radius: 16rpx;
  .th {
    background: $uni-color-primary;
    padding: 20rpx 0;
    border-radius: 8rpx;
    color: #fff;
  }
  .tbody {
    position: relative;
    padding: 24rpx 10rpx;
    background: $u-bg-color;
    border-radius: 8rpx;
  }
  .tbody:nth-child(even) {
    background: $uni-bg-color;
  }
  .left {
    width: 15%;
    text-align: center;
  }
  .md {
    width: calc(45% - 40rpx);
    text-align: center;
  }
  .right {
    width: 25%;
  }
  .u-text-center {
    text-align: center;
  }
}
.scroll-h {
  height: calc(100vh - 390rpx);
}
.report {
  .info {
    background-color: #ffffff;
    padding: 42rpx 60rpx;
    text-align: center;
    view:first-child {
      margin-bottom: 10rpx;
    }
  }
}
</style>
