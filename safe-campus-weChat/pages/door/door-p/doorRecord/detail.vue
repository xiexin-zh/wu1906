<template>
  <view class="face u-bg-fff u-page">
    <view class="face-view u-fx-ac-jc">
      <image class="userPhoto" :src="baseImg"></image>
    </view>
    <view class="access">{{ accessType == "1" ? "进" : "出" }}</view>
    <view class="info">
      <view
        ><u-icon name="account-fill" color="#7b92f5" size="38"></u-icon>
          学生：{{ userName }}</view
      >
      <view
        ><u-icon name="clock-fill" color="#7b92f5" size="38"></u-icon>
          出入时间：{{ accessTime }}</view
      >
      <view
        ><u-icon name="map" color="#7b92f5" size="38"></u-icon>出入地点：{{
          accessPlace
        }}</view
      >
    </view>
  </view>
</template>

<script>
import { actions, store, setStore } from "../store/index.js";
export default {
  data() {
    return {
      baseImg: "",
      userName: "",
      accessType: "",
      accessTime: "",
      accessPlace: "",
    };
  },
  components: {},
  computed: {},
  mounted() {
    this.userName = this.$tools.getQuery().get("userName");
    this.baseImg = this.$tools.getQuery().get("snapPhoto");
    this.accessType = this.$tools.getQuery().get("accessType");
    this.accessTime = this.$tools.getQuery().get("accessTime");
    this.accessPlace = this.$tools.getQuery().get("accessPlace");
  },
  methods: {},
};
</script>

<style lang="scss">
.face {
  overflow: auto;
  .face-view {
    border: 6rpx $u-type-primary-light solid;
    width: 450rpx;
    height: 500rpx;
    margin: 50rpx auto 50rpx auto;
    border-radius: 10rpx;
    background-color: $u-type-primary-disabled;
    color: $u-type-primary;
    font-weight: bold;
    position: relative;
  }
  .userPhoto {
    width: 450rpx;
    height: 500rpx;
    display: block;
  }
  .info {
    color: $u-content-color;
    line-height: 80rpx;
    font-size: 30rpx;
    text-indent: 50rpx;
    padding-top: 30rpx;
    text {
      padding-right: 20rpx;
    }
    .tip-demo {
      font-size: 28rpx;
      color: $u-type-warning;
      font-weight: bold;
    }
  }
  .access {
    text-align: center;
  }
}
</style>
