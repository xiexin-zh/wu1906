<template>
  <div id="allFollow"></div>
</template>

<script>
export default {
  props: ["proName", "proPlat", "avg_all_total", "per_data"],
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
    avgAllTotal: function() {
      return this.per_data.map(item => {
        return (item = this.avg_all_total);
      });
    },
    allTotal: function() {
      return this.per_data.map(item => {
        return item.per_total;
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
    avg_all_total(val, newval) {
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
      let myChart = this.$echarts.init(document.getElementById("allFollow"));
      myChart.setOption({
        title: {
          left: "center",
          text: `${this.proName} ${this.proPlat} 總流量（KB）消耗趨勢圖`
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          left: "center",
          bottom: "bottom",
          data: ["趨勢", "均值"]
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
          // data: [0, 100, 200, 400, 600, 800, 1000]
          data: this.xData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            type: "line"
          },
          {
            name: "趨勢",
            type: "line",
            stack: "趨勢",
            // data: [324, 345, 456, 565, 666, 765, 890]
            data: this.allTotal,
            itemStyle: {
              normal: {
                color: "#FD7603",
                borderColor: "#FD7603" //拐点边框颜色
              }
            }
          },
          {
            name: "均值",
            type: "line",
            stack: "均值",
            // data: [200, 200, 200, 200, 200, 200, 200]
            data: this.avgAllTotal,
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
#allFollow {
  height: 100%;
}
</style>