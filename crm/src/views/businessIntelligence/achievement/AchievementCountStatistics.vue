<template>
  <div v-loading="loading" class="main-container">
    <!-- <div>{{ infoTitle }}---{{ infoType }}</div> -->
    <filtrate-handle-view
      class="filtrate-bar"
      moduleType="contract"
      :showYearSelect="true"
      @load="loading = true"
      @change="getDataList"
    ></filtrate-handle-view>
    <div class="content">
      <div class="axis-content">
        <div id="axismain"></div>
      </div>
      <div class="table-content">
        <el-table :data="list" height="300" width="80%" stripe border highlight-current-row>
          <el-table-column
            v-for="(item, index) in fieldList"
            :key="index"
            align="center"
            :fixed="index == 0 ? true : false"
            :min-width="index == 0 ? 180 : 100"
            header-align="center"
            :prop="item.field"
            :label="item.name"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import achievementMixins from "../mixins/achievement";

export default {
  /** 合同数量分析 */
  name: "achievement-count-statistics",
  data() {
    return {};
  },
  mixins: [achievementMixins],
  computed: {},
  props: {
    // crm类型
    crmType: {
      type: String,
      default: ""
    },
    // crm某个类型下的类型数据
    infoType: {
      type: String,
      default: ""
    },

    infoTitle: {
      type: String,
      default: ""
    },

    infoTips: {
      type: String,
      default: ""
    },

    // 展示的时候 才发请求
    show: Boolean
  },
  methods: {
    // monitoring() { // 监听事件
    //              this.$on('getDataList', (res) => {
    //                  console.log('方法1:触发监听事件监听成功')
    //                  console.log(res)
    //              })
    //          },
  },
  created() {
    this.type = "count";
  }

};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../styles/detail.scss";
</style>
