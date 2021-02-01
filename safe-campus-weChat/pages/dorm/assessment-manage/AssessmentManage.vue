<template>
  <view class="assessment-manage u-page u-fx u-fx-ver">
    <view class="banner-img banner-kpjl"></view>
    <view class="u-fx mar-top10 u-fx-f1">
      <view v-if="floorList.length > 0">
        <left-menu :menu-list="floorList" @change-menu="changeMenu"></left-menu>
      </view>
      <scroll-view scroll-y="true" class="scroll-h">
        <toggle-list
          :is-choose="true"
          :data-list="roomList"
          :isIcon="false"
          :toggle="false"
          @check-list="checkList"
        >
          <template v-slot:title="props">
            <view class="u-fx-jsb">
              <view>
                <text class="iconfont iconfangjianshu- ss-icon"></text>
                <text class="room-text">{{ props.list.roomName }}</text>
              </view>
              <text>
                <text
                  class="add-icon-btn"
                  @click="markScore(props.list.personList)"
                  >评分</text
                >
                <text
                  class="add-icon-btn"
                  @click="showScoreList(props.list.roomId)"
                  >记录</text
                >
              </text>
            </view>
          </template>
        </toggle-list>
      </scroll-view>
      <u-popup v-model="markScoreDialog" mode="bottom">
        <add-score
          :wsList="wsList"
          :currentRoom="currentRoom"
          @close-score="closeScoreDialog"
        ></add-score>
      </u-popup>
      <u-popup
        v-model="historyScoreDialog"
        mode="bottom"
        style="min-height: 400px; max-height: 670px; z-index: 2020;"
      >
        <score-list
          ref="scoreList"
          :cqList="cqList"
          @close-record="closeRecordDialog"
        ></score-list>
      </u-popup>
    </view>
  </view>
</template>
<script>
import LeftMenu from "../component/LeftMenu";
import ToggleList from "../component/ToggleList";
import AddScore from "../component/AddScore";
import ScoreList from "../component/ScoreList";
import { mapActions, mapState } from "vuex";
import { store, actions } from "../store/index.js";
export default {
  name: "AssessmentManage",
  components: {
    LeftMenu,
    ToggleList,
    AddScore,
    ScoreList,
  },
  data() {
    return {
      currentRoom: {},
      score: "",
      markScoreDialog: false,
      historyScoreDialog: false,
      studentResult: [],
      wsValue: [],
      jvValue: [],
      wsList: [
        {
          id: 1,
          name: "地面卫生",
          wsValue: 5,
          finalValue: 10,
        },
        {
          id: 2,
          name: "厕所卫生",
          wsValue: 5,
          finalValue: 10,
        },
        {
          id: 3,
          name: "物品摆放",
          wsValue: 5,
          finalValue: 10,
        },
        {
          id: 4,
          name: "床铺整理",
          wsValue: 5,
          finalValue: 10,
        },
        {
          id: 5,
          name: "阳台卫生",
          wsValue: 5,
          finalValue: 10,
        },
        {
          id: 6,
          name: "公共区域",
          wsValue: 5,
          finalValue: 10,
        },
        {
          id: 7,
          name: "寝室纪律",
          wsValue: 5,
          finalValue: 10,
        },
        {
          id: 8,
          name: "点名考勤",
          wsValue: 5,
          finalValue: 10,
        },
        {
          id: 9,
          name: "其他违规",
          wsValue: 5,
          finalValue: 20,
        },
      ],
      floorList: [],
      roomList: [],
      floorCode: "",
      floorName: "",
      cqList: [],
      deptType: "",
      deptCode: "",
    };
  },
  async created() {
    this.$tools.isDormMamage(store.userInfo).then((res) => {
      if (res) {
        this.deptCode = res.buildingCode;
        this.getFloorList();
      }
    });
  },
  mounted() {},
  methods: {
    getFloorList() {
      let req = {
        schoolCode: store.userInfo.schoolCode,
        buildingCode: this.deptCode,
      };
      actions.getDormFloorList(req).then((res) => {
        this.floorList = res.data.map((item) => {
          return {
            key: item.floorCode,
            value: item.floorName,
          };
        });
        this.floorCode = this.floorList[0].key;
        this.floorName = this.floorList[0].value;
        this.getRoomList(this.floorCode, this.floorName);
      });
    },
    getRoomList(floorCode, floorName) {
      this.floorCode = floorCode;
      this.floorName = floorName;
      let req = {
        floorCode: floorCode,
        floorName: floorName,
        schoolCode: store.userInfo.schoolCode,
      };
      actions.getStudentByBuild(req).then((res) => {
        this.roomList = res.data.map((item) => {
          return {
            ...item,
            toggle: false,
          };
        });
      });
    },
    changeMenu(item) {
      this.getRoomList(item.key, item.value);
    },
    checkList(item) {
      this.currentRoom = item;
      this.currentRoom.floorCode = this.floorCode;
      this.currentRoom.floorName = this.floorName;
    },
    markScore(personList) {
      if (personList.length === 0) {
        this.$tools.toast("该寝室未入住人员，不能进行评分");
      } else {
        this.markScoreDialog = true;
      }
    },
    closeScoreDialog() {
      this.markScoreDialog = false;
    },
    closeRecordDialog() {
      this.historyScoreDialog = false;
    },
    showScoreList(roomCode) {
      actions
        .getScoreList({
          schoolCode: store.userInfo.schoolCode,
          roomCode: roomCode,
          page: 1,
          size: 20,
        })
        .then((res) => {
          this.cqList = res.data;
        });
      this.historyScoreDialog = true;
    },
  },
};
</script>
<style lang="less" scoped>
.assessment-manage {
  .banner-img {
    width: 100%;
    height: 240rpx;
    background: url(../../../static/img/dorm/kpjl.png) no-repeat;
    background-size: 100% 240rpx;
  }
}
.scroll-h {
  height: calc(100vh - 420rpx);
}
.add-icon-btn {
  height: 50rpx;
  line-height: 50rpx;
  display: inline-block;
  padding: 0 20rpx;
  border: 1rpx solid #3d7eff;
  background-color: #fff;
  color: #3d7eff;
  text-align: center;
  border-radius: 6rpx;
  margin-left: 15rpx;
}
.room-text {
  font-size: 30rpx;
  color: #666;
  font-weight: bold;
}
</style>
