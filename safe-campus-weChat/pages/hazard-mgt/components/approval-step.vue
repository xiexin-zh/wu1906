<template>
  <view class="step">
    <view
      class="step-list u-fx-ac"
      v-for="(data, index) in dataList"
      :key="index"
    >
      <view class="left-w" style="position: relative;">
        <view :class="['tips', { act: data.status === 1 }]"></view>
      </view>
      <view
        class="u-fx-ac u-fx-f1 step-item u-padd-30 u-type-white-bg u-border-radius"
      >
        <view class="sjx"></view>
        <view class="u-bg-color u-border-radius-all">
          <!-- <image
            :src="data.photoUrl || '/mobile-img/auto-teacher.png'"
            class="u-user-img u-border-radius-all"
          ></image> -->
        </view>
        <view class="u-fx-f1 u-mar-l">
          <!-- {{data}} -->
          <view>{{ data.content }}</view>
          <view class="u-mar-t10 u-font-02 u-tips-color">{{
            data.createTime | gmtToDate("dateTime")
          }}</view>
          <view v-if="data.remark" class="u-te u-font-01 u-content-color u-mar-t10">{{data.remark}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.step-list {
  .left-w {
    width: 50rpx;
  }
  border-left: 1rpx $u-light-color solid;
  margin: 0 $u-mp-30;
  .tips {
    z-index: 99;
    top: -10rpx;
    position: absolute;
    left: -12rpx;
    width: 20rpx;
    height: 20rpx;
    border-radius: 100%;
    background-color: $u-tips-color;
    &.act {
      background-color: $u-type-primary;
    }
  }
	min-height: 200rpx;
  .sjx {
    left: -40rpx;
    position: absolute;
    z-index: 99;
    width: 0px;
    height: 0px;
    border-left: 20rpx transparent solid;
    border-right: 20rpx $u-type-white solid;
    border-top: 20rpx transparent solid;
    border-bottom: 20rpx transparent solid;
  }
}
</style>
