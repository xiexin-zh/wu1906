<template>
  <view class="u-page">
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="approve-list" v-for="(item, i) in recordList" :key="i">
        <view class="u-mar-t20 u-padd-l40 u-font-3">
          <u-icon name="edit-pen" color="#2979ff" size="38"> </u-icon>
          <text class="u-padd-l40"> {{ item.subjectName }} </text>
        </view>
        <view class="u-mar-t20 u-padd-l40 u-padd-b30"
          >考试时间 : {{ item.testDate | gmtToDate('date') }}  {{ item.startTime | gmtToDate('time') }}~{{ item.endTime | gmtToDate('time') }}</view
        >
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { store, actions } from "./store/index.js";
import eventBus from "@u/eventBus";
export default {
  components: {},
  data() {
    return {
      recordList: [],
    };
  },
  mounted() {
    const id = this.$tools.getQuery().get("id");
    this.getDetail(id);
  },
  methods: {
    async getDetail(id) {
      const res = await actions.getInfoList(id);
      this.recordList = res.data;
    },
  },
};
</script>
<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh);
  	margin-top: 20rpx;
}
.approve-list {
  background-color: $uni-bg-color;
  border-radius: 16rpx;
  padding: $u-mp-20;
  margin: $u-mp-20;
  position: relative;
  	&:first-child {
		margin-top: 0;
	}
}
</style>
