<template>
  <div class="cover">
    <div class="cover-title">
      <span>測試覆蓋詳情</span>
    </div>
    <div class="cover-main">
      <div class="content">
        <div class="proBox">
          <Products @getData="getData" />
        </div>
        <div class="coverSearch">
          <div class="search">
            <el-input
              placeholder="搜索"
              class="searchInput"
              v-model="searchValue"
              clearable
              @clear="getCoverData"
            ></el-input>
            <span class="searchBtn" @click="getCoverData">搜索</span>
          </div>
          <div class="selectRadio">
            <el-radio-group class="radioGroup" v-model="coverStatus" @change="getCoverData">
              <el-radio label="2">全部</el-radio>
              <p style="margin-right:15px">
                <el-radio label="1" style="margin-right:5px">已覆蓋</el-radio>
                <span class="iconfont icon-gou hasCover"></span>
              </p>
              <p>
                <el-radio label="0" style="margin-right:5px">未覆蓋</el-radio>
                <span class="iconfont icon-chacha1 noCover"></span>
              </p>
            </el-radio-group>
          </div>
        </div>
        <div class="coverListBox">
          <div class="coverList">
            <div class="coverDetail">
              <span v-show="!detailShow" class="iconfont icon-youjiantou1" @click="showList"></span>
              <span v-show="detailShow" class="iconfont icon-xiajiantou" @click="showList"></span>
              <span class="detailTitle" @click="showList">覆蓋詳情</span>
            </div>
            <ul v-show="detailShow" class="listBox">
              <li v-for="(item,index) in coverList" :key="index">
                <p class="itemTitle">
                  <span
                    v-show="!item.show"
                    @click="showListItem(item.module)"
                    class="iconfont icon-youjiantou1"
                  ></span>
                  <span
                    v-show="item.show"
                    @click="showListItem(item.module)"
                    class="iconfont icon-xiajiantou"
                  ></span>
                  <span @click="showListItem(item.module)">{{ item.module }}</span>
                  <span @click="showListItem(item.module)">{{formatPoint(item.coverage)}}</span>
                </p>
                <div v-show="item.show">
                  <div class="ListItem" v-for="(li , i) in item.data_list" :key="i">
                    <span v-if="li.cover" class="iconfont icon-gou hasCover"></span>
                    <span v-if="!li.cover" class="iconfont icon-chacha1 noCover"></span>
                    <p>
                      <span style="margin: 0 5px">{{ li.row_data }}</span>
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="coverEchat">
            <div id="coverChart"></div>
            <div class="chartTitle">
              <p
                v-for="(item, index) in chartList"
                :style="'background-color:' + item.color"
                :key="index"
              >{{ item.title }}</p>
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
      searchValue: "",
      coverStatus: "2",
      detailShow: true,
      chartList: [
        { title: "0%", color: "#949494" },
        { title: "> 0%", color: "#FC4E4E" },
        { title: "> 20%", color: "#F7A56A" },
        { title: "> 40%", color: "#FFD63B" },
        { title: "> 60%", color: "#E2E80F" },
        { title: "> 80%", color: "#7ED321" }
      ],
      coverList: [],
      static_data: []
    };
  },
  computed: {
    color() {
      function getColor(str) {
        if (0 == str) {
          return "#949494";
        } else if (0 < str < 0.2) {
          return "#FC4E4E";
        } else if (0.2 <= str < 0.4) {
          return "#F7A56A";
        } else if (0.4 <= str < 0.6) {
          return "#FFD63B";
        } else if (0.6 <= str < 0.8) {
          return "#E2E80F";
        } else if (0.8 <= str) {
          return "#7ED321";
        }
      }

      let colorArr = this.static_data.map(item => {
        return getColor(item.coverage);
      });

      return colorArr;
    },
    echartData() {
      function getPoint(point) {
        let str = " " + Number(point * 100).toFixed();
        str += "%";
        return str;
      }
      return this.static_data.map(item => {
        return {
          value: 100,
          name: item.module + " " + getPoint(item.coverage)
        };
      });
    }
  },
  watch: {
    static_data(val, newval) {
      if (val != newval) {
        this.drawEchat();
      }
    }
  },
  methods: {
    // 獲取產品名稱/平台
    getData(showName, name, proPlat) {
      this.showName = showName;
      this.proName = name;
      this.proPlat = proPlat;
      this.getCoverData();
    },
    showList() {
      this.detailShow = !this.detailShow;
    },
    showListItem(val) {
      this.coverList = this.coverList.map(item => {
        return {
          ...item,
          show: val == item.module ? !item.show : item.show
        };
      });
    },
    // 覆蓋率計算
    formatPoint(point) {
      if (point == 0) {
        return " （ 腳本開發中 ）";
      }
      var str = " （ " + Number(point * 100).toFixed();
      str += "% ）";
      return str;
    },
    // 獲取測試覆蓋數據
    async getCoverData() {
      const res = await DataAction.getCoverData({
        pkg_iclude: this.proName,
        platform: this.proPlat,
        cover_tag: this.coverStatus,
        search_str: this.searchValue
      });
      if (res.code == 200) {
        this.coverList = res.data.module_data.map(item => {
          return {
            ...item,
            show: false
          };
        });
        this.static_data = res.data.static_data;
      }
    },
    drawEchat() {
      let myChart = this.$echarts.init(document.getElementById("coverChart"));
      myChart.setOption({
        backgroundColor: "#fff",
        color: this.color,
        series: [
          //系列列表。每个系列通过 type 决定自己的图表类型
          {
            name: "覆盖详情",
            type: "pie",
            radius: "75%",
            center: ["50%", "40%"],
            data: this.echartData,
            hoverOffset: 5,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },

              normal: {
                borderWidth: 2,
                left: 20,
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
    }
  },
  components: {
    Products
  },
  mounted() {
    this.drawEchat();
  }
};
</script>

<style lang="scss" scoped>
.cover {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.cover-title {
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

.cover-main {
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

    .hasCover {
      font-size: 14px;
      color: rgb(6, 248, 6);
    }
    .noCover {
      font-size: 14px;
      color: red;
    }

    .coverSearch {
      padding: 20px 40px;
      box-sizing: border-box;
      border-bottom: 1px solid #ccc;

      .search {
        display: flex;
        align-items: center;
        height: 30px;

        .searchInput {
          height: 100%;
          width: 300px;
          margin-right: 10px;
        }
        .searchBtn {
          cursor: pointer;
          color: blue;
        }
      }
    }

    .selectRadio {
      margin-top: 20px;

      .radioGroup {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
    }

    .coverListBox {
      display: flex;

      .coverList {
        flex: 1;
        padding-top: 20px;
        padding-left: 40px;
        box-sizing: border-box;

        .coverDetail {
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
          .ListItem > span{
            display: block;
            width: 20px;
          }
        }
      }
      .coverEchat {
        width: 500px;
        display: flex;

        #coverChart {
          width: 400px;
          height: 400px;
        }
        .chartTitle {
          width: 100px;
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
            width: 70px;
            // padding-right: 10px;
            box-sizing: border-box;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
