<template>
  <view>
    <scroll-view scroll-y="true" class="scroll-h">
      <view class="u-type-white-bg u-padd-30">
        <view class="u-fx-jsb">
          <view
            >开始时间：{{ substituteForm.startTime | gmtToDate("date") }}</view
          >
          <view>
            <u-tag
              v-if="substituteForm.approvalState === 1"
              mode="dark"
              type="primary"
              text="待审批"
            />
            <u-tag
              v-if="substituteForm.approvalState === 2"
              mode="dark"
              type="success"
              text="已同意"
            />
            <u-tag
              v-if="substituteForm.approvalState === 3"
              mode="dark"
              type="error"
              text="未同意"
            />
            <u-tag
              v-if="substituteForm.approvalState === 4"
              mode="dark"
              type="info"
              text="已撤回"
            />
          </view>
        </view>
        <view class="u-mar-5"
          >结束时间：{{ substituteForm.stopTime | gmtToDate("date") }}</view
        >
        <view class="u-mar-t20">
          调代课原因：{{ substituteForm.description }}</view
        >
        <view class="u-fx u-bd-b item-list u-mar-t20">
          <view>上传图片：</view>
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
      <view v-for="(item, i) in detail.substituteInfoList" :key="i" v-if="item.category !== null">
        <view class="u-mar-t20 u-padd-30 u-type-white-bg">
          <view >
            <view class="">
              <text>{{ item.fromTeacherName }}</text>
              <text class="u-padd-l40">
                {{ item.fromGradeName }}{{ item.fromClassName }}第{{
                  item.fromLesson
                }}节{{ item.fromSubjectName
                }}{{ item.fromCourseTime | gmtToDate("date") }}星期{{
                  convertToChinese(item.fromWeek)
                }}</text
              >
            </view>
            <view
              v-if="
                item.category === 2 ||
                item.category === 3 ||
                item.category === 4
              "
              class="u-fx-jc u-mar-t20"
            >
              <image src="/mobile-img/arrow.png"></image>
              <u-tag text="调课" mode="light" type="primary"
            /></view>
            <view class="u-mar-t20" v-if="item.category === 2">
              <text>{{ item.toTeacherName }}</text>
              <text class="u-padd-l40"
                >{{ item.toGradeName }}{{ item.toClassName }}第{{
                  item.toLesson
                }}节{{ item.toSubjectName
                }}{{ item.toCourseTime | gmtToDate("date") }}星期{{
                  convertToChinese(item.toWeek)
                }}</text
              >
            </view>
            <view class="u-fx-jc u-mar-t20" v-if="item.category === 3">
              <text>自修</text>
            </view>
            <view class="u-fx-jc u-mar-t20" v-if="item.category === 4">
              <text>教务处理</text>
            </view>
            <view class="u-fx-jc u-mar-t20" v-if="item.category === 1">
              <image src="../../static/img/arrow.png"></image>
              <u-tag text="代课" mode="light" type="primary" />
            </view>
            <view class="u-fx-jc u-mar-t20" v-if="item.category === 1">{{ item.toTeacherName }}</view>
          </view>
        </view>
      </view>
      <view class="u-mar-t20 u-fx-ac u-padd-30 u-type-white-bg">
        <view>
          <approval-step :data-list="dataList"></approval-step>
        </view>
      </view>
    </scroll-view>
    <view class="footer-btn u-fx-ac" v-if="isApproval">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="open"
        >审批</u-button
      >
    </view>
    <view
      class="footer-btn u-fx-ac"
      v-if="
        substituteForm.createUsercode === userCode &&
        substituteForm.approvalState === 1 &&
        this.isRe === -1
      "
    >
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg"
        @click="backOff()"
        >撤回</u-button
      >
    </view>
    <u-popup
      :maskCloseAble="true"
      ref="refuse"
      mode="center"
      length="80%"
      border-radius="14"
    >
      <view class="u-bd-b">
        <view class="u-padd-40 u-fx-jsa u-fx">
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

        <view class="pop">
          <template>
            <u-input
              v-model="remarks"
              :type="type"
              :border="border"
              v-if="isRemark"
              maxlength="10"
              placeholder="说明不同意的原因"
            />
          </template>
        </view>
      </view>
      <view
        ><view class="u-fx u-fx-jsa u-padd-40">
          <view class="u-type-info u-font-1" @click="close()">取消</view>
          <view class="u-type-primary u-font-1" @click="change()">确定</view>
        </view></view
      >
    </u-popup>
  </view>
