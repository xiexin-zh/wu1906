<template>
  <div class="buglist">
    <div class="buglist-title">
      <span>Bug 詳情</span>
    </div>
    <div class="buglist-main">
      <div class="content">
        <Products @getData="getData" />
        <div class="listContent">
          <div class="bug-list">
            <div class="bugLevel">
              <div class="levelTitle">
                <span v-show="!levelShow" class="iconfont icon-youjiantou1" @click="showLevel"></span>
                <span v-show="levelShow" class="iconfont icon-xiajiantou" @click="showLevel"></span>
                <span class="classTitle" @click="showLevel">按照 Bug 的嚴重程度分類</span>
              </div>
              <ul v-show="levelShow" class="levelList">
                <li v-for="item in levelList" :key="item.key">
                  <p>
                    <span
                      v-show="!item.show"
                      @click="levelItemShow(item.key, $event)"
                      class="iconfont icon-youjiantou1"
                    ></span>
                    <span
                      v-show="item.show"
                      @click="levelItemShow(item.key, $event)"
                      class="iconfont icon-xiajiantou"
                    ></span>
                    <span @click="levelItemShow(item.key, $event)">{{ item.title }}：</span>
                    <span @click="levelItemShow(item.key, $event)">{{ item.count }} 個</span>
                  </p>
                  <div v-show="item.show" class="levelItem">
                    <p v-for="(item,index) in item.list" :key="index">
                      <a :href="bugSplit(item, 'url')" target="_blank">{{bugSplit(item,'text')}}</a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="bugClass">
              <div class="classTitle">
                <span v-show="!classShow" class="iconfont icon-youjiantou1" @click="showClass"></span>
                <span v-show="classShow" class="iconfont icon-xiajiantou" @click="showClass"></span>
                <span class="classTitle" @click="showClass">按照 Bug 的模塊分類</span>
              </div>
              <ul v-show="classShow" class="classList">
                <li v-for="(item,idx) in classList" :key="idx">
                  <p>
                    <span
                      v-show="!item.show"
                      @click="classItemShow(item.module)"
                      class="iconfont icon-youjiantou1"
                    ></span>
                    <span
                      v-show="item.show"
                      @click="classItemShow(item.module)"
                      class="iconfont icon-xiajiantou"
                    ></span>
                    <span @click="classItemShow(item.module)">{{ item.module }}：</span>
                    <span @click="classItemShow(item.module)">{{ item.count }} 個</span>
                  </p>
                  <div v-show="item.show" class="levelItem">
                    <p v-for="(item,index) in item.module_detail_list" :key="index">
                      <a :href="bugSplit(item, 'url')" target="_blank">{{bugSplit(item,'text')}}</a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="bug-echart">
            <div id="levelChart"></div>
            <div id="classChart"></div>
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
      levelShow: true,
      classShow: false,
      levelList: [
        { key: "s1", title: "S1-功能不可用", count: 0, show: false, list: [] },
        { key: "s2", title: "S2-功能有問題", count: 0, show: false, list: [] },
        { key: "s3", title: "S3-功能有瑕疵", count: 0, show: false, list: [] },
        {
          key: "s4",
          title: "S4-給PO的優化建議",
          count: 0,
          show: false,
          list: []
        }
      ],
      classList: [],
      sum_data: [],
      s_data: { s1: 0, s2: 0, s3: 0, s4: 0 }
    };
  },
  computed: {
    levelData() {
      let arr = [
        this.s_data["s1"],
        this.s_data["s2"],
        this.s_data["s3"],
        this.s_data["s4"]
      ];
      return arr;
    },
    classData() {
      let arr = [
        [
          "product",
          "S1-功能不可用",
          "S2-功能有問題",
          "S3-功能有瑕疵",
          "S4-給PO的優化建議"
        ]
      ];
      if (this.sum_data.length == 0) {
        return arr;
      }
      this.sum_data.forEach(item => {
        let temp = [];
        temp.push(
          item.module,
          item.sum_s1,
          item.sum_s2,
          item.sum_s3,
          item.sum_s4
        );
        arr.push(temp);
      });
      return arr;
    }
  },
  watch: {
    s_data(val, newval) {
      if (val != newval) {
        this.drawLevelEchat();
      }
    },
    sum_data(val, newval) {
      if (val != newval) {
        this.drawClassEchat();
      }
    }
  },
  methods: {
    // 初始化levelList
    initLevelList() {
      this.levelList = [
        { key: "s1", title: "S1-功能不可用", count: 0, show: false, list: [] },
        { key: "s2", title: "S2-功能有問題", count: 0, show: false, list: [] },
        { key: "s3", title: "S3-功能有瑕疵", count: 0, show: false, list: [] },
        {
          key: "s4",
          title: "S4-給PO的優化建議",
          count: 0,
          show: false,
          list: []
        }
      ];
    },
    // 獲取產品名稱/平台
    getData(showName, name, proPlat) {
      this.showName = showName;
      this.proName = name;
      this.proPlat = proPlat;
      this.initLevelList();
      this.getBugList();
    },
    // 展开隐藏bug严重程度
    showLevel() {
      this.levelShow = !this.levelShow;
    },
    // 展开隐藏bug模块
    showClass() {
      this.classShow = !this.classShow;
    },
    levelItemShow(val, e) {
      this.levelList = this.levelList.map(item => {
        return {
          ...item,
          show: val == item.key ? !item.show : item.show
        };
      });
    },
    classItemShow(val) {
      this.classList = this.classList.map(item => {
        return {
          ...item,
          show: val == item.module ? !item.show : item.show
        };
      });
    },
    // 切割bug字符串
    bugSplit(str, type) {
      if (!str) {
        return "";
      }
      if (type == "text") {
        return str.substr(0, str.indexOf("#"));
      }
      if (type == "url") {
        return str.substr(str.indexOf("#") + 1, str.length);
      }
    },

    // 獲取bugList
    async getBugList() {
      const res = await DataAction.getBugList({
        pkg_iclude: this.proName,
        platform: this.proPlat
      });
      if (res.code == 200) {
        const {
          module_data,
          severity_data,
          s_data,
          sum_data,
          s1,
          s2,
          s3,
          s4
        } = res.data;
        let list = [...this.levelList];
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < severity_data.length; j++) {
            if (list[i].title == severity_data[j].severity) {
              list[i].list = severity_data[j].bug_detail_list;
              list[i].count = severity_data[j].count;
            }
          }
        }
        this.levelList = list;
        this.classList = module_data.map(item => {
          return {
            ...item,
            show: false
          };
        });
        this.s_data = {
          s1: s1 == "None" ? 0 : s1,
          s2: s2 == "None" ? 0 : s2,
          s3: s3 == "None" ? 0 : s3,
          s4: s4 == "None" ? 0 : s4
        };
        this.sum_data = sum_data;
      } else {
        this.$message.error("數據獲取失敗");
      }
    },
    drawLevelEchat() {
      let myChart = this.$echarts.init(document.getElementById("levelChart"));
      myChart.setOption({
        backgroundColor: "#fff",
        title: {
          left: "left",
          text: "嚴重程度",
          left: 10,
          top: 10,
          textStyle: {
            fontWeight: 300
          }
        },
        color: ["#FD5A3E"],
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
        xAxis: [
          {
            type: "category",
            data: [
              "S1-功能不可用",
              "S2-功能有問題",
              "S3-功能有瑕疵",
              "S4-給PO的優化建議"
            ],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "bug數量",
            type: "bar",
            barWidth: "60%",
            data: this.levelData
          }
        ]
      });
    },
    drawClassEchat() {
      let myChart = this.$echarts.init(document.getElementById("classChart"));
      myChart.setOption({
        backgroundColor: "#fff",
        title: {
          left: "left",
          text: "模塊",
          left: 10,
          top: 10,
          textStyle: {
            fontWeight: 300
          }
        },
        tooltip: {},
        legend: {
          data: ["S1-功能不可用", "S2-功能有問題", "S3-功能有瑕疵","S4-給PO的優化建議"],
          bottom: 5
        },
        color: ["#FC4E4E", "#FD5A3E ", "#F7A56A", "#FFD63B"],
        dataset: {
          source: this.classData
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {},
        series: [
          { type: "bar" },
          { type: "bar" },
          { type: "bar" },
          { type: "bar" }
        ]
      });
    }
  },
  components: {
    Products
  },
  mounted() {
    this.drawLevelEchat();
    this.drawClassEchat();
  }
};
</script>

