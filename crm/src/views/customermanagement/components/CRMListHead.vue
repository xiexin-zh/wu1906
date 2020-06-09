<template>
  <div class="c-container">
    <div class="title">{{ title }}</div>
    <el-input
      class="sc-container"
      :placeholder="placeholder"
      v-model="inputContent"
      @keyup.enter.native="searchInput"
      @input="onInput"
    >
      <el-button
        slot="append"
        @click.native="searchInput"
        icon="el-icon-search"
      ></el-button>
    </el-input>
    <div class="right-container">
      <el-button
        @click="createClick"
        v-if="canSave"
        type="primary"
        v-show="!flag"
        >{{ mainTitle }}</el-button
      >
      <el-dropdown v-show="flag">
        <el-button type="primary">
          新增
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <div v-for="(item, index) in eventTypeTitle" :key="index">
            <el-dropdown-item @click.native="createClick(item)">{{
              item.name
            }}</el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 客户接触 和客户信息 没有更多 -->
      <el-dropdown
        trigger="click"
        v-if="moreTypes.length > 0"
        v-show="hideElDropdown"
        @command="handleTypeDrop"
      >
        <flexbox class="right-more-item">
          <div>更多</div>
          <i class="el-icon-arrow-down el-icon--right" style="color:#777;"></i>
        </flexbox>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in moreTypes"
            :key="index"
            :command="item.type"
            >{{ item.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 新增 -->
    <c-r-m-create-view
      v-if="isCreate"
      :crm-type="createCRMType"
      :createSubType="createSubType"
      :action="createActionInfo"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"
      @on-addData="addListItem"
      :currentHash="currentHash"
      :titleList="flagList"
    ></c-r-m-create-view>
    <!-- 没有导入导出      -->
    <!-- <c-r-m-import
      :show="showCRMImport"
      @close="showCRMImport = false"
      :crmType="crmType"
    >
    </c-r-m-import>-->
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from "vuex";
import CRMCreateView from "./CRMCreateView";
import CRMImport from "./CRMImport";
// 新 API // 接触类别接口
import { crmCustomerDetailEventType } from "@/api/new-api/common";
export default {
  name: "CRM-list-head", //客户管理下 重要提醒 回款计划提醒
  components: {
    CRMCreateView,
    CRMImport
  },
  computed: {
    ...mapGetters(["crm"]),
    canSave() {
      if (
        this.isSeas ||
        this.currentHash === "shoppingRecord" ||
        this.currentHash === "customerAnalysis"
      ) {
        return false;
      }
      return this.crm[this.crmType].save || true;
    },
    hideElDropdown() {
      const hide =
        !Object.is(this.crmType, "contacts") &&
        !Object.is(this.crmType, "customer");
      return hide;
    }
  },
  data() {
    return {
      flag: false,
      flagList: "",
      inputContent: "",
      /** 更多操作 */
      moreTypes: [],
      // 创建的相关信息
      createActionInfo: { type: "save" },
      createCRMType: "",
      createSubType: "",
      isCreate: false, //是创建
      // 导入
      showCRMImport: false,
      eventTypeTitle: []
    };
  },
  props: {
    faceId: "",
    hasFaceId: false,
    title: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "請輸入內容"
    },
    mainTitle: {
      type: String,
      default: ""
    },
    // CRM类型
    crmType: {
      type: String,
      default: ""
    },
    /** 是公海 */
    isSeas: {
      type: Boolean,
      default: false
    },
    isSubType: {
      type: String,
      default: ""
    },
    currentHash: {
      type: String,
      default: ""
    }
  },
  created() {
    if (this.$store.state.user.faceID && this.hasFaceId)
      this.inputContent = this.$store.state.user.faceID;
  },

  mounted() {
    if (window.document.location.hash == "#/crm/customerContact") {
      crmCustomerDetailEventType().then(res => {
        this.eventTypeTitle = res.data;
      });
      this.flag = true;
    }
    // 线索和客户判断更多操作
    if (!this.isSeas) {
      if (this.crm[this.crmType].excelimport) {
        this.moreTypes.push({ type: "enter", name: "導入" });
      }
      if (this.crm[this.crmType].excelexport) {
        this.moreTypes.push({ type: "out", name: "導出" });
      }
    } else {
      // 客户池的导出关键字不同
      if (this.crm[this.crmType].poolexcelexport) {
        this.moreTypes.push({ type: "out", name: "導出" });
      }
    }
  },
  watch: {
    faceId(val) {
      this.inputContent = val;
      this.searchInput();
    }
  },
  methods: {
    onInput() {
      if (this.inputContent.length === 0) {
        this.searchInput();
      }
    },
    addListItem(addData) {
      this.$emit("on-addStaticData", addData);
    },
    handleTypeDrop(command) {
      if (command == "out") {
        this.$emit("on-export");
      } else if (command == "enter") {
        this.showCRMImport = true;
      }
    },
    createClick(data) {
      if (window.document.location.hash == "#/crm/customerContact") {
        this.flagList = "新增" + data.name;
        this.createCRMType = this.crmType;
        this.createSubType = this.isSubType;
        this.createActionInfo = { type: "save", data };
        this.isCreate = !this.isCreate;
      } else {
        this.createCRMType = this.crmType;
        this.createSubType = this.isSubType;
        this.createActionInfo = { type: "save" };
        this.isCreate = !this.isCreate;
      }
    },
    // 进行搜索操作
    searchInput() {
      this.$emit("on-search", this.inputContent);
    },
    // 创建数据页面 保存成功
    createSaveSuccess(data) {
      if (data && data.saveAndCreate) {
        if (data.type == "customer") {
          this.createCRMType = "contacts";
          this.createActionInfo = {
            type: "relative",
            crmType: "customer",
            data: {}
          };
          this.createActionInfo.data["customer"] = data.data;
          this.isCreate = true;
        }
      } else {
        // 回到保存成功
        this.$emit("on-handle", { type: "save-success" });
      }
    },
    hideView() {
      this.isCreate = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.c-container {
  height: 60px;
  position: relative;
  z-index: 100;
  .title {
    float: left;
    padding: 0 20px;
    font-size: 18px;
    line-height: 60px;
  }
  .sc-container {
    width: 300px;
    margin: -18px 0 0 -150px;
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .right-container {
    margin-right: -10px;
    float: right;
    margin: 12px 20px 0 0;
    position: relative;
    .right-item {
      float: left;
      margin-right: 10px;
      padding: 8px 10px;
      font-size: 13px;
      border-radius: 2px;
    }

    .right-more-item {
      cursor: pointer;
      border: 1px solid #dcdfe6;
      background-color: white;
      font-size: 13px;
      color: #777;
      padding: 0 12px;
      border-radius: 2px;
      height: 31px;
    }
  }
}
</style>