</template>

<script>
import { store, actions } from "./store/index.js";
import anUploadImg from "@/components/an-uploadImg/an-uploadImg";
export default {
  components: { anUploadImg },
  data() {
    return {
      id: "",
      detail: {},
      userCode: JSON.parse(uni.getStorageSync("protal")).userInfo.userCode,
      isApproval: false,
      remarks: "",
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
      photoList: [],
      border: true,
      type: "textarea",
      dataList: [],
      isRemark: false,
      substituteForm: {},
      weekday: ["零", "一", "二", "三", "四", "五", "六", "七"],
      appState: "",
      approverId: "",
      lastIndex: "",
      nextApproval: "",
      nextId: "",
      isRe: "",
    };
  },
  created() {},
  mounted() {
    this.id = this.$tools.getQuery().get("id");
    this.getDetail();
  },
  methods: {
    async backOff() {
      this.$tools.confirm("确定撤回吗", () => {
        actions.revokeSub(this.detail.substituteForm.id).then((res) => {
          this.$tools.toast("撤回成功", "success");
          this.getDetail();
        });
      });
    },
    async change() {
      if (this.value === "1") {
        this.appState = 2;
      } else if (this.value === "2") {
        this.appState = 3;
      }
      if (
        this.detail.substituteApproversList[this.lastIndex + 1] !== undefined
      ) {
        this.nextApproval = this.detail.substituteApproversList[
          this.lastIndex + 1
        ].approverCode;
        this.nextId = this.detail.substituteApproversList[
          this.lastIndex + 1
        ].id;
      } else {
        this.nextApproval = "";
        this.nextId = "";
      }
      const req = {
        approverCode: store.userInfo.userCode,
        id: this.approverId,
        approvalState: this.appState,
        remarks: this.remarks,
        substituteFormId: this.id,
        nextApproval: this.nextApproval,
        nextId: this.nextId,
      };
      actions.approvalSub(req).then((res) => {
        this.$tools.toast("操作成功", "success");
        this.isApproval = false;
        this.$tools.goNext(() => {
          this.getDetail();
        });
      });
      this.$refs.refuse.close();
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
      const res = await actions.getSubDetail(id);
      this.detail = res.data;
      this.substituteForm = res.data.substituteForm;
      this.photoList = [];
      res.data.substituteFileList.forEach((ele) => {
        this.photoList.push({
          url: ele.url,
        });
      });
      this.dataList = this.detail.substituteApproversList.map((el, index) => {
        return {
          dateTime: el.approvalState !== 1 ? el.approvalTime : undefined,
          label: "审批人",
          labelName: el.approverName,
          statusName:
            el.approvalState === 1
              ? "待审批"
              : el.approvalState === 2
              ? "已同意"
               : el.approvalState === 4
              ? "已撤回"
              : "未同意",
          remarks: el.remarks,
        };
      });
      res.data.substituteApproversList.forEach((el) => {
        if (
          store.userInfo.userCode === el.approverCode &&
          el.approvalState === 1 &&
          this.detail.substituteForm.approvalState === 1
        ) {
          this.approverId = el.id;
          this.isApproval = true;
        }
      });
      this.lastIndex = this.detail.substituteApproversList.findIndex(
        (value) => value.approvalState == 1
      );
      this.isRe = this.detail.substituteApproversList.findIndex(
        (value) => value.approvalState == 2
      );
    },
    convertToChinese(num) {
      var str = num.toString();
      var len = num.toString().length;
      var C_Num = [];
      for (var i = 0; i < len; i++) {
        C_Num.push(this.weekday[str.charAt(i)]);
      }
      return C_Num.join("");
    },
  },
};
</script>
<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 100rpx);
  .u-mar-5 {
    margin-top: 5px;
  }
  image {
    width: 35rpx;
    height: 40rpx;
    margin-top: 8rpx;
    margin-right: 20rpx;
  }
}
.pop {
  padding: 0 20px;
}
</style>
