<template>
  <view>
    <noData msg="暂无数据~" v-if="dataList.length === 0"></noData>
    <view class="u-auto">
      <u-swipe-action
					:show="item.show"
					:index="i"
					:options="options"
					@click="click"
					@open="open"
 			    v-for="(item, i) in dataList"
					:key="i"
					:disabled="item.disabled"
          class="u-mar u-type-white-bg u-border-radius"
				>
        <view   class="u-padd-30 ">
	       <view class="u-fx-ac">
          <view class="img_">
            <image src="/mobile-img/lost.png"></image>
          </view>
          <view class="u-mar-l">{{ item.content }}</view></view
        >
        <view class="u-bd-x u-mar-t20 u-mar-b20"></view>
        <view class="u-fx-jsb">
          <view class=" u-tips-color">{{ item.createTime | gmtToDate("dateTime") }}</view>
          <view class=" u-tips-color">{{ item.createUserName }}</view></view>
       </view>
				</u-swipe-action>
    </view>
  </view>
</template>

<script>
import noData from "@/components/no-data/no-data.vue";
import index from '../../../config';
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
      options: [
        {
          text: "移除",
          style: {
            backgroundColor: "#dd524d",
          },
        },
      ],
    };
  },
  methods: {
    open(index) {
      this.$emit("open", index);
    },
    click(index, index1) {
      this.$emit("click", index, index1);
    },
  },
};
</script>

<style lang="scss" scoped>
.img_ {
  image {
    width: 50rpx;
    height: 50rpx;
  }
}
.u-bd-x {
  border-top: 1px dashed #eee;
}
</style>
