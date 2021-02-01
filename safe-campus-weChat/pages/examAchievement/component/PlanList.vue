<template>
  <view class="planList">
    <noData msg="暂无数据~" v-if="dataList.length === 0"></noData>
    <view class="u-auto">
      <view
        class="u-fx-ac u-mar u-padd-20 u-type-white-bg u-border-radius"
        v-for="(item, i) in dataList"
        :key="i"
      >
        <view class="img_">
          <image src="/mobile-img/grades.png"></image>
        </view>
        <view class="u-padd-40 u-padd-l10 u-padd-r10">
          <view class="u-font-3 u-mar-t">{{ item.name }}</view>

          <view class="u-mar-t u-type-info"
            >考试年级：{{ item.gradeName }}{{ item.professionName ? ('级' + item.professionName) : '' }}</view
          >
          <view class="u-mar-t u-type-info"
            >考试日期：{{ item.startDate | gmtToDate("date") }}</view
          >
          <!-- <view class="u-mar-t u-type-error" v-if="item.ifEnter === '0'"
            >暂未上传成绩</view
          > -->
        </view>

        <view class="u-padd-l10">
             <view class="u-mar-t u-type-error" v-if="item.ifEnter === '0'"
            >暂未上传</view
          >
          <u-button type="primary" size="mini" v-if="item.ifEnter === '1'" @click="goDetail(item)"
            >查看成绩</u-button
          >
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
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    goDetail(id) {
      this.$emit("goDetail", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.planList {
  .img_ {
    image {
      width: 100rpx;
      height: 100rpx;
    }
  }
  .p-18 {
    padding-left: 36rpx;
  }
}
</style>
