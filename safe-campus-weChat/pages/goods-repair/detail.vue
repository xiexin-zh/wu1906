<template>
  <view>
    <teacher-tree
      isRadio
      :teacherTag="teacherTag"
      v-show="teacherTag"
      :schoolInfo="schoolInfo"
      @close="teacherClose"
      @confirm="teacherSelcet"
      :classChecked="[]"
    ></teacher-tree>
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="u-type-white-bg u-padd-30">
        <view class="u-fx-jsb">
          <view v-if="detail.materialName === ''"
            >报修物品：{{ detail.materialRemark }}</view
          >
          <view v-if="detail.materialName != ''"
            >报修物品：{{ detail.materialTypeName }}-{{
              detail.materialName
            }}</view
          >
          <view>
            <u-tag
              v-if="detail.state === '0'"
              mode="dark"
              type="primary"
              text="待处理"
            />
            <u-tag
              v-if="detail.state === '1'"
              mode="light"
              type="primary"
              text="处理中"
            />
            <u-tag
              v-if="detail.state === '2'"
              mode="light"
              type="error"
              text="未同意"
            />
            <u-tag
              v-if="detail.state === '3'"
              mode="light"
              type="success"
              text="已修复"
            />
            <u-tag
              v-if="detail.state === '4'"
              mode="light"
              type="warning"
              text="未修复"
            />
            <u-tag
              v-if="detail.state === '5'"
              mode="dark"
              type="success"
              text="已处理"
            />
            <u-tag
              v-if="detail.state === '6'"
              mode="light"
              type="info"
              text="已撤回"
            />
          </view>
        </view>
        <view>物品位置：{{ detail.placeName }}</view>
        <view class="u-fx u-bd-b item-list u-mar-t20">
          <view>图片：</view>
          <view class="u-fx-f1">
            <view class="u-fx-f1"
              ><an-upload-img
                disabled
                v-model="photoList"
                class="upload"
              ></an-upload-img
            ></view>
          </view>
        </view>
      </view>
      <view class="u-mar-t20 u-fx-ac u-padd-30 u-type-white-bg">
        <scroll-view> <steps :detail="detail"></steps></scroll-view>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac" v-if="isHandle">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="change(3)"
        >已处理</u-button
      >
    </view>
    <view class="footer-btn u-fx-ac" v-if="isApproval">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="open"
        >审批</u-button
      >
      <u-button
        class="u-fx-f1 u-mar-r u-type-info-dark-bg u-type-white"
        @click="chooseTeacher"
        >指定他人审批</u-button
      >
    </view>
    <view
      class="footer-btn u-fx-ac"
      v-if="detail.submitUserCode === userCode && detail.state === '0'"
    >
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="change(1)"
        >撤回</u-button
      >
    </view>
    <view class="footer-btn u-fx-ac" v-if="isRepair">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="change(4)"
        >已修复</u-button
      >
      <u-button
        class="u-fx-f1 u-mar-r u-type-info-dark-bg u-type-white"
        @click="change(5)"
        >未修复</u-button
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
      <view class="u-bd-b">
        <view class="u-padd-20 u-fx-jsa u-fx">
          <u-radio-group v-model="value">
            <u-radio
              @change="radioChange"
              v-for="(item, index) in list"
              :key="index"
              :name="item.val"
              shape="circle"
              >{{ item.name }}</u-radio
            >
          </u-radio-group></view
        >
        <view class="u-padd-40">
          <template>
            <u-input
              class="resourInput u-mar-t20 u-mar-b20 u-type-white-bg u-padd-l20"
              v-model="remark"
              :type="type"
              :border="border"
              v-if="isRemark"
              placeholder="说明不同意的原因"
            />
          </template>
        </view>
      </view>
      <view
        ><view class="u-fx u-fx-jsa u-padd-40">
          <view class="u-type-info u-font-1" @click="close()">取消</view>
          <view class="u-type-primary u-font-1" @click="change(2)">确定</view>
        </view></view
      >
    </u-popup>
  </view>
</template>

