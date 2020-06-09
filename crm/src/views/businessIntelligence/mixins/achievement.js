import base from "./base";
import echarts from "echarts";
import { biAchievementAnalysisAPI } from "@/api/businessIntelligence/achievement";

// 业务中  ---  业绩/博彩产品/批額/佣金條件/資金流 静态数据
import {
  lists,
  contentDataList
} from "../../../assets/data/businessList/business-list";

export default {
  data() {
    return {
      axisOption: null,
      axisChart: null,

      loading: false,

      list: [],
      fieldList: [],
      type: "",
      typeName: "",
      typeUnit: ""
    };
  },

  components: {},

  mixins: [base],

  props: {},

  computed: {},

  watch: {},

  mounted() {
    if (this.type == "back") {
      this.typeName = "回款金額";
      this.typeUnit = "(元)";
    } else if (this.type == "count") {
      this.typeName = "合同數量";
      this.typeUnit = "（個）";
    } else if (this.type == "money") {
      this.typeName = "合同金額";
      this.typeUnit = "(元)";
    }
    this.initAxis();
  },

  methods: {
    getDataList(params) {
      this.loading = true;
      params.type = this.type;
      biAchievementAnalysisAPI(params)
        .then(res => {
          this.loading = false;
          let list = this.infoType
            ? lists[this.infoType]
            : [
                {
                  name: "當月" + this.typeName + this.typeUnit
                },
                {
                  name: "上月" + this.typeName + this.typeUnit
                },
                {
                  name: "去年當月" + this.typeName + this.typeUnit
                },
                {
                  name: "環比增長（%）"
                },
                {
                  name: "同比增長（%）"
                }
              ];
          let fieldList = [
            {
              field: "name",
              name: "日期"
            }
          ];

          this.initAxis();

          const resData = this.infoType
            ? contentDataList[this.infoType]
            : res.data;
          for (let eIndex = 0; eIndex < resData.length; eIndex++) {
            const element = resData[eIndex];
            let fieldKey = "value" + eIndex;
            // 处理表头逻辑
            if (fieldList.length <= resData.length) {
              fieldList.push({
                field: fieldKey,
                name: element.type
              });
            }

            let keys = [
              "month",
              "lastMonth",
              "lastYeatMonth",
              "chain_ratio",
              "year_on_year",
              "multiple"
            ];
            if (this.infoType !== "todayCustomer") {
              keys.push("niceTest");
            }
            for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
              const keyElement = keys[keyIndex];
              list[keyIndex][fieldKey] = element[keyElement];
            }
          }
          console.log(fieldList);
          
          this.fieldList = fieldList;
          this.list = list;
          let monthData = [];
          let lastMonthData = [];
          let lastYeatMonthData = [];
          let chainRatioData = [];
          let yearOnYearData = [];

          let xAxis = [];
          for (let index = 0; index < resData.length; index++) {
            const element = resData[index];

            monthData.push(element.month);
            lastMonthData.push(element.lastMonth);
            lastYeatMonthData.push(element.lastYeatMonth);
            chainRatioData.push(element.chain_ratio);
            yearOnYearData.push(element.year_on_year);
            xAxis.push(element.type);
          }
          this.axisOption.xAxis[0].data = xAxis;
          this.axisOption.series[0].data = monthData;
          // this.axisOption.series[1].data = lastMonthData;
          // this.axisOption.series[2].data = lastYeatMonthData;
          // this.axisOption.series[3].data = chainRatioData;
          // this.axisOption.series[4].data = yearOnYearData;
          this.axisChart.setOption(this.axisOption, true);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /** 柱状图 */
    initAxis() {
      this.axisChart = echarts.init(document.getElementById("axismain"));
      // 業績---轉碼
      const tab1_legend = {
        color: ["#6CA2FF"],
        legend: {
          data: ["轉碼(萬)"],
          bottom: "0px",
          itemWidth: 14
        },
        series: [
          {
            name: "轉碼(萬)",
            type: "bar",
            yAxisIndex: 0,
            barWidth: 10,
            markPoint: {
              data: [
                {
                  type: "max",
                  name: "最大值"
                },
                {
                  type: "min",
                  name: "最小值"
                }
              ]
            },
            data: []
          }
        ]
      };
      // 博彩産品---A數
      const tab2_legend = {
        color: ["#6AC9D7"],
        legend: {
          data: ["A數(%)"],
          bottom: "0px",
          itemWidth: 14
        },
        series: [
          {
            name: "A數(%)",
            type: "bar",
            yAxisIndex: 0,
            barWidth: 10,
            markPoint: {
              data: [
                {
                  type: "max",
                  name: "最大值"
                },
                {
                  type: "min",
                  name: "最小值"
                }
              ]
            },
            data: []
          }
        ]
      };
      // 批額/傭金條件/資金流---額度(萬)
      const tab3_legend = {
        color: ["#72DCA2"],
        legend: {
          data: ["額度(萬)"],
          bottom: "0px",
          itemWidth: 14
        },
        series: [
          {
            name: "額度(萬)",
            type: "bar",
            yAxisIndex: 0,
            barWidth: 10,
            markPoint: {
              data: [
                {
                  type: "max",
                  name: "最大值"
                },
                {
                  type: "min",
                  name: "最小值"
                }
              ]
            },
            data: []
          }
        ]
      };

      const axisOptionData = {
        todayCustomer: tab1_legend,
        followLeads: tab2_legend,
        followCustomer: tab3_legend
      };
      this.axisOption = {
        ...axisOptionData[this.infoType],
        // color: [
        //   "#6CA2FF",
        //   "#6AC9D7",
        //   "#72DCA2",
        //   "#DBB375",
        //   "#E164F7",
        //   "#FF7474",
        //   "#FFB270",
        //   "#FECD51"
        // ],
        // tooltip: {
        //   trigger: "axis",
        //   axisPointer: {
        //     // 坐标轴指示器，坐标轴触发有效
        //     type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        //   }
        // },
        grid: {
          top: "50px",
          left: "30px",
          right: "30px",
          bottom: "40px",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#BDBDBD"
            },
            /** 坐标轴轴线相关设置 */
            axisLine: {
              onZero: true,
              onZeroAxisIndex: 1,
              lineStyle: {
                color: "#BDBDBD"
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#e6e6e6"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.typeUnit,
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#BDBDBD",
              formatter: "{value}"
            },
            /** 坐标轴轴线相关设置 */
            axisLine: {
              lineStyle: {
                color: "#BDBDBD"
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#e6e6e6"
              }
            }
          },
          {
            type: "value",
            name: "",
            axisTick: {
              alignWithLabel: true,
              lineStyle: {
                width: 0
              }
            },
            axisLabel: {
              color: "#BDBDBD",
              formatter: "{value}%"
            },
            /** 坐标轴轴线相关设置 */
            axisLine: {
              lineStyle: {
                color: "#BDBDBD"
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#e6e6e6"
              }
            }
          }
        ]
      };
      this.axisChart.setOption(this.axisOption, true);
    }
  },

  deactivated: function() {}
};
