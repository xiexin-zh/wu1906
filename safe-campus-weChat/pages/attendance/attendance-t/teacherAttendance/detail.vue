<template>
  <view class="u-page u-type-white-bg">
    <image src="/mobile-img/kq-head.png" mode="" class="img"></image>
    <view class="list u-padd-t40 u-padd-l20 u-padd-r20 u-padd-b20">
      <view class="th u-fx-ac">
        <text class="left">教职工姓名</text>
        <text class="left">打卡时间</text>
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
          <text class="left">{{ item.userName }}</text>
          <text class="left">{{ item.realTime | gmtToDate('second') }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
import noData from "@/components/no-data/no-data.vue";
import { store, actions } from "../store/index.js";
export default {
  components: {},
  data() {
    return {
      groupuserList: [],
      req: {}
    };
  },
  mounted() {
    this.req = JSON.parse(this.$tools.getQuery().get('req'))
    this.req.schoolCode = store.userInfo.schoolCode
    this.showList()
  },
  methods: {
    async showList() {
      const res = await actions.teacherAttdanceDetail(this.req);
      this.groupuserList = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  background-color: #fff;
  margin-top: -75rpx;
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
    width: 50%;
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
