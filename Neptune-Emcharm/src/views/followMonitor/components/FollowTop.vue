<template>
  <div id="followTop"></div>
</template>

<script>
import Clipboard from "clipboard";
import { getRandomColor } from "../../../utils/transform";
export default {
  props: ["followTopData"],
  computed: {
    topData: function() {
      if (!this.followTopData || this.followTopData.length == 0) {
        return [];
      }
      return this.followTopData;
    },
    yAxisData: function() {
      if (!this.followTopData || this.followTopData.length == 0) {
        return [];
      }
      return this.followTopData.map((item, index) => {
        return `Top${this.followTopData.length - index}`;
      });
    },
    seriesData: function() {
      if (!this.followTopData || this.followTopData.length == 0) {
        return [];
      }
      return this.followTopData.map(item => {
        return item.api_flow_download;
      });
    }
  },
  watch: {
    followTopData(val, newval) {
      if (val != newval) {
        this.drawEchat();
      }
    }
  },
  methods: {
    drawEchat() {
      let myChart = this.$echarts.init(document.getElementById("followTop"));
      myChart.setOption({
        title: {
          left: "center",
          text: `流量消耗（KB）Top 10`
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          enterable: true,
          formatter: function(params) {
            var html = ``;
            if (params.length > 0) {
              const { dataIndex, name } = params[0];
              html += `<div style="width:300px;">
                          <p style="display: flex; justify-content: flex-end; align-items: center; padding: 5px">
                            <a class="iconfont icon-fuzhi" 
                            style="color: #fff; font-size:30px; text-decoration: none; font-weight:600" 
                            href="javascript:void(0)" 
                            title="複製"
                            onclick="copyData(${dataIndex})">
                            </a>
                        </p>
                        <p style="width:100%;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;" title="${getFollowTop(dataIndex).api_url}">請求地址：${getFollowTop(dataIndex).api_url}</p>
                        <p style="width:100%;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;" title="${getFollowTop(dataIndex).request_param}">相關參數：${getFollowTop(dataIndex).request_param}</p>
                        <p>請求類型：${getFollowTop(dataIndex).method}</p></div>`;
            }
            return html;
          },
          position: function(point, params, dom, rect, size) {
            // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
            // 提示框位置
            let x = 0; // x坐标位置
            let y = 0; // y坐标位置

            // 当前鼠标位置
            let pointX = point[0];
            let pointY = point[1];

            // 提示框大小
            let boxWidth = size.contentSize[0];
            let boxHeight = size.contentSize[1];

            // boxWidth > pointX 说明鼠标左边放不下提示框
            if (boxWidth > pointX) {
              x = 5;
            } else {
              // 左边放的下
              x = pointX - boxWidth;
            }

            // boxHeight > pointY 说明鼠标上边放不下提示框
            if (boxHeight > pointY) {
              y = 5;
            } else {
              // 上边放得下
              y = pointY - boxHeight;
            }

            return [x, y];
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: this.yAxisData
        },
        series: [
          {
            name: "流量消耗",
            type: "bar",
            label: {
              show: true,
              formatter: "{c}",
              position: "right"
            },
            data: this.seriesData,
            itemStyle: {
              normal: {
                color: function(params) {
                  return getRandomColor();
                },
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.9)',
              }
            }
          }
        ]
      });
    },
    handleCopy(index) {
      let text = `請求地址：${this.topData[index].api_url}
                  相關參數：${this.topData[index].request_param}
                  請求類型：${this.topData[index].method}
                  `
      let oInput = document.createElement("input");
      oInput.value = text;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy");
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message.success("复制成功");
    }
  },
  mounted() {
    this.drawEchat();
    let that = this;
    window.copyData = function(index) {
      that.handleCopy(index);
    };
    window.getFollowTop = function(index){
      return that.topData[index]
    }
  }
};
</script>

<style lang="scss" scoped>
.followTopBox {
  height: 100%;
}
#followTop {
  height: 100%;
}
</style>