<script>
import { store, actions } from "./store/index.js";
import eventBus from "@u/eventBus";
import steps from "./component/steps.vue";
import teacherTree from "@/components/teacher-tree/teacher-tree";
import anUploadImg from "@/components/an-uploadImg/an-uploadImg";
export default {
  components: { steps, teacherTree, anUploadImg },
  data() {
    return {
      id: "",
      detail: {},
      userCode: JSON.parse(uni.getStorageSync("protal")).userInfo.userCode,
      isApproval: false,
      isRepair: false,
      teacherTag: false,
      schoolInfo: {
        schoolYearId: 0,
        schoolCode: "",
      },
      approvalList: [],
      remark: "",
      list: [
        {
          name: "同意",
          val: "1",
        },
        {
          name: "不同意",
          val: "2",
        },
      ],
      value: "1",
      isRemark: false,
      isHandle: false,
      photoList: [],
      border: true,
      type: "textarea",
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
        schoolCode: store.userInfo.schoolCode,
        handleUserCode: store.userInfo.userCode,
        handleUserName: store.userInfo.userName,
        repairId: this.detail.id,
      };
      if (this.repairState === "") {
        this.$tools.toast("状态不能为空!");
        return false;
      }
      if (type === 1) {
        this.$tools.confirm("确定撤回吗", () => {
          actions.changeState({ ...req, repairState: "6" }).then((res) => {
            this.$tools.toast("撤回成功", "success");
            this.getDetail();
          });
        });
      } else if (type === 2) {
        if (this.value === "1") {
          actions
            .changeState({
              ...req,
              repairState: "1",
            })
            .then((res) => {
              this.$tools.toast("操作成功", "success");
              this.isApproval = false;
              this.isHandle = true;
              this.$tools.goNext(() => {
                this.getDetail();
              });
            });
        } else if (this.value === "2") {
          actions
            .changeState({
              ...req,
              remark: this.remark,
              repairState: "2",
            })
            .then((res) => {
              this.$tools.toast("操作成功", "success");
              this.remark = "";
              this.isApproval = false;
              this.$tools.goNext(() => {
                this.getDetail();
              });
            });
        }
        this.$refs.refuse.close();
      } else if (type === 3) {
        actions.changeState({ ...req, repairState: "5" }).then((res) => {
          this.$tools.toast("操作成功", "success");
          this.isHandle = false;
          this.isRepair = true;
          this.$tools.goNext(() => {
            this.getDetail();
          });
        });
      } else if (type === 4) {
        actions.changeState({ ...req, repairState: "3" }).then((res) => {
          this.$tools.toast("操作成功", "success");
          this.isRepair = false;
          this.$tools.goNext(() => {
            this.getDetail();
          });
        });
      } else if (type === 5) {
        actions.changeState({ ...req, repairState: "4" }).then((res) => {
          this.$tools.toast("操作成功", "success");
          this.isRepair = false;
          this.isApproval = true;
          this.$tools.goNext(() => {
            this.getDetail();
          });
        });
      }
    },
    teacherSelcet(value) {
      if (
        value[0].userCode === store.userInfo.userCode ||
        value[0].userCode === this.detail.submitUserCode
      ) {
        this.$tools.toast("指定人不能是自己或者申请人!");
        return;
      } else {
        this.approvalList = value.map((el) => {
          return {
            approvalUserCode: el.userCode,
            approvalUserName: el.userName,
            schoolCode: el.orgCode,
            repairId: this.detail.id,
            previousUserName: store.userInfo.userName,
            previousUserCode: store.userInfo.userCode,
          };
        });
        this.teacherTag = false;
      }
      actions.appointApproval(this.approvalList).then((res) => {
        this.$tools.toast("操作成功", "success");
        this.isApproval = false;
        this.$tools.goNext(() => {
          this.getDetail();
        });
      });
    },
    teacherClose() {
      this.teacherTag = false;
    },
    chooseTeacher() {
      this.teacherTag = true;
    },
    radioChange(e) {
      if (e === "1") {
        this.isRemark = false;
      } else {
        this.isRemark = true;
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
      const res = await actions.getRepairDetail(id);
      this.detail = res.data;
      res.data.repairApprovalList.forEach((el) => {
        if (
          (el.type !== "3" &&
            store.userInfo.userCode === el.approvalUserCode &&
            this.detail.state === "0") ||
          (el.type !== "3" &&
            store.userInfo.userCode === el.approvalUserCode &&
            this.detail.state === "4")
        ) {
          this.isApproval = true;
        }
      });
      res.data.pointRepairApprovalList.forEach((el) => {
        if (
          store.userInfo.userCode === el.approvalUserCode &&
          this.detail.state === "1"
        ) {
          this.isHandle = true;
        } else if (
          (el.type !== "3" &&
            store.userInfo.userCode === el.approvalUserCode &&
            this.detail.state === "4") ||
          (el.type !== "3" &&
            store.userInfo.userCode === el.approvalUserCode &&
            this.detail.state === "0")
        ) {
          this.isApproval = true;
        } else if (
          store.userInfo.userCode === el.approvalUserCode &&
          this.detail.state === "5"
        ) {
          this.isRepair = true;
        }
      });
      this.photoList = [];
      res.data.attachmentList.forEach((ele) => {
        this.photoList.push({
          url: ele.url,
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 100rpx);
}
.new-top {
  margin-top: -200rpx;
}
.resourInput {
  min-height: 96rpx !important;
  height: 34rpx !important;
}
</style>