<style lang="scss" scoped>
.buglist {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.buglist-title {
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

.buglist-main {
  flex: 1;
  overflow-y: auto;

  .content {
    margin-top: 20px;
    padding: 0 40px 20px 40px;
    box-sizing: border-box;

    .listContent {
      margin-top: 20px;
      box-sizing: border-box;
      display: flex;

      .bug-list {
        flex: 1;
        border: 1px solid #ccc;
        padding: 20px;
        box-sizing: border-box;
      }

      .bugLevel,
      .bugClass {
        font-weight: 500;

        span {
          cursor: pointer;
        }
      }
      .bugClass {
        margin-top: 20px;
      }

      .levelList,
      .classList {
        margin-top: 15px;
        li {
          line-height: 30px;
          padding-left: 15px;
          box-sizing: border-box;

          span {
            cursor: pointer;
          }

          .levelItem {
            padding-left: 20px;
            box-sizing: border-box;
            font-size: 14px;
            font-weight: 900;

            a {
              text-decoration: none;
              color: #333;
            }
          }
        }
      }
      .bug-echart {
        width: 600px;
        margin-left: 20px;

        #levelChart {
          width: 100%;
          height: 350px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
        }
        #classChart {
          width: 100%;
          height: 350px;
          border: 1px solid #ccc;
        }
      }
    }
  }
}
</style>
