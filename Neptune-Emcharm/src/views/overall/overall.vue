<template>
  <div class="overall">
    <div class="overall-title">
      <span>測試概況</span>
    </div>
    <div class="overall-main">
      <div class="content">
        <div class="proBox">
          <Products @getData="getData" />
          <div class="testResult">
            <div class="resultLeft">
              <div class="testTime">
                <div class="test-zhouqi">
                  <p class="zhouqi-title">
                    <span>最近一輪測試週期</span>
                    <span>{{overAllData.day}}</span>
                  </p>
                  <p class="zhouqi-time">{{startTime}}- {{endTime}}（{{timeGap}}）</p>
                  <p class="test-count">
                    <span class="test-num">{{overAllData.cover || ''}}</span>
                    <span class="num-title">測試功能</span>
                  </p>
                </div>
                <div class="test-echart">
                  <div id="testEchat"></div>
                </div>
              </div>
              <div class="testEnv">
                <div class="envTitle">環境</div>
                <p class="envEn" v-for="(item,index) in envEn" :key="index">
                  <span>{{item.title}}</span>
                  <span>{{item.text}}</span>
                </p>
              </div>
            </div>
            <div class="resultRight">
              <div id="testTendency"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Products from "../../components/Products.vue";
import * as DataAction from "../../api/dataAction";

