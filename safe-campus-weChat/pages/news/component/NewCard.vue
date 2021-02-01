<template>
  <view>
    <noData msg="暂无数据~" v-if="dataList.length === 0"></noData>
    <view
      @click="goDetail(item.id)"
      class="notice-card u-fx"
      v-for="item in dataList"
      :key="item.id"
    >
      <view class="notice-img">
        <img :src="getImg(item.imgUrl)" />
      </view>
      <view class="u-fx-f1 u-fx-jsb u-fx-ver u-mar-l">
        <view class="u-fx-ac u-fx-jsb title">
          <view class="u-fx-f1 u-font-1 u-te2">{{ item.title }}</view>
          <view class="tips-w" v-if="item.creatorCode === userCode && typeName === '教职工'"
            ><view
              class="tips"
              @click.stop="actionsheet(item.id)"
              
              >...</view
            ></view
          >
        </view>
        <view class="time u-light-color u-font-02 u-fx-jsb">
          <text>{{ item.createBy }}</text>
          <text>发布于 {{ item.createTime | getToDate }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import autoNew from "../../../static/img/news_bg.png";
import noData from "@/components/no-data/no-data.vue";
export default {
  components: {
    noData,
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      userCode: JSON.parse(uni.getStorageSync("protal")).userInfo.userCode,
      typeName: JSON.parse(uni.getStorageSync("protal")).userInfo.typeName,
    };
  },
  methods: {
    getImg(url) {
      return url.indexOf("http") > -1 ? url : autoNew;
    },
    actionsheet(id) {
      this.$emit("actionsheet", id);
    },
    goDetail(id) {
      this.$emit("goDetail", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.notice-card {
  border-radius: $u-border-radius;
  background-color: #fff;
  padding: $u-mp-20;
  margin: $u-mp-20;
  .notice-img {
    width: 180rpx;
    height: 160rpx;
    background-color: $u-bg-color;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .tips-w {
    width: 80rpx;
  }
  .tips {
    width: 80rpx;
    text-align: right;
    line-height: 60rpx;
    height: 100rpx;
    top: -30rpx;
    right: 0;
    position: absolute;
    z-index: 99;
    font-size: 60rpx;
  }
}
</style>
