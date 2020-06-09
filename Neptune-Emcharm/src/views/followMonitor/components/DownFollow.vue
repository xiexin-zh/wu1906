<template>
  <div id="downFollow"></div>
</template>

<script>
export default {
  props: ["proName", "proPlat", "per_data", "avg_all_download"],
  data() {
    return {};
  },
  computed: {
    xData: function() {
      if (this.per_data && this.per_data.length == 0) {
        return [];
      } else {
        return this.per_data.map(item => {
          return item.testrun_id;
        });
      }
    },
    avgDownload: function() {
      return this.per_data.map(item => {
        return (item = this.avg_all_download);
      });
    },
    downLoad: function() {
      return this.per_data.map(item => {
        return item.per_download;
      });
    }
  },
  mounted() {
    this.drawEchat();
  },
  watch: {
    proName(val, newval) {
      if (val != newval) {
        this.drawEchat();
      }
    },
    proPlat(val, newval) {
      if (val != newval) {
        this.drawEchat();
      }
    },
    avg_all_download(val, newval) {
      if (val != newval) {
        this.drawEchat();
      }
    },
    per_data(val, newval) {
      if (val != newval) {
        this.drawEchat();
      }
    }
  },
  methods: {
    drawEchat() {
      let myChart = this.$echarts.init(document.getElementById("downFollow"));
      myChart.setOption({
        title: {
          left: "center",
          text: `${this.proName} ${this.proPlat} 下載流量（KB）消耗趨勢圖`
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          left: "center",
          bottom: "bottom",
          data: ["下載中位數", "歷史均值"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "下載中位數",
            type: "line",
            stack: "下載中位數",
            data: this.downLoad,
            itemStyle: {
              normal: {
                color: "#FD7603",
                borderColor: "#FD7603" //拐点边框颜色
              }
            }
          },
          {
            name: "歷史均值",
            type: "line",
            stack: "歷史均值",
            data: this.avgDownload,
            itemStyle: {
              normal: {
                color: "#459CDA",
                borderColor: "#459CDA" //拐点边框颜色
              }
            }
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#downFollow {
  height: 100%;
}
</style>