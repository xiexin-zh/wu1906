<template>
  <view>
    <view class="dialog_box">
      <view class="info_title">考评打分</view>
      <view style="padding: 0 15rpx;">
        <view class="u-of u-fx">
          <!-- <view class="">卫生：</view> -->
          <view class="rule-box">
            <view
              class="u-fx-jsa rule-list"
              v-for="item in wsList"
              :key="item.id"
              :name="item.name"
            >
              <view class="rule-name">{{ item.name }} :</view>
              <view style="text-align: center; padding-top: 4rpx;">
                <u-rate
                  current="5"
                  @change="scoreChange($event, item)"
                  :size="36"
                  active-color="#ffd21e"
                >
                </u-rate>
              </view>
              <view style="width: 40px; text-align: left;">
                <text
                  >{{
                    item.id === 9 ? item.wsValue * 4 : item.wsValue * 2
                  }}分</text
                >
              </view>
            </view>
          </view>
        </view>
        <view class="set-score">
          <text style="margin-bottom: 0;">考评总分：</text>
          <u-tag :text="scoreValue" type="success" style="margin-left: 32px;" />
        </view>
      </view>
    </view>
    <view class="submit-box">
      <view class="submit-btn" @click="submitScore">确定</view>
    </view>
  </view>
</template>

<script>
import mixins from "../../../utils/mixins.js";
import { store, actions } from "../store/index.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "addScore",
  components: {},
  mixins: [mixins],
  props: {
    wsList: {
      type: Array,
      default: () => {
        return [];
      },
      required: true,
    },
    currentRoom: {
      type: Object,
      default: () => {
        return [];
      },
      required: true,
    },
  },
  data() {
    return {
      scoreValue: 100,
      deductMarksNote: [],
      deptCode: "",
      deptName:''
    };
  },
  async created() {
    this.$tools.isDormMamage(store.userInfo).then((res) => {
      if (res) {
        this.deptCode = res.buildingCode;
        this.deptName = res.buildingName;
      }
    });
  },
  methods: {
    scoreChange(record, e) {
      this.scoreValue = 0;
      this.deductMarksNote = [];
      this.wsList.map((item) => {
        if (item.id === e.id) {
          item.wsValue = record;
          if (record > 0 && record < 5) {
            if (item.id === 9) {
              this.deductMarksNote.push(item.name + "-" + (5 - record) * 4);
            } else {
              this.deductMarksNote.push(item.name + "-" + (5 - record) * 2);
            }
          }
          if (item.id === 9) {
            item.finalValue = record * 4;
          } else {
            item.finalValue = record * 2;
          }
        }
      });
      this.wsList.forEach((ele) => {
        this.scoreValue += ele.finalValue;
      });
    },
    submitScore() {
      let req = {
        buildingCode: this.deptCode, // 楼栋编码
        buildingName: this.deptName, // 楼栋名称
        createUserCode: store.userInfo.userCode, // 当前用户编码
        createUserName: store.userInfo.userName, // 当前用户姓名
        deductMarksNote: this.deductMarksNote.join(","), // 扣分说明
        floorCode: this.currentRoom.floorCode, // 楼层编码
        floorName: this.currentRoom.floorName, // 楼层名称s
        roomCode: this.currentRoom.roomId, // 房间编码
        roomName: this.currentRoom.roomName, // 房间名称
        schoolCode: store.userInfo.schoolCode,
        schoolName: store.userInfo.schoolName, // 学校名称
        scoreValue: this.scoreValue, // 评审得分
        workDate: this.getDateTime(new Date()), // 工作日
        scoreType: "string", // 评分类型
        remarks: "string",
      };
      if (this.scoreValue === 0) {
        this.$tools.toast("请进行评分");
        return;
      }
      actions.addScore(req).then((res) => {
        this.$tools.toast("评分成功");
        this.$emit("close-score", false);
        this.wsList.map((item) => {
          item.wsValue = 5;
        });
        this.scoreValue = 100;
      });
    },
    getDateTime(time) {
      return this.gmtToDate(time).substring(0, 16);
    },
  },
};
</script>

<style lang="less" scoped>
.dialog_box {
  background-color: #fff;
  padding: 20rpx 25rpx;
  height: 800rpx;
}
.rule-box {
  flex: 1;
  color: #666;
  .rule-list {
    height: 70rpx;
    line-height: 66rpx;
    font-size: 30rpx;
    .rule-name {
      text-align: center;
      text-align: left;
    }
  }
}
.set-score {
  padding: 7px 17px;
  font-size: 32rpx;
}
.u-rate__icon {
  width: 44rpx;
}
.u-rate__item {
  padding: 0 6rpx;
}
.submit-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  color: #fff;
  background-color: #3d7eff;
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
