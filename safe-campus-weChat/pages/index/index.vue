<template>
  <view class="u-page">
    <view class="header">智慧校园移动端项目</view>
    <scroll-view scroll-y="true" class="scroll-h">
      <view v-for="(module, index) in moduleList" :key="index">
        <view class="module-title">{{ module.title }}</view>
        <view class="app u-type-white-bg">
          <view
            v-for="(app, index) in module.children"
            :key="index"
            class="app-list u-fx-ac-jc"
            @click="goApp(app)"
          >
						<view><img :src="appIcon" alt="" /></view>
            <view class="app-name">{{ app.title.split("-")[0] }}</view>
            <view class="role-name">{{ app.title.split("-")[1] }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import moduleList from "./module/index.js";
import appIcon from "./app.png";
export default {
  data() {
    return {
      moduleList,
      appIcon,
    };
  },
  components: {},
  mounted() {},
  methods: {
    goApp(app) {
			console.log(app)
      this.$tools.navTo({
        url: app.url,
        title: app.title,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background-color: $u-type-primary;
  color: #fff;
}
.module-title {
  height: 60rpx;
  color: #666;
  background-color: #ddd;
  line-height: 60rpx;
  padding: 0 10rpx;
}
.app-list {
  color: #666;
  width: 25%;
  float: left;
  padding: 15rpx 0;
  img {
    width: 50rpx;
    height: 50rpx;
    display: block;
  }
}
.app {
  overflow: auto;
}
.app-name {
  margin-top: 8rpx;
  font-size: 28rpx;
}
.role-name {
  font-size: 26rpx;
  color: #999;
  margin-top: 4rpx;
}
.scroll-h {
  height: calc(100vh - 80rpx);
}
</style>
