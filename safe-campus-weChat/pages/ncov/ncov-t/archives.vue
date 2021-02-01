<template>
  <view class="u-page u-bg-fff">
    <view class="tab-list">
      <view class="u-fx-jc">
        <view class="tab-title u-fx">
          <view
            v-for="tab in tabList"
            :key="tab.id"
            @click="changTab(tab)"
            :class="{ act: tabIndex === tab.id }"
            class="tab"
          >
            {{ tab.title }}
          </view>
        </view>
      </view>
    </view>
    <scroll-view scroll-y="true" class="scroll-h">
      <scroll-view scroll-x="true" class="scroll-x">
        <view class="set-sco">
          <view id="total-pic"></view>
        </view>
      </scroll-view>
      <view class="report">
        <view class="u-fx-jsa">
          <view class="info u-fx-ac-jc">
            <text>已上报</text>
            <text>{{ userList.upRecordCount }}天</text>
          </view>
          <view class="info u-fx-ac-jc no">
            <text>未上报</text>
            <text>{{ userList.noRecordCount }} 天</text>
          </view>
          <view class="info u-fx-ac-jc err">
            <text>发热</text>
            <text>{{ userList.feverCount }} 天</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import { actions, store } from "./store/index";
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
export default {
  components: {},
  data() {
    return {
      userList: {},
      tabList: [
        {
          id: 0,
          title: "近七日",
        },
        {
          id: 1,
          title: "近一个月",
        },
      ],
      currentIndex: "1",
      tabIndex: 0,
      reportTime: [],
      temperature: [],
      startDate: this.$tools.getPhoneTime(
        new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000),
        "date"
      ),
    };
  },
  mounted() {
    this.showList();
  },
  methods: {
    changTab(tab) {
      this.tabIndex = tab.id;
      if (tab.id === 0) {
        this.startDate = this.$tools.getPhoneTime(
          new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000),
          "date"
        );
      } else {
        this.startDate = this.$tools.getPhoneTime(
          new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000),
          "date"
        );
      }
      this.showList();
    },
    async showList() {
      let req = null;
      req = {
        schoolCode: store.userInfo.schoolCode,
        userCode: store.userInfo.userCode,
        startDate: this.startDate,
        endDate: this.$tools.getPhoneTime(new Date(), "date"),
      };
      const res = await actions.getPersonalStatic(req);
      const qes = await actions.getTemperatureData(req);
      this.userList = res.data;
      if (qes.data) {
        this.temperature = [];
        this.reportTime = [];
        qes.data.forEach((ele) => {
          if (ele.temperature === null) {
            ele.temperature = 0;
          }
          this.temperature.push(ele.temperature);
          this.reportTime.push(
            this.$tools.getPhoneTime(new Date(ele.date), "date")
          );
        });
      }
      this.drawLine(this.feverData, this.xDate);
    },
    drawLine(feverData, xDate) {
      let myChart = echarts.init(document.getElementById("total-pic"));
      myChart.setOption({
        xAxis: {
          type: "category",
          data: this.reportTime,
          axisLabel: {
            show: true,
            textStyle: {
              color: "grb(153,153,153)",
              fontSize: 10,
            },
            // rotate: 30,
          },
        },
        yAxis: {
          name: "健康曲线(℃)", // y轴名称
          axisLabel: {
            textStyle: {
              color: "grb(153,153,153)",
              fontSize: 10,
            },
          },
        },
        tooltip: {
          pointFormat: "{series.name} <b>{point.y}</b>℃",
        },
        series: [
          {
            name: "体温",
            data: this.temperature,
            type: "line",
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#ebf1fb",
                },
                {
                  offset: 1,
                  color: "#fff",
                },
              ]),
            },
            label: {
              normal: {
                show: true,
                position: "top",
              },
            },
            lineStyle: {
              color: "#2979ff",
            },
            itemStyle: {
              color: "#2979ff",
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-h {
  height: calc(100vh - 100rpx);
}
.scroll-x {
  width: 100%;
}
.tab-list {
  padding: 0 0 6rpx 0;
}
.tab-title {
  border: 1px $u-border-color solid;
  overflow: hidden;
  border-radius: $u-border-radius;
  .tab {
    text-align: center;
    width: 380rpx;
    line-height: 80rpx;
    height: 80rpx;
    border-left: 1px $u-border-color solid;
    &:first-child {
      border-left: none;
    }
  }
  .act {
    background-color: $u-type-primary;
    color: #fff;
  }
}
.report {
  margin: 20rpx 0 0 10rpx;
  .info {
    background-color: $u-bg-color;
    border-radius: $u-border-radius;
    padding: 40rpx 60rpx;
    text:first-child {
      margin-bottom: 10rpx;
    }
  }
  .err {
    color: $u-type-error;
  }
  .no {
    color: $u-type-warning-disabled;
  }
}
#total-pic {
  height: 600rpx;
}
.set-sco {
  width: 600px;
  overflow-x: scroll;
}
</style>
