<template>
  <view class="u-page u-type-white-bg">
    <image src="/mobile-img/kq-head.png" mode="" class="img"></image>
    <view class="list u-padd-t40 u-padd-l20 u-padd-r20 u-padd-b20">
      <view class="th u-fx-ac u-fx-ac">
        <text class="left">序号</text>
        <view class="right">日期</view>
        <text class="right">班次</text>
        <text class="right">打卡时间</text>
      </view>
      <no-data msg="暂无数据" v-if="groupuserList.length === 0"></no-data>
      <scroll-view
        v-else
        scroll-y="true"
        class="scroll-h"
      >
        <view
          v-for="(item, i) in groupuserList"
          :key="i"
          class="tbody u-bd-b u-fx-ac"
        >
          <text class="left">{{ i+1 }}</text>
          <text class="right">{{ item.dayTime | gmtToDate('date') }}</text>
          <text class="right">
            {{ item.shift === '1' ? '上午上班' : item.shift === '2' ? '上午下班' : item.shift === '3' ? '下午上班' : item.shift === '4' ? '下午下班' : ''}}
          </text>
          <text class="right">{{ item.realTime | gmtToDate('second') }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
import noData from "@/components/no-data/no-data.vue"
import { store, actions } from "../store/index.js"
export default {
  components: {},
  data() {
    return {
      groupuserList: [],
      yearTitle: '',
      state: ''
    };
  },
  mounted() {
    this.month = this.$tools.getQuery().get("month")
    this.state = this.$tools.getQuery().get("state")
    this.showList()
  },
  methods: {
    async showList() {
      const req = {
        month: this.month,
        userCode: store.userInfo.userCode,
        state: this.state,
      }
      const res = await actions.teacherStaticDetail(req)
      this.groupuserList = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  margin-top: -75rpx;
  background-color: #fff;
  position: relative;
  z-index: 99;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  .th {
    background: #0084ff;
    padding: 20rpx;
    border-radius: 8rpx;
    color: #fff;
  }
  .tbody {
    position: relative;
    padding: 25rpx 20rpx;
    background: $uni-bg-color;
  }
  .tbody:nth-child(even) {
    background: $u-bg-color;
  }
  .left {
    width: 15%;
    text-align: center;
  }
  .right {
    width: 28%;
    text-align: center;
  }
}
.scroll-h {
  height: calc(100vh - 350rpx);
}
.img {
  width: 100%;
  height: 280rpx;
}
</style>
