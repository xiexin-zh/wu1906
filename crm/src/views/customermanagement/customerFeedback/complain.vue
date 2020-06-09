<template>
  <!-- 客戶反饋   投訴 -->
  <div style="height:100%;">
    <div class="message-header">
      客戶反饋
      <el-button
        type="primary"
        class="message-header-button"
        style="margin-left:85%"
        @click="createClick"
        >新增</el-button
      >
    </div>
    <div class="message-body">
      <div class="message-content">
        <!-- <div class="message-body-side">
          <div
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
            {{ item.name }}
          </div>
        </div> -->
        <div class="message-body-content">
          <c-r-m-message
            v-for="(item, index) in leftSides"
            :key="index"
            :crmType="item.crmType"
            :infoType="item.infoType"
            :infoTitle="item.name"
            :infoTips="item.tips"
            :show="leftType == item.infoType"
            v-show="leftType == item.infoType"
            @on-handle="messageHandle"
            ref="child"
          ></c-r-m-message>
        </div>
      </div>
    </div>
    <!-- 新增 投诉-->
    <c-r-m-create-view
      v-if="isCreate"
      :crm-type="createCRMType"
      :createSubType="createSubType"
      :action="createActionInfo"
      @hiden-view="hideView"
      @on-addData="addFeedbackdata"
      :currentHash="createSubType"
    />
  </div>
</template>

<script>
import CRMMessage from "../message/compenents/CRMMessage"; // 系統消息
import { mapGetters } from "vuex";
import { objDeepCopy } from "@/utils";
import CRMCreateView from "../components/CRMCreateView";

export default {
  /** 客戶管理 的 消息列表 */
  name: "demand",

  components: {
    CRMMessage,
    CRMCreateView
  },

  watch: {
    /** 變化就刷新數據 */
    messageNum() {
      this.refreshNum();
    }
  },

  data() {
    // 投訴頁面--complaint
    return {
      crmType: "product", //類型
      isCreate: false, //是創建
      leftType: "todayCustomer",
      mainLeftType: "complaint",
      leftSides: [
        {
          name: "投訴",
          crmType: "complaint",
          infoType: "todayCustomer",
          num: 0,
          tips: "投訴",
          hidden: false
        },
        {
          name: "需求",
          crmType: "demand",
          infoType: "followLeads",
          num: 0,
          tips: "需求",
          hidden: false
        },
        {
          name: "意見",
          crmType: "opinion",
          infoType: "followCustomer",
          num: 0,
          tips: "意見",
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
    addFeedbackdata() {
      const currentComponentIndex = {
        complaint: 0,
        demand: 1,
        opinion: 2
      };
      this.$refs.child[currentComponentIndex[this.mainLeftType]].getList();
    },
    hideView() {
      this.isCreate = false;
    },
    createClick() {
      this.createCRMType = this.crmType;
      this.createSubType = this.mainLeftType;
      this.createActionInfo = { type: "save" };
      this.isCreate = !this.isCreate;
    },
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
      (this.leftType = item.infoType), (this.mainLeftType = item.crmType);
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
</style>