export default {
  data() {
    return {
      proName: "",
      proPlat: "",
      showName: "",
      overAllData: {}
    };
  },
  computed: {
    startTime() {
      return this.formatTime(this.overAllData.start_time * 1000);
    },
    endTime() {
      return this.formatTime(this.overAllData.end_time * 1000);
    },
    timeGap() {
      let result = this.overAllData.end_time - this.overAllData.start_time;
      let h =
        Math.floor(result / 3600) <= 0 ? "" : Math.floor(result / 3600) + "h/";
      let m =
        Math.floor((result / 60) % 60) <= 0
          ? ""
          : Math.floor((result / 60) % 60) + "m/";
      let s = Math.floor(result % 60) + 's';
      result = h + m + s;
      return result;
    },
    passedPoint() {
      return this.formatPoint(this.overAllData.pa);
    },
    envEn() {
      return [
        { title: "測試軟件", text: this.overAllData.pkg },
        { title: "測試平台", text: this.overAllData.platform },
        { title: "系統版本", text: this.overAllData.os_ver },
        { title: "軟件版本", text: this.overAllData.pkg_ver },
        { title: "設備型號", text: this.overAllData.device }
      ];
    },
    pieData() {
      return [
        { value: this.overAllData.passed_num, name: "Passed" },
        { value: this.overAllData.error_num, name: "Error" },
        { value: this.overAllData.failed_num, name: "Failed" }
      ];
    },
    xData() {
      if (
        !this.overAllData.module_data ||
        this.overAllData.module_data.length == 0
      ) {
        return [0];
      }
      return this.overAllData.module_data.map(item => {
        return item.testrun_id;
      });
    },
    passedData() {
      if (
        !this.overAllData.module_data ||
        this.overAllData.module_data.length == 0
      ) {
        return [0];
      }
      return this.overAllData.module_data.map(item => {
        return Number(item.passed);
      });
    },
    errorData() {
      if (
        !this.overAllData.module_data ||
        this.overAllData.module_data.length == 0
      ) {
        return [0];
      }
      return this.overAllData.module_data.map(item => {
        return Number(item.error);
      });
    },
    failedData() {
      if (
        !this.overAllData.module_data ||
        this.overAllData.module_data.length == 0
      ) {
        return [0];
      }
      return this.overAllData.module_data.map(item => {
        return Number(item.failed);
      });
    }
  },
  watch: {
    overAllData(val, newval) {
      if (val != newval) {
        this.drawEchat();
        this.drawTendency();
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
    // 格式化百分比
    formatPoint(point) {
      if (!point) {
        return "0%";
      }
      let str = Number(point * 100).toFixed();
      str += "%";
      return str;
    },
    // 獲取產品名稱/平台
    getData(showName, name, proPlat) {
      this.showName = showName;
      this.proName = name;
      this.proPlat = proPlat;
      this.getOverAllData();
    },
    // 获取总揽数据
    async getOverAllData() {
      const res = await DataAction.getOverAllData({
        pkg_iclude: this.proName,
        platform: this.proPlat
      });
      if (res.code == 200) {
        this.overAllData = res.data;
      } else {
        this.$message.error("數據獲取失敗");
      }
    },
    drawEchat() {
      let myChart = this.$echarts.init(document.getElementById("testEchat"));
      myChart.setOption({
        backgroundColor: "#fff",
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ["#98CC64", "#FFD050", "#FD5A3E"],
        graphic: [
          {
            //环形图中间添加文字
            type: "text", //通过不同top值可以设置上下显示
            left: "center",
            top: "45%",
            style: {
              text: this.passedPoint,
              textAlign: "center",
              fill: "#000", //文字的颜色
              width: 30,
              height: 30,
              fontSize: 25,
              color: "#4d4f5c",
              fontFamily: "Microsoft YaHei",
              fontWeight: 500
            }
          }
        ],
        series: [
          {
            name: "測試結果",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: this.pieData
          }
        ]
      });
    },
    drawTendency() {
      let myChart = this.$echarts.init(document.getElementById("testTendency"));
      myChart.setOption({
        backgroundColor: "#fff",
        color: ["#FD5A3E", "#FFD050", "#98CC64"],
        title: {
          left: "left",
          text: "趨勢",
          left: 10,
          top: 10,
          textStyle: {
            fontWeight: 300
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.xData
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "Failed",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: this.failedData
          },
          {
            name: "Error",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: this.errorData
          },
          {
            name: "Passed",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: this.passedData
          }
        ]
      });
    }
  },
  components: {
    Products
  },
  mounted() {
    this.drawEchat();
    this.drawTendency();
  }
};
</script>


<style lang="scss" scoped>
.overall {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.overall-title {
  height: 70px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  padding-left: 20px;
  box-sizing: border-box;
  letter-spacing: 2px;
}

.overall-main {
  flex: 1;
  overflow-y: auto;

  .content {
    margin-top: 20px;
    padding: 0 0 20px 0;
    box-sizing: border-box;

    .proBox {
      padding: 0 40px;
      box-sizing: border-box;
    }

    .testResult {
      display: flex;
      padding: 40px 0;
      box-sizing: border-box;
    }

    .resultLeft,
    .resultRight {
      flex: 1;
      // height: 300px;
      box-sizing: border-box;
    }
    .resultLeft {
      padding-right: 10px;
      box-sizing: border-box;

      .testTime {
        border: 1px solid #ccc;
        box-sizing: border-box;
        height: 200px;
        display: flex;

        .test-zhouqi,
        .test-echart {
          flex: 1;

          #testEchat {
            width: 100%;
            height: 100%;
          }
        }
        .test-zhouqi {
          display: flex;
          flex-direction: column;
        }

        .zhouqi-title {
          font-size: 18px;
          font-weight: 500;
          padding: 10px 0 0 10px;
          box-sizing: border-box;
          // height: 36px;
        }
        .zhouqi-title span:first-child {
          margin-right: 30px;
        }

        .zhouqi-time {
          height: 24px;
          padding-left: 15px;
          color: rgb(160, 157, 157);
          font-size: 16px;
        }

        .test-count {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .test-num {
            font-size: 60px;
            font-weight: 700;
          }
          .num-title {
            color: rgb(160, 157, 157);
            font-size: 16px;
          }
        }
      }
      .testEnv {
        border: 1px solid #ccc;
        box-sizing: border-box;
        // height: 250px;
        margin-top: 20px;

        .envTitle {
          height: 50px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 10px;
          box-sizing: border-box;
          font-size: 20px;
          font-weight: 300;
        }

        .envEn {
          height: 35px;
          border-top: 1px solid #ccc;
          box-sizing: border-box;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 10px;

          span {
            display: block;
            flex: 1;
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }
    .resultRight {
      padding-left: 10px;
      box-sizing: border-box;

      #testTendency {
        height: 350px;
        border: 1px solid #ccc;
        box-sizing: border-box;
      }
    }
  }
}
</style>