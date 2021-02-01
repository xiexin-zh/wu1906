<template>
  <view>
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="u-padd-40">
        <view class="u-fx-jc">
          <view class="u-fx-ac">
            <view v-if="detail.billStatus === '1'"
              ><image class="app-icon" src="/mobile-img/ic_waitpaid.png"></image
            ></view>
            <view v-if="detail.billStatus === '2'"
              ><image class="app-icon" src="/mobile-img/ic_succeed.png"></image
            ></view>
            <view v-if="detail.billStatus === '4'"
              ><image class="app-icon" src="/mobile-img/ic_fail.png"></image
            ></view>
            <view
              class="u-mar-l u-font-3 u-type-warning"
              v-if="detail.billStatus === '1'"
              >待支付</view
            >
            <view
              class="u-mar-l u-font-3 u-type-success"
              v-if="detail.billStatus === '2'"
              >已支付</view
            >
            <view
              class="u-mar-l u-font-3 u-type-error"
              v-if="detail.billStatus === '4'"
              >已逾期</view
            >
          </view>
        </view>
        <view class="u-fx-jc u-mar-t20 u-font-1">{{
          this.detail.billName
        }}</view>
        <view class="u-fx-jc u-mar-t20 u-font-32"
          >{{ this.detail.billMoney }}.00</view
        ></view
      >
      <view class="u-padd-40 u-bg-fff">
        <view class="u-fx-jsb u-mar-t20">
          <view>姓名</view> <view>{{ this.detail.studentName }}</view></view
        >
        <view class="u-fx-jsb u-mar-t20">
          <view>学校</view> <view>{{ this.detail.schoolYearName }}</view></view
        >
        <view class="u-fx-jsb u-mar-t20">
          <view>班级</view> <view>{{ this.detail.className }}</view></view
        >
        <view class="u-bd-x u-mar-t20 u-mar-b20"></view>
        <view
          class="u-fx-jsb u-mar-t20"
          v-for="(item, i) in chargeList"
          :key="i"
        >
          <view>{{ item.itemName }}</view>
          <view>{{ item.moneySum }}.00</view></view
        >
        <view class="u-fx-je u-mar-t20">
          <view>总计：{{ this.detail.billMoney }}.00</view></view
        >
        <view class="u-fx-je u-mar-t20">
          <view></view> <view>优惠：{{ this.detail.preMoney }}.00</view></view
        >
        <view class="u-fx-je u-mar-t20">
          <view>应付：{{ this.detail.recMoney }}.00</view></view
        >
      </view>
      <view
        class="u-bd-b item-list u-bg-fff u-mar-t20 u-padd-40"
        v-if="detail.billStatus === '1'"
      >
        <view class="tip">支付方式：</view>
        <view class="u-fx-f1 u-padd-t">
          <radio-group @change="changePayMode">
            <label v-for="(item, index) in payModeList" :key="item.value">
              <view
                :class="
                  index === 0
                    ? 'uni-radio u-mar-b10 u-padd-b20 u-padd-t10 u-bd-b u-fx'
                    : 'uni-radio u-padd-t10 u-fx'
                "
              >
                <image
                  class="icon u-mar-r20"
                  :src="
                    item.value === 'WXPAY_JSAPI'
                      ? '/mobile-img/wx.png'
                      : '/mobile-img/ali.png'
                  "
                  mode=""
                ></image>
                <radio :value="item.value" :checked="item.checked" />
                <view>{{ item.name }}</view>
              </view>
            </label>
          </radio-group>
        </view>
      </view>
    </scroll-view>
    <go-pay
      v-if="detail.billStatus === '1'"
      title="立即缴费"
      :actionUrl="actionUrl"
      :payInfoUrl="payInfoUrl"
      :payStatusUrl="payStatusUrl"
      :payType="payType"
      :params="params"
    ></go-pay>
  </view>
</template>
<script>
import { store, actions } from "./store/index.js";
import hostEnv from "../../../config/index.js";
import eventBus from "@u/eventBus";
import goPay from "../component//go-pay";
export default {
  components: { goPay },
  data() {
    return {
      id: "",
      taskCode: "",
      detail: {},
      chargeList: [],
      payModeList: [
        {
          value: "WXPAY_JSAPI",
          name: "微信支付",
          checked: true,
        },
        {
          value: "ALIPAY_WAP",
          name: "支付宝支付",
        },
      ],
      payType: "WXPAY_JSAPI",
      params: {},
    };
  },
  created() {
    this.actionUrl = `${hostEnv.hzz_payment}/order/create_order`;
    this.payInfoUrl = `${hostEnv.hzz_payment}/order/continuePayMent`;
    this.payStatusUrl = `${hostEnv.hzz_payment}/order/queryOrderInfoByOrderNo`;
  },
  mounted() {
    this.id = this.$tools.getQuery().get("id");
    this.taskCode = this.$tools.getQuery().get("taskCode");
    this.getDetail();
  },
  methods: {
    changePayMode(e) {
      this.payType = e.target.value;
      this.params.payChannel = e.target.value;
    },
    async getDetail() {
      let id = this.id;
      let taskCode = this.taskCode;
      const res = await actions.getbillDetail(id);
      const cha = await actions.getCharge(taskCode);
      this.detail = res.data;
      this.chargeList = cha.data;
      this.params = {
        billNo: this.detail.batchNum,
        businessChannel: "PAYMENT",
        callbackUrl: window.localStorage.getItem("callbackUrl"),
        clientIp: "192.168.1.123",
        discountAmount: Number(this.detail.preMoney).toFixed(2),
        extra:
          this.payType === "WXPAY_JSAPI"
            ? JSON.stringify({ openId: store.openid })
            : JSON.stringify({}),
        orderAmount: Number(this.detail.billMoney).toFixed(2),
        payAmount: Number(this.detail.recMoney).toFixed(2),
        payChannel: this.payType, //支付渠道
        subject: this.detail.billName,
        timeStamp: parseInt(new Date().getTime() / 1000),
        userCode: store.userInfo.userCode,
        key: "9RYE8jJU2GPDndKpNtWVHbCeXks507SBMyaTifw1xrZo4uqlhzIA3gLQmFOv",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 100rpx);
  .app-icon {
    height: 66rpx;
    width: 66rpx;
  }
  .u-font-32 {
    font-size: 32px;
  }
  .u-bd-x {
    border-top: 1px solid #f2f2f2;
  }
}
.icon {
  width: 42rpx;
  height: 42rpx;
}
/deep/ .uni-radio {
  position: relative;
  uni-radio {
    position: absolute;
    right: 10rpx;
    .uni-radio-input {
      width: 40rpx;
      height: 40rpx;
    }
  }
}
</style>
