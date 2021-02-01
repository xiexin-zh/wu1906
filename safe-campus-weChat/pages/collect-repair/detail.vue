<template>
  <view>
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="u-type-white-bg u-padd-30">
        <view class="u-fx-jsb">
          <view>申领人：{{ detail.applicantName }}</view>
          <view>
            <u-tag
              v-if="detail.state === '0'"
              mode="light"
              type="primary"
              text="待审批"
            />
            <u-tag
              v-if="detail.state === '1'"
              mode="light"
              type="warning"
              text="待发放"
            />
            <u-tag
              v-if="detail.state === '2'"
              mode="light"
              type="error"
              text="已退回"
            />
            <u-tag
              v-if="detail.state === '3'"
              mode="light"
              type="success"
              text="已发放"
            />
          </view>
        </view>
        <view class="u-fx">
          <view> 领用物品:</view>
          <view>
            <view
              class=""
              v-for="(ele, index) in detail.collectNaterialNameList"
              :key="index"
            >
              {{ ele.materialTypeName }}-{{ ele.materialName }}-{{
                ele.number
              }}份
            </view></view
          >
        </view>
        <view class="u-fx u-mar-t20"
          >申请时间：{{ detail.createTime | gmtToDate("dateTime") }}
        </view>
        <view class="u-fx u-mar-t20" v-if="detail.state === '2'"
          >退回原因：{{ detail.remark }}
        </view>
      </view>
    </scroll-view>
    <view
      class="footer-btn u-fx-ac"
      v-if="detail.approvalUserCode === userCode && detail.state === '0'"
    >
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="change(1)"
        >同意</u-button
      >
      <u-button
        class="u-fx-f1 u-mar-r u-type-info-dark-bg u-type-white"
        @click="open"
        >不同意</u-button
      >
    </view>
    <u-popup
      :maskCloseAble="true"
      ref="refuse"
      mode="center"
      length="80%"
      border-radius="14"
            class="new-top"

    >
      <view class="pop u-fx-ver u-padd-40">
        <input v-model="remark" placeholder="说明不同意的原因" />
        <view class="u-fx u-fx-jsa u-mar-t20">
          <view class="btn1" @click="change(2)">确定</view>
          <view class="btn2" @click="close()">取消</view></view
        >
      </view>
    </u-popup>
  </view>
</template>

<script>
import { store, actions } from "./store/index.js";
import eventBus from "@u/eventBus";
import autoNew from "../../static/img/news_bg.png";
export default {
  components: {},
  data() {
    return {
      id: "",
      detail: {},
      userCode: JSON.parse(uni.getStorageSync("protal")).userInfo.userCode,
      schoolInfo: {
        schoolYearId: 0,
        schoolCode: "",
      },
      remark: "",
    };
  },
  created() {
    this.schoolInfo.schoolCode = store.userInfo.schoolCode;
    this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId;
  },
  mounted() {
    this.id = this.$tools.getQuery().get("id");
    this.getDetail();
  },
  methods: {
    async change(type) {
      const req = {
        userCode: store.userInfo.userCode,
        userName: store.userInfo.userName,
        formId: this.detail.id,
        remark: this.remark,
      };
      if (type === 1) {
        this.$tools.confirm("确定同意吗", () => {
          actions
            .updateState({
              ...req,
              state: "1",
            })
            .then((res) => {
              this.$tools.toast("操作成功", "success");
              this.getDetail();
            });
        });
      } else if (type === 2) {
        actions
          .updateState({
            ...req,
            state: "2",
          })
          .then((res) => {
            this.$tools.toast("操作成功", "success");
            this.remark = "";
            this.$refs.refuse.close();
            this.$tools.goNext(() => {
              this.getDetail();
            });
          });
      }
    },
    open() {
      this.$refs.refuse.open();
    },
    close() {
      this.$refs.refuse.close();
    },
    async getDetail() {
      let id = this.id;
      const res = await actions.getcollectionDetail(id);
      this.detail = res.data;
    },
  },
};
</script>
<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 100rpx);
}

.footer {
  height: 100rpx;
}
.detail {
  margin: $u-mp-40;
}
.process-type {
  top: 0;
  right: 40rpx;
  position: absolute;
  font-size: 48rpx;
}
.pop {
  text-align: center;
  input {
    border: 1rpx solid #ddd;
    margin: 20rpx 0;
    height: 100rpx;
    $u-border-radius-big: 16rpx;
  }
  .btn1 {
    padding: 0 20rpx;
    height: 70rpx;
    line-height: 70rpx;
    text-align: center;
    letter-spacing: 8rpx;
    background-color: $u-type-primary;
    color: #fff;
    border: 1px $u-border-color solid;
    border-radius: $u-border-radius;
  }
  .btn2 {
    padding: 0 20rpx;
    height: 70rpx;
    line-height: 70rpx;
    text-align: center;
    letter-spacing: 8rpx;
    color: #000;
    border: 1px $u-border-color solid;
    border-radius: $u-border-radius;
  }
}
.u-mar-t20 {
  text:first-child {
    display: flex;
    flex-direction: column;
  }
}
.new-top {
  margin-top: -200rpx;
}
</style>
