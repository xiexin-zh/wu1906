<template>
  <view class="detail-show u-padd-20">
    <view class="base-msg u-bg-fff">
      <view class="photo u-mar-20 u-mar-b40">
        <view class="user">
          <image class="icon" :src="studentInfo.studentPhotoUrl"></image>
          <text class="name"> {{ studentInfo.studentName }} </text>
        </view>
        <u-tag
          :text="getStatus(studentInfo.auditStatus)[0]"
          :type="getStatus(studentInfo.auditStatus)[1]"
          mode="dark"
          shape="square"
          class="status"
        />
      </view>
      <view class="msg-item u-fx u-mar-20 u-mar-b40">
        <view class="u-fx-f1"
          ><text class="u-tips-color">性别：</text>{{ Tools.getSex(studentInfo.sex) }}</view
        >
        <view class="u-fx-f1"
          ><text class="u-tips-color">学号：</text
          >{{ studentInfo.workNo }}</view
        >
      </view>
      <view class="msg-item u-fx u-mar-20 u-mar-b40">
        <view class="u-fx-f1"
          ><text class="u-tips-color">年龄：</text>{{ studentInfo.age }}</view
        >
        <view class="u-fx-f1"
          ><text class="u-tips-color">出生年月日：</text
          >{{
            studentInfo.birthday
              ? Tools.getDateTime(studentInfo.birthday, "date")
              : ""
          }}</view
        >
      </view>
      <view class="msg-item u-fx u-mar-20 u-mar-b40">
        <view class="u-fx-f1"
          ><text class="u-tips-color">民族：</text
          >{{ studentInfo.nation }}</view
        >
        <view class="u-fx-f1"
          ><text class="u-tips-color">联系电话：</text
          >{{ studentInfo.mobile }}</view
        >
      </view>
      <view class="msg-item u-fx u-mar-20 u-mar-b40">
        <view class="u-fx-f1"
          ><text class="u-tips-color">文化程度：</text
          >{{ studentInfo.cultureDegree }}</view
        >
        <view class="u-fx-f1"
          ><text class="u-tips-color">政治面貌：</text
          >{{ Tools.getPoliticsStatus(studentInfo.publicFace) }}</view
        >
      </view>
      <view class="msg-item u-fx u-mar-20 u-mar-b40">
        <view class="u-fx-f1"
          ><text class="u-tips-color">身份证号：</text
          >{{ studentInfo.idNumber }}</view
        >
      </view>
      <view class="msg-item u-fx u-mar-20 u-mar-b40">
        <view class="text-height u-fx-f1">
          <text class="u-tips-color">个人简历及转专业原因说明：</text>
          {{ studentInfo.remark }}</view
        >
      </view>
    </view>
    <view class="apply-msg u-mar-t60 u-bg-fff">
      <view class="title u-mar-20 u-mar-b40">
        <view class="line" />
        <text class="name">异动申请</text>
      </view>
      <view class="u-fx-f1 u-mar-20 u-mar-b40"
        ><text class="u-tips-color">原专业班级：</text
        >{{ studentInfo.oldClassInfo }}
      </view>
      <view class="u-fx-f1 u-mar-20 u-mar-b40"
        ><text class="u-tips-color">转入专业班级：</text
        >{{ studentInfo.newClassInfo }}
      </view>
    </view>
    <view
      class="result-msg u-mar-t60 u-bg-fff"
      v-if="studentInfo.auditStatus !== '1'"
    >
      <view class="title u-mar-20 u-mar-b40">
        <view class="line" />
        <text class="name">审批结果</text>
      </view>
      <view class="result u-mar-20 u-mar-b40">
        <view class="user u-fx">
          <image
            class="icon"
            :src="studentInfo.auditorPhotoUrl"
            v-show="studentInfo.auditorPhotoUrl"
          ></image>
          <view class="apply-user u-fx-ver">
            <text class="name"> {{ studentInfo.auditorName }} </text>
            <text>{{
              studentInfo.auditTime
                ? Tools.getDateTime(studentInfo.auditTime, "dateTime")
                : ""
            }}</text>
          </view>
        </view>
        <text
          :style="{
            color: studentInfo.auditStatus === '2' ? '#00A35F' : '#FF5454',
          }"
          >{{ getStatus(studentInfo.auditStatus)[0] }}</text
        >
        <!-- <u-tag
          :text="getStatus(studentInfo.auditStatus)[0]"
          :type="getStatus(studentInfo.auditStatus)[1]"
          mode="dark"
          shape="square"
          class="status"
        /> -->
      </view>
    </view>
  </view>
</template>

<script>
import { actions } from "../store/index.js";
import Tools from "@u/tools";
export default {
  data() {
    return {
      Tools,
      id: "",
      studentInfo: {},
    };
  },
  created() {
    this.id = this.$tools.getQuery().get("id");
    this.showData();
  },
  methods: {
    async showData() {
      const res = await actions.getInfoDetail({
        id: this.id,
      });
      this.studentInfo = res.data;
    },
    getStatus(val) {
      if (val === "1") {
        return ["审批中", "warning"];
      }
      if (val === "3") {
        return ["审批拒绝", "error"];
      }
      return ["审批通过", "success"];
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-show {
  height: 100vh;
  overflow-y: auto;

  .u-bg-fff {
    border-radius: 16rpx;
    padding: 20rpx 0;
  }

  .base-msg {
    .photo {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .user {
        align-items: center;
      }
    }
  }
  .result-msg {
    .result {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .user {
        display: flex;
        align-items: center;
      }
      .name {
        font-weight: 400;
        font-size: 28rpx;
        margin-left: 0;
      }
    }
  }
}
.title {
  display: flex;
  align-items: center;
}
.line {
  height: 40rpx;
  width: 6rpx;
  background-color: #2979ff;
}
.name {
  font-size: 36rpx;
  font-weight: bolder;
  margin-left: 20rpx;
}
.user {
  display: flex;
  align-items: flex-end;

  .icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
  }
}

.apply-user {
  margin-left: 20rpx;
}

.status {
  width: 150rpx;
  text-align: center;
}
.u-mar-t60 {
  margin-top: 20rpx;
}
.text-height {
  line-height: 60rpx;
}
</style>
