<template>
  <view class="footer-btn u-fx-ac">
    <u-button
      @click="goPay"
      type="primary"
      class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
      >{{ title }}</u-button
    >
  </view>
</template>
<script>
import uniRequest from "uni-request";
import $ajax from "../campus-payment-p/store/request.js";
import hostEnv from "../../../config/index.js";
import md5 from "js-md5";
export default {
  components: {},
  props: {
    title: {
      // 充值按钮名
      type: String,
      default: "确认充值",
    },
    actionUrl: {
      // 充值接口地址
      type: String,
      default: "",
    },
    payInfoUrl: {
      // 按充值账单继续充值接口地址
      type: String,
      default: "",
    },
    payStatusUrl: {
      // 查询充值状态接口地址
      type: String,
      default: "",
    },
    params: {
      // 充值参数
      type: Object,
      default: () => {
        return {};
      },
    },
    payType: {
      // 充值方式： 微信'WXPAY_JSAPI' 支付宝'ALIPAY_WAP'
      type: String,
      default: "WXPAY_JSAPI",
    },
  },
  data() {
    return {};
  },
  async mounted() {},
  methods: {
    // 生成签名
    getSign(params) {
      let arr = [];
      for (let i in params) {
        arr.push(i + "=" + params[i]);
      }
      let urlStr = arr.join("&");
      return md5(urlStr).toUpperCase();
    },
    onBridgeReady(payParams) {
      let _self = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: payParams.appId, //公众号名称，由商户传入
          timeStamp: payParams.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: payParams.nonceStr, //随机串
          package: payParams.package,
          signType: payParams.signType, //微信签名方式：
          paySign: payParams.paySign, //微信签名
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            _self.$tools.toast("充值成功", "success");
            eventBus.$emit("getList");
            _self.$tools.goBack();
          }
        }
      );
    },
    async goPay() {
      const res = await $ajax.post({
        url: this.actionUrl,
        header: {
          Authorization: window.localStorage.getItem("Authorization"),
        },
        params: {
          sign: this.getSign(this.params),
          ...this.params,
          key: undefined,
        },
      });
      if (this.payType === "WXPAY_JSAPI") {
        // 微信支付
        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener(
              "WeixinJSBridgeReady",
              this.onBridgeReady(res.data.payParams),
              false
            );
          } else if (document.attachEvent) {
            document.attachEvent(
              "WeixinJSBridgeReady",
              this.onBridgeReady(res.data.payParams)
            );
            document.attachEvent(
              "onWeixinJSBridgeReady",
              this.onBridgeReady(res.data.payParams)
            );
          }
        } else {
          this.onBridgeReady(res.data.payParams);
        }
      } else {
        this.$tools.navTo({
          url: `/pages/campus-payment/campus-payment-p/alipay?payInfoUrl=${
            this.payInfoUrl
          }?orderNo=${res.data.orderId}&payStatusUrl=${
            this.payStatusUrl
          }&token=${window.localStorage.getItem("Authorization")}`,
        });
      }
    },
  },
};
</script>

<style lang="scss"></style>
