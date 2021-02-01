<template>
  <view>
    <noData msg="暂无数据~" v-if="dataList.length === 0"></noData>
    <view class="notice-card u-fx"  v-for="item in dataList" :key="item.id">
      <view class="notice-img"> </view>
      <view class="u-fx-f1 u-fx-jsb u-fx-ver u-mar-l">
        <view class="u-fx-ac u-fx-jsb title">
          <view class="u-fx-f1 u-font-1 u-te"  @click="goDetail(item.id, item)">{{
            item.title
          }}</view>
          <view class="tips-w"
            ><view
              class="tips"
              @click.stop="actionsheet(item.id)"
              v-if="item.creatorCode === userCode"
              >...</view
            ></view
          >
        </view>
        <view class="content u-content-color u-te2" @click="goDetail(item.id, item)">{{ item.content }}</view>
        <view class="time u-light-color u-font-02 u-fx-jsb u-fx-ac">
					<view class="u-fx">
						<text class="u-mar-r10">{{ item.createBy }}</text>
						<text>发布于 {{ item.createTime | getToDate }}</text>
					</view>
          <view v-if="item.creatorCode === userCode">
            <u-tag
              color="#2db7f5"
              text="阅读状态"
              class="readstaus"
              @click="readStatus(item.id)"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
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
    };
  },
  methods: {
    actionsheet(id) {
      this.$emit("actionsheet", id);
    },
    goDetail(id, notice) {
      this.$emit("goDetail", id, notice);
    },
    readStatus(id) {
      this.$emit("readStatus", id);
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
    width: 0rpx;
    height: 180rpx;
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
