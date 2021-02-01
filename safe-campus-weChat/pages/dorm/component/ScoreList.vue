<template>
  <view>
    <view class="dialog_box">
      <view class="info_title">考评历史信息</view>
      <u-row class="history-title">
        <u-col span="4">日期</u-col>
        <u-col span="3">查寝人</u-col>
        <u-col span="3">分数</u-col>
        <u-col span="2">删除</u-col>
      </u-row>
      <u-row v-for="item in cqList" :key="item.id" class="history-detail">
        <u-col span="4">{{ getDateTime(item.workDate) }}</u-col>
        <u-col span="3">{{
          item.createUserName ? item.createUserName : "暂无"
        }}</u-col>
        <u-col span="3">{{ item.scoreValue ? item.scoreValue : "暂无" }}</u-col>
        <u-col span="2">
          <u-button
            type="primary"
            size="mini"
            @click.native="deleteRecord(item.id)"
            >删除</u-button
          >
        </u-col>
      </u-row>
    </view>
    <no-data v-if="cqList.length === 0"></no-data>
  </view>
</template>

<script>
import noData from "@/components/no-data/no-data.vue";
import { store, actions } from "../store/index.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "addScore",
  components: {
    noData,
  },
  props: {
    cqList: {
      type: Array,
      default: () => {
        return [];
      },
      required: true,
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    deleteRecord(id) {
      this.$tools.confirm("确定删除吗", () => {
        actions
          .deleteScore({
            id: id,
          })
          .then((res) => {
            this.$tools.toast("删除成功");
            this.$emit("close-record");
          });
      });
    },
    getDateTime(date, type) {
      if (date === "" || date === null) {
        return "--";
      }
      const d = new Date(date);
      return (
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)) +
        "-" +
        (d.getDate() > 9 ? d.getDate() : "0" + d.getDate())
      );
    },
  },
};
</script>

<style lang="less" scoped>
.dialog_box {
  background-color: #fff;
  padding: 20rpx 25rpx;
}
.history-title {
  background-color: #3d7eff;
  margin-top: 20rpx;
  text-align: center;
  color: #fff;
  height: 80rpx;
  line-height: 80rpx;
}
.history-detail {
  text-align: center;
  border: 1rpx solid #eee;
  border-top: none;
  height: 80rpx;
  line-height: 80rpx;
  position: relative;
}
.info_title {
  font-size: 32rpx;
  padding-left: 30rpx;
  padding-bottom: 20rpx;
  &::before {
    position: absolute;
    z-index: 99;
    content: "";
    background-color: #3d7eff;
    width: 10rpx;
    height: 40rpx;
    left: 20rpx;
    border-radius: 25rpx;
  }
}
</style>
