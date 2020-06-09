<!-- 業務頁面 -->
<template>
  <div style="height:100%;">
    <div class="message-header">
      業績
      <!-- <el-button
        type="primary"
        class="message-header-button"
        style="margin-left:85%"
        >新增</el-button
      >-->
    </div>
    <div class="message-body">
      <div class="message-content">
        <!-- <div class="message-body-side"> -->
        <!-- <div
            v-for="(item, index) in leftSides"
            :key="index"
            v-if="!item.hidden"
            :class="
              leftType == item.infoType
                ? 'side-item-select'
                : 'side-item-default'
            "
            @click="sideClick(item)"
            class="side-item"
          >
            {{ item.name }} -->
        <!-- <el-badge
              v-if="item.num > 0"
              :max="99"
              :value="item.num"
            ></el-badge> -->
        <!-- </div> -->
        <!-- </div> -->
        <div class="message-body-content">
          <AchievementCountStatistics
            :infoType="leftType"
            :infoTitle="infoTitle"
            ref="child"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { objDeepCopy } from "@/utils";
import AchievementCountStatistics from "@/views/businessIntelligence/achievement/AchievementCountStatistics";

export default {
  /** 客戶管理 的 消息列表 */
  name: "professionalWork",
  components: {
    AchievementCountStatistics
  },

  watch: {
    /** 變化就刷新數據 */
    messageNum() {
      this.refreshNum();
    }
  },

  data() {
    return {
      leftType: "todayCustomer",
      infoTitle: "業績",
      leftSides: [
        {
          name: "業績",
          crmType: "results",
          infoType: "todayCustomer",
          num: 0,
          tips: "業績",
          hidden: false
        },
        {
          name: "博彩産品",
          crmType: "gamblingProduct",
          infoType: "followLeads",
          num: 0,
          tips: "博彩産品",
          hidden: false
        },
        {
          name: "批額/傭金條件/資金流",
          crmType: "money",
          infoType: "followCustomer",
          num: 0,
          tips: "批額/傭金條件/資金流",
          hidden: false
        }
      ]
    };
  },

  computed: {
    ...mapGetters(["messageNum"])
  },

  mounted() {
    this.refreshNum();
    /** 控制table的高度 */
    window.onresize = () => {
      var offsetHei = document.documentElement.clientHeight;
      this.$bus.emit("message-scroll", offsetHei - 300);
    };
  },

  methods: {
    /**
     * 刷新消息數據
     */
    refreshNum() {
      for (let index = 0; index < this.leftSides.length; index++) {
        const element = this.leftSides[index];
        if (this.messageNum.hasOwnProperty(element.infoType)) {
          element.num = this.messageNum[element.infoType] || 0;
          element.hidden = false;
        } else {
          element.hidden = true;
        }
      }
    },

    /**
     * 消息頁面點擊操作
     */
    messageHandle(data) {
      if (data.type == "follow") {
        let copyNum = objDeepCopy(this.messageNum);
        let num = parseInt(copyNum[data.infoType]) - data.value;
        copyNum[data.infoType] = num > 0 ? num : 0;
        this.$store.commit("SET_MESSAGENUM", copyNum);
      }
    },

    /**
     * 側邊點擊
     */
    sideClick(item) {
      this.leftType = item.infoType;
      this.infoTitle = item.name;
      // 執行子組件中的方法
      this.$refs.child.getDataList({
        structure_id: 1,
        type: "count",
        user_id: "",
        year: "2019"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.message-header {
  height: 60px;
  font-size: 18px;
  padding: 0 20px;
  line-height: 60px;
}
.message-body {
  position: relative;
  height: calc(100% - 60px);
}
.message-content {
  position: relative;
  height: 100%;
}

.message-body-side {
  width: 200px;
  font-size: 14px;
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
  overflow-y: auto;
  .side-item {
    position: relative;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 13px;
    cursor: pointer;
    i {
      color: #999;
    }
  }
}
.message-body-content {
  //   margin-left: 210px;
  height: 100%;
  overflow: hidden;
  background-color: white;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
}

.side-item-default {
  color: #333;
  border-right: 2px solid transparent;
}

.side-item-select {
  color: #005df7;
  border-right: 2px solid #005df7;
  /* background-color: #ecf5ff; */
}

.block {
  padding: 10px;
}

.el-badge /deep/ .el-badge__content {
  border: none;
  top: 0;
}

.el-badge {
  position: absolute;
  right: 15px;
  top: 0;
}
/deep/ .el-table__fixed {
  height: 290px !important;
}
</style>
