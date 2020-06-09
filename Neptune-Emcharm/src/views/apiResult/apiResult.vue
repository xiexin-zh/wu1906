<template>
  <div class="api_result">
    <div class="api_result-title">
      <span>API 測試結果詳情</span>
    </div>
    <div class="api_result-main">
      <div class="content">
        <div class="proBox">
          <Products @getData="getData" />
        </div>
        <div class="api_resultSearch">
          <div class="selectRadio">
            <el-radio-group class="radioGroup" v-model="resultStatus" @change="getTestResult">
              <el-radio label="3">All</el-radio>
              <p style="margin-right:15px">
                <el-radio label="1" style="margin-right:5px">Passed</el-radio>
                <span class="iconfont icon-gou1 passed"></span>
              </p>
              <p style="margin-right:15px">
                <el-radio label="0" style="margin-right:5px">Failed</el-radio>
                <span class="iconfont icon-chacha failed"></span>
              </p>
              <p>
                <el-radio label="2" style="margin-right:5px">Error</el-radio>
                <span class="iconfont icon-tanhao error"></span>
              </p>
            </el-radio-group>
          </div>
        </div>
        <div class="api_resultListBox">
          <div class="api_resultList">
            <div class="api_resultDetail">
              <span v-show="!detailShow" class="iconfont icon-youjiantou1" @click="showList"></span>
              <span v-show="detailShow" class="iconfont icon-xiajiantou" @click="showList"></span>
              <span class="detailTitle" @click="showList">API 測試結果詳情</span>
            </div>
            <ul v-show="detailShow" class="listBox">
              <li v-for="(item, index) in resultList" :key="index">
                <p class="itemTitle">
                  <span
                    v-show="!item.show"
                    @click="showListItem(item.api_type)"
                    class="iconfont icon-youjiantou1"
                  ></span>
                  <span
                    v-show="item.show"
                    @click="showListItem(item.api_type)"
                    class="iconfont icon-xiajiantou"
                  ></span>
                  <span @click="showListItem(item.api_type)">
                    {{
                    item.api_type
                    }}
                  </span>
                  <span @click="showListItem(item.api_type)">
                    {{
                    '（'+item.count+' 個）'
                    }}
                  </span>
                </p>
                <div v-show="item.show">
                  <div class="ListItem" v-for="(li, i) in item.bug_detail_list" :key="i">
                    <span v-if="li.status=='Passed'" class="iconfont icon-gou1 passed"></span>
                    <span v-if="li.status=='Failed'" class="iconfont icon-chacha failed"></span>
                    <span v-if="li.status=='Error'" class="iconfont icon-tanhao error"></span>
                    <p>
                      <span v-if="li.status !='Failed'" style="margin: 0 5px">{{ li.value }}</span>
                      <a
                        v-if="li.status=='Failed'"
                        style="margin: 0 5px;color:#000;text-decoration:none"
                        :href="li.url"
                        target="_blank"
                      >{{ li.value }}</a>
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- <div class="api_resultEchat">
            <div id="api_resultChart" @click="toBugList"></div>
            <div class="chartTitle">
              <p
                v-for="(item, index) in chartList"
                :style="'background-color:' + item.color"
                :key="index"
              >{{ item.title }}</p>
            </div>
          </div>-->
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
      resultStatus: "3",
      detailShow: true,
      resultList: []
    };
  },
  methods: {
    // 獲取產品名稱/平台
    getData(showName, name, proPlat) {
      this.showName = showName;
      this.proName = name;
      this.proPlat = proPlat;
      this.getTestResult();
    },
    showList() {
      this.detailShow = !this.detailShow;
    },
    showListItem(val) {
      this.resultList = this.resultList.map(item => {
        return {
          ...item,
          show: val == item.api_type ? !item.show : item.show
        };
      });
    },
    // 覆蓋率計算
    formatPoint(passed, coverage) {
      if (coverage == 0) {
        return " （ 腳本開發中 ）";
      }
      var str = " （ " + Number(passed * 100).toFixed();
      str += "% ）";
      return str;
    },
    drawEchat() {
      let myChart = this.$echarts.init(
        document.getElementById("api_resultChart")
      );
      myChart.setOption({
        backgroundColor: "#fff",
        color: this.color,
        series: [
          //系列列表。每个系列通过 type 决定自己的图表类型
          {
            name: "結果详情",
            type: "pie",
            radius: "75%",
            center: ["50%", "40%"],
            data: this.echartData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },

              normal: {
                borderWidth: 2,
                borderColor: "#fff",
                label: {
                  show: true,
                  position: "inner",
                  formatter: function(v) {
                    let text = v.name.split(" ").join("\n");
                    return text;
                  },
                  textStyle: {
                    fontSize: 14,
                    padding: [5, 5, 5, 15]
                  }
                }
              }
            }
          }
        ]
      });
    },
    // 獲取測試結果數據
    async getTestResult() {
      const res = await DataAction.getResultDataForApi({
        pkg_iclude: this.proName,
        platform: this.proPlat,
        result_tag: this.resultStatus
      });
      console.log(res);
      if (res.code == 200) {
        const { module_data } = res.data;
        this.resultList = module_data.map(item => {
          return {
            ...item,
            show: false
          };
        });
      }
    }
  },
  components: {
    Products
  },
  mounted() {
    // this.drawEchat();
  }
};
</script>

<style lang="scss" scoped>
.api_result {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.api_result-title {
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

.api_result-main {
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

    .passed {
      font-size: 14px;
      color: rgb(6, 248, 6);
    }
    .failed {
      font-size: 14px;
      color: red;
    }
    .error {
      font-size: 14px;
      color: rgb(226, 226, 32);
    }

    .api_resultSearch {
      padding: 20px 40px;
      box-sizing: border-box;
      border-bottom: 1px solid #ccc;
    }
    .selectRadio {
      margin-top: 20px;

      .radioGroup {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
    }

    .api_resultListBox {
      display: flex;

      .api_resultList {
        flex: 1;
        padding-top: 20px;
        padding-left: 40px;
        box-sizing: border-box;

        .api_resultDetail {
          span {
            cursor: pointer;
          }

          .detailTitle {
            font-weight: 500;
          }
        }

        .listBox {
          margin-top: 15px;

          li {
            line-height: 30px;
            padding-left: 15px;
            box-sizing: border-box;

            span {
              cursor: pointer;
            }
          }

          .itemTitle {
            font-weight: 500;
          }

          .ListItem {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-left: 15px;
            box-sizing: border-box;
            font-size: 14px;

            p {
              font-weight: 400;
            }
          }
        }
      }
      .api_resultEchat {
        width: 530px;
        display: flex;

        #api_resultChart {
          width: 400px;
          height: 400px;
        }
        .chartTitle {
          width: 130px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: column;
          padding-top: 20px;
          box-sizing: border-box;

          p {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 25px;
            width: 100px;
            // padding-right: 10px;
            box-sizing: border-box;
            font-weight: 500;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
