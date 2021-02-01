<template>
  <view class="u-page u-fx u-fx-ver record">
    <view class="banner-img banner-crjl"></view>
    <view>
      <search-time v-model="dormDate" @get-time="getTime">
        <view>{{ totalNum }}条记录</view>
      </search-time>
    </view>
    <scroll-view scroll-y="true" class="scroll-h">
      <toggle-list :data-list="recordList">
        <template v-slot:title="props">
          <view class="u-fx-jsb">
            {{ props.list.userName }}
            {{ getDateTime(new Date(props.list.recordTime)) }}
            {{ props.list.inOrOut == 1 ? "进" : "出" }}
          </view>
        </template>
        <template v-slot:list="props">
          <view class="de_tail">
            <view>性别：{{ props.list.gender | setSex }}</view>
            <view>班级：{{ props.list.className }}</view>
            <view
              >宿舍：{{ props.list.buildingName
              }}{{ props.list.roomName }}</view
            >
            <view>记录类型：{{ getRecord(props.list.recordType) }}</view>
            <view>监控设备：{{ props.list.controllerName }}</view>
            <view
              >记录时间：{{
                getDateTime(new Date(props.list.recordTime))
              }}</view
            >
          </view>
        </template>
      </toggle-list>
      <view v-if="isAdd" class="add-page" @click="addPage">加载下一页</view>
    </scroll-view>
  </view>
</template>

<script>
import ToggleList from "../component/ToggleList";
import SearchTime from "../component/SearchTime";
import mixins from "../../../utils/mixins.js";
import { store, actions } from "../store/index.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "AccessRecord",
  mixins: [mixins],
  components: {
    ToggleList,
    SearchTime,
  },
  data() {
    return {
      dormDate: "",
      recordList: [],
      page: 1,
      size: 30,
      isAdd: false,
      totalNum: 0,
      deptType: "",
      deptCode: "",
    };
  },
  async created() {
    this.$tools.isBZR(store.userInfo).then((res) => {
      if (res) {
					this.deptType = "1";
					this.deptCode = res[0].classCode;
					this.showList();
      } else {
        this.$tools.isDormMamage(store.userInfo).then((res) => {
          if (res) {
            this.deptType = "2";
            this.deptCode = res.buildingCode;
            this.showList();
          }
        });
      }
    });
  },
  mounted() {
    this.dormDate = this.gmtToDate(
      new Date().getTime() - 3600 * 24 * 1000
    ).substring(0, 10);
  },
  methods: {
    getTime() {
      this.showList();
    },
    showList(tag = false) {
      actions
        .getAccessList({
          wdate: this.dormDate,
          schoolCode: store.userInfo.schoolCode,
          flag: this.deptType,
          deptCode: this.deptCode,
          page: this.page,
          size: this.size,
        })
        .then((res) => {
          let dataList = res.data.list;
          this.totalNum = res.data.total;
          if (dataList.length < 30) {
            this.isAdd = false;
          } else {
            this.isAdd = true;
          }
          let data = dataList.map((item) => {
            return {
              ...item,
              toggle: false,
            };
          });
          if (tag) {
            this.recordList = this.recordList.concat(data);
          } else {
            this.recordList = data;
          }
        });
    },
    addPage() {
      this.page++;
      this.showList(true);
    },
    getRecord(type) {
      if (type === "1") {
        return "抓拍 ";
      } else if (type === "2") {
        return "班牌签到";
      } else if (type === "100") {
        return "宿管补卡";
      } else {
        return "全部";
      }
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
        (d.getDate() > 9 ? d.getDate() : "0" + d.getDate()) +
        " " +
        (d.getHours() > 9 ? d.getHours() : "0" + d.getHours()) +
        ":" +
        (d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes()) +
        ":" +
        (d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds())
      );
    },
  },
};
</script>

<style lang="less" scoped>
.record {
  .banner-img {
    width: 100%;
    height: 240rpx;
    background: url(../../../static/img/dorm/crjl.png) no-repeat;
    background-size: 100% 240rpx;
  }
}
.scroll-h {
  height: calc(100vh - 420rpx);
}
.de_tail {
  padding-left: 30rpx;
}
</style>
