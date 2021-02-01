<template>
  <view class="u-page">
    <view class="list">
      <view class="th u-fx-jsa u-fx-ac u-fx-jc title_">
        <text class="left">选择</text>
        <view class="u-checkbox__label">
          <text>姓名</text>
          <text>值日次数</text>
          <view>图像</view>
        </view>
      </view>
      <no-data
        msg="该班级没有学生，无法排值日表~"
        v-if="dataList.length === 0"
      ></no-data>
      <scroll-view scroll-y="true" class="scroll-h" @scrolltolower="loadMore">
        <u-checkbox-group class="u-fx-ver" width="100%">
          <label
            class="tbody u-bd-b u-fx-jsa"
            v-for="(item, index) in dataList"
            :key="index"
          >
            <u-checkbox
              @change="checkBox"
              v-model="item.checked"
              :disabled="item.disabled"
              class="u-fx-jsb"
              :name="`${item.userCode}^${item.userName}=${item.photoUrl}`"
            >
              <text>{{ item.userName }}</text>
              <text>{{ item.count }}</text>
              <view><image class="img" :src="item.photoUrl" alt="" /></view>
            </u-checkbox>
          </label>
        </u-checkbox-group>
      </scroll-view>
    </view>
    <view class="submit-box u-fx">
      <view class="btn1" @click="cancel()">取消</view>
      <view class="btn2" @click="addInfo()">保存</view>
    </view>
  </view>
</template>

<script>
import eventBus from "@u/eventBus";
import { actions, store } from "./store/index";
import noData from "@/components/no-data/no-data.vue";
export default {
  components: { noData },
  data() {
    return {
      dataList: [],
      userInfoList: [],
      pageList: {
        page: 1,
        size: 15,
      },
      morePage: false,
      checkList: [],
      gradeId: "",
      classId: "",
      key: "",
      countInfoList: [],
      classCode: "",
      schoolYearId: "",
      disabled: false,
      ratedPersonList: [],
    };
  },
  watch: {
    checkList: {
      handler: function (val, oldval) {
        this.userInfoList = [];
        val.map((el) => {
          this.userInfoList.push({
            userCode: el.split("^")[0],
            userName: el.split("^")[1].split("=")[0],
            photoUrl: el.split("^")[1].split("=")[1],
            schoolCode: store.userInfo.schoolCode,
            schoolYearId: this.schoolYearId,
            classCode: this.classCode,
            weekDay: this.key,
          });
        });
      },
      deep: true,
    },
  },
  async created() {
    this.schoolYearId = uni.getStorageSync("classInfo").schoolYearId;
    this.classCode = uni.getStorageSync("classInfo").classCode;
    this.key = this.$tools.getQuery().get("key");
  },
  mounted() {
    this.showList();
  },
  methods: {
    async showList(tag = false) {
      if (tag) {
        this.pageList.page += 1;
      } else {
        this.pageList.page = 1;
      }
      const req = {
        ...this.pageList,
        schoolCode: store.userInfo.schoolCode,
        schoolYearId: this.schoolYearId,
        classId: this.classCode,
      };
      const res = await actions.getStudentList(req);
      if (tag) {
        this.dataList = this.dataList.concat(res.data.list);
      } else {
        this.dataList = res.data.list;
      }
      this.dutyList();
      this._getdutyList();
      this.morePage = res.data.hasNextPage;
    },
    loadMore() {
      if (!this.morePage) {
        this.$tools.toast("数据已加载完毕");
        return;
      }
      this.showList(true);
    },
    async _getdutyList() {
      const req = {
        schoolCode: store.userInfo.schoolCode,
        classCode: this.classCode,
        schoolYearId: this.schoolYearId,
      };
      const res = await actions.getdutyList(req);
      if (!res.data.countInfo) {
        this.ratedPersonList = [];
        return;
      }
      this.ratedPersonList = res.data.countInfo;
      this.dataList.forEach((ele) => {
        ele.count = 0;
        this.$set(this.dataList, "ele", {
          ...ele,
        });
        this.ratedPersonList.forEach((item) => {
          if (ele.userCode === item.userCode) {
            ele.count = item.count;
            this.$set(this.dataList, "ele", {
              ...ele,
            });
          }
        });
      });
    },
    async dutyList() {
      const req = {
        classCode: this.classCode,
        schoolCode: store.userInfo.schoolCode,
        schoolYearId: this.schoolYearId,
        weekDay: this.key,
      };
      const res = await actions.getcountInfo(req);
      if (!res.data) {
        this.countInfoList = [];
        return;
      }
      this.countInfoList = res.data;
      this.dataList.forEach((item) => {
        this.countInfoList.forEach((ele) => {
          if (item.userCode === ele.userCode) {
            item.checked = true;
            item.disabled = true;
          }
        });
      });
    },
    cancel() {
      this.userInfoList = [];
      this.checkList = [];
      eventBus.$emit("getList");
      this.$tools.goBack();
    },
    checkBox(e) {
      if (e.value) {
        this.checkList.push(e.name);
      } else {
        this.checkList.splice(this.checkList.indexOf(e.name), 1);
      }
    },
    addInfo() {
      if (this.userInfoList.length === 0) {
        this.$tools.toast("人员信息不能为空！");
        return;
      }
      actions.addDuty(this.userInfoList).then((res) => {
        this.$tools.toast("操作成功", "success");
        this.$tools.goNext(() => {
          this.userInfoList = [];
          eventBus.$emit("show");
          this.$tools.goBack();
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 180rpx);
}
.submit-box {
  height: 100rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  .btn1 {
    width: 50%;
    line-height: 100rpx;
    text-align: center;
    background-color: #fff;
    color: $u-content-color;
    border-radius: $u-border-radius;
  }
  .btn2 {
    width: 50%;
    line-height: 100rpx;
    text-align: center;
    letter-spacing: 8rpx;
    background-color: $u-type-primary;
    color: #fff;
  }
}
.title_ {
  height: 80rpx;
}
.list {
  font-size: 28rpx;
  .th {
    background: $u-type-primary-dark;
    padding: 20rpx;
    color: #fff;
  }
  .tbody {
    position: relative;
    padding: 25rpx 20rpx;
    background: $uni-bg-color;
  }
  .tbody:nth-child(even) {
    background: $u-bg-color;
  }
  .left {
    width: 10%;
    text-align: center;
  }
}
.u-checkbox-group,
.u-checkbox {
  width: 100%;
}
/deep/ .u-checkbox__label {
  width: 90%;
  margin: 0;
  display: flex;
  justify-content: space-between;
  text {
    text-align: center;
  }
  view {
    text-align: center;
  }
  text:nth-child(1) {
    width: 30%;
  }
  text:nth-child(2) {
    width: 30%;
  }
  view:nth-child(3) {
    width: 40%;
  }
}
/deep/ .u-checkbox__icon-wrap {
  width: 10%;
}
/deep/ .u-checkbox__icon {
  margin: 0 auto;
}
.img {
  width: 40px;
  height: 40px;
  background-color: $u-bg-color;
  display: block;
  margin: 0 auto;
}
.u-fx-jsb text {
  padding-top: 10px;
}
</style>
