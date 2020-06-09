<template>
  <div class="apiViewBox">
    <div class="apiTitle">SP NF API 測試結果</div>
    <div class="mainContent">
      <div class="chartTitle">
        <p class="zhouqi-title">
          <span>最近一輪測試週期</span>
          <span>{{testDay}}</span>
        </p>
        <p class="zhouqi-time">{{startTime}}- {{endTime}}（{{timeGap}}）</p>
      </div>
      <div class="viewMain">
        <div id="apiView"></div>
      </div>
      <div class="refresh">
        <span>刷新倒計時：</span>
        <span class="time">{{timeEnd}}</span>
        S
      </div>
    </div>
  </div>
</template>

<script>
import * as DataAction from "../../api/dataAction";
export default {
  data() {
    return {
      testData: {},
      timeEnd: 60,
      timer: null
    };
  },
  computed: {
    testDay() {
      return this.testData.day ? this.testData.day : "N/A";
    },
    startTime() {
      if (!this.testData.start_time) {
        return "N/A";
      }
      return this.formatTime(this.testData.start_time * 1000);
    },
    endTime() {
      if (!this.testData.end_time) {
        return "N/A";
      }
      return this.formatTime(this.testData.end_time * 1000);
    },
    timeGap() {
      let result = this.testData.end_time - this.testData.start_time;
      let h =
        Math.floor(result / 3600) <= 0 ? "" : Math.floor(result / 3600) + "h/";
      let m =
        Math.floor((result / 60) % 60) <= 0
          ? ""
          : Math.floor((result / 60) % 60) + "m/";
      let s = Math.floor(result % 60) + "s";
      result = h + m + s;
      return result;
    },
    xAxisData() {
      if (!this.testData.module_data || this.testData.module_data.length == 0) {
        return [];
      }
      return this.testData.module_data.map(item => {
        return item.testrun_id;
      });
    },
    passedData() {
      if (!this.testData.module_data || this.testData.module_data.length == 0) {
        return [];
      }
      return this.testData.module_data.map(item => {
        return item.passed;
      });
    },
    failedData() {
      if (!this.testData.module_data || this.testData.module_data.length == 0) {
        return [];
      }
      return this.testData.module_data.map(item => {
        return item.failed;
      });
    },
    point() {
      if (!this.testData.module_data || this.testData.module_data.length == 0) {
        return [];
      }
      return this.testData.module_data.map(item => {
        return ((item.passed / item.sum) * 100).toFixed(2);
      });
    },
    maxNum() {
      if (!this.testData.module_data || this.testData.module_data.length == 0) {
        return 0;
      }
      let sum = this.testData.module_data.map(item => {
        return item.sum;
      });
      let maxNum = (Math.max(...sum) * 1.5).toFixed(0);
      return maxNum;
    }
  },
  watch: {
    testData(val, newval) {
      if (val != newval) {
        this.drawEchart();
      }
    }
  },
  methods: {
    // 時間格式化
    formatTime(time) {
      if (!time) {
        return 0;
      }
      let date = new Date(time);
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      if (h < 10) {
        h = "0" + h;
      }
      if (m < 10) {
        m = "0" + m;
      }
      if (s < 10) {
        s = "0" + s;
      }
      return h + ":" + m + ":" + s;
    },
    drawEchart() {
      let myChart = this.$echarts.init(document.getElementById("apiView"));
      myChart.setOption({
        backgroundColor: "#fff",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: { fontSize: 20 },
          data: this.xAxisData
        },
        yAxis: [
          {
            type: "value",
            name: "數量",
            min: 0,
            max: 500,
            axisLabel: {
              fontSize: 20,
              formatter: "{value}"
            },
            nameTextStyle: {
              fontSize: 20
            },
          },
          {
            type: "value",
            name: "通過率",
            max: 100,
            min: 0,
            interval: 20,
            axisLabel: {
              fontSize: 20,
              formatter: "{value}%"
            },
            nameTextStyle: {
              fontSize: 20
            }
          }
        ],
        series: [
          {
            name: "Passed",
            type: "bar",
            stack: "数量",
            barWidth: '50%',
            label: {
              show: true,
              position: "insideTop",
              color: "#fff",
              fontSize: 20
            },
            itemStyle: {
              color: "#98CC64",
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.9)"
            },
            data: this.passedData
          },
          {
            name: "Failed",
            type: "bar",
            stack: "数量",
            barWidth: '50%',
            label: {
              show: true,
              position: "top",
              color: "red",
              fontSize: 20
            },
            itemStyle: {
              color: "#FD5A3E",
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.9)"
            },
            data: this.failedData
          },
          {
            name: "通過率",
            type: "line",
            yAxisIndex: 1,
            label: {
              show: true,
              color: "#000",
              fontSize: 18,
              formatter: function(data) {
                return `${data.value}%`;
              },
              distance: 15
            },
            itemStyle: {
              color: "#6495ED"
            },
            data: this.point
          }
        ]
      });
    },
    async getApiTestData() {
      const res = await DataAction.getApiTestData();
      if (res.code == 200) {
        this.testData = res.data;
        this.drawEchart();
      } else {
        this.$message.error("數據獲取失敗");
      }
      this.timeOutStart();
    },
    timeOutStart() {
      this.timeEnd = 60;
      this.timer = setInterval(() => {
        if (this.timeEnd == 0) {
          clearInterval(this.timer);
          this.getApiTestData();
        } else {
          this.timeEnd = this.timeEnd - 1;
        }
      }, 1000);
    }
  },
  mounted() {
    this.getApiTestData();
    this.drawEchart();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped>
.apiViewBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.apiTitle {
  height: 70px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 500;
  box-sizing: border-box;
}

.mainContent {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.chartTitle {
  height: 100px;
  padding: 20px 100px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .zhouqi-title {
    font-size: 20px;
    font-weight: 500;
    box-sizing: border-box;
  }
  .zhouqi-title span:first-child {
    margin-right: 30px;
  }

  .zhouqi-time {
    height: 24px;
    color: rgb(160, 157, 157);
    font-size: 16px;
  }
}
.viewMain {
  flex: 1;
}
#apiView {
  width: 100%;
  height: 100%;
}
.refresh {
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 150px;
  box-sizing: border-box;
  font-size: 24px;
}
.refresh span.time {
  font-weight: 600;
  width: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: red;
}
</style>
