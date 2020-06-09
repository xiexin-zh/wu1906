<template>
  <div class="ec-container">
    <div class="title">
      {{ infoTitle }}
      <el-tooltip
        v-if="infoTips"
        effect="dark"
        :content="infoTips"
        placement="top"
      >
        <i class="wukong wukong-help_tips"></i>
      </el-tooltip>
    </div>
    <div class="option-bar">
      <div v-if="selectionList.length == 0">
        <!-- <el-select v-model="optionsType"
                   @change="refreshList"
                   placeholder="請選擇">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value">
          </el-option>
        </el-select>-->
        <el-select
          v-model="isSubType"
          @change="refreshList"
          style="width: 120px; margin-left: 10px;"
          placeholder="請選擇"
        >
          <el-option
            v-for="item in [
              { name: '待處理', value: 0 },
              { name: '已處理', value: 1 }
            ]"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <div v-if="showFilterView"
             class="filtrate-button"
             @click="getFilterFieldInfo">
          <img class="filtrate-button-img"
               src="@/assets/img/c_filtrate.png" />
          <span class="filtrate-button-title">高級篩選</span>
        </div>-->
        <filter-form
          :fieldList="filterFieldList"
          :dialogVisible.sync="showFilter"
          :obj="filterObj"
          :crmType="crmType"
          :isSeas="true"
          @filter="handleFilter"
        ></filter-form>
      </div>
      <flexbox v-else class="selection-bar">
        <div class="selected—title">
          已選中
          <span class="selected—count">{{ selectionList.length }}</span
          >項
        </div>
        <flexbox class="selection-items-box">
          <flexbox
            class="selection-item"
            v-for="(item, index) in selectionButtonList"
            :key="index"
            @click.native="selectionBarClick(item.type)"
          >
            <img class="selection-item-icon" :src="item.icon" />
            <div class="selection-item-name">{{ item.name }}</div>
          </flexbox>
        </flexbox>
      </flexbox>
    </div>
    <filter-content
      v-if="filterObj.form && filterObj.form.length > 0"
      :obj="filterObj"
      @delete="handleDeleteField"
    ></filter-content>
    <el-table
      class="n-table--border"
      id="crm-table"
      v-loading="loading"
      :data="list"
      :height="tableHeight"
      stripe
      border
      highlight-current-row
      style="width: 100%"
      :cell-style="cellStyle"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <!-- table head -->
      <el-table-column
        show-overflow-tooltip
        type="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in fieldList"
        :key="index"
        show-overflow-tooltip
        :prop="item.prop"
        :label="item.label"
        :width="Object.is(infoType, 'todayCustomer') && item.width"
        :formatter="fieldFormatter"
        align="center"
      ></el-table-column>
      <!-- <el-table-column :resizable="false"> </el-table-column> -->
      <!-- <el-table-column
        v-if="showCheckStatus"
        show-overflow-tooltip
        prop="check_status_info"
        label="狀態"
        :resizable="false"
        width="100"
        align="center"
        fixed="right"
      >
        <template slot="header" slot-scope="scope">
          <div class="table-head-name">{{ scope.column.label }}</div>
        </template>
        <template slot-scope="scope">
          <div
            class="status_button"
            :style="getStatusStyle(scope.row.check_status)"
          >
            {{ scope.row.check_status_info }}
          </div>
        </template>
      </el-table-column>-->
    </el-table>
    <div class="p-contianer">
      <el-pagination
        class="p-bar"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 相關詳情頁面 -->
    <c-r-m-all-detail
      :visible.sync="showDview"
      :crmType="rowType"
      :id="rowID"
    ></c-r-m-all-detail>
  </div>
</template>

<script>
import { filterIndexfields } from "@/api/customermanagement/common";
// import { crmLeadsSetFollowAPI } from "@/api/customermanagement/clue";
// import { crmCustomerSetFollowAPI } from "@/api/customermanagement/customer";
import message_table from "../mixins/message_table";
import filterForm from "@/views/customermanagement/components/filterForm";
import filterContent from "@/views/customermanagement/components/filterForm/filterContent";
import CRMAllDetail from "@/views/customermanagement/components/CRMAllDetail";
import {
  newComplaintDelete, // 投诉删除
  newDemandDelete // 意见需求删除
} from "@/api/new-api/message";
export default {
  /** 客戶管理 的待審核系統 */
  name: "c-r-m-message",

  components: {
    filterForm,
    filterContent,
    CRMAllDetail
  },

  mixins: [message_table],

  watch: {
    show() {
      this.initTableHead();
    }
  },

  props: {
    // crm類型
    crmType: {
      type: String,
      default: ""
    },
    // crm某個類型下的類型數據
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

    // 展示的時候 才發請求
    show: Boolean
  },

  data() {
    return {
      optionsType: 0,
      isSubType: 0, // 是否是下屬
      /** 高級篩選 */
      showFilter: false, // 控制篩選框
      filterFieldList: [],
      filterObj: { form: [] }, // 篩選確定數據
      /** 勾選數據操作 */
      selectionList: [], // 勾選的數據
      selectionButtonList: [
        {
          name: "刪除",
          type: "delete",
          icon: require("@/assets/img/selection_delete.png")
        }
      ], // 操作按鈕列表
      /** 控制詳情展示 */
      rowID: "", // 行信息
      rowType: "", //詳情類型
      showDview: false
    };
  },

  computed: {
    // 展示篩選
    showFilterView() {
      if (this.crmType == "receivables_plan") {
        return false;
      }
      return true;
    },

    // 展示審核狀態
    showCheckStatus() {
      if (this.crmType == "contract" || this.crmType == "receivables") {
        return true;
      }
      return false;
    },

    // 下拉數據
    options() {
      if (this.infoType == "todayCustomer") {
        return [
          { name: "今日需聯繫", value: 1 },
          { name: "已逾期", value: 2 },
          { name: "已聯繫", value: 3 }
        ];
      } else if (
        this.infoType == "followLeads" ||
        this.infoType == "followCustomer"
      ) {
        return [
          { name: "待跟進", value: 1 },
          { name: "已跟進", value: 2 }
        ];
      } else if (
        this.infoType == "checkContract" ||
        this.infoType == "checkReceivables"
      ) {
        return [
          { name: "待審核", value: 1 },
          { name: "已審核", value: 2 }
        ];
      } else if (this.infoType == "remindReceivablesPlan") {
        return [
          { name: "待回款", value: 1 },
          { name: "已回款", value: 2 },
          { name: "已逾期", value: 3 }
        ];
      } else if (this.infoType == "endContract") {
        return [
          { name: "即將到期", value: 1 },
          { name: "已到期", value: 2 }
        ];
      }

      return [];
    }
  },

  mounted() {
    if (this.options.length > 0) {
      this.optionsType = this.options[0].value;
    }

    this.initTableHead();
  },

  methods: {
    /**
     * 初始化表頭數據
     */
    initTableHead() {
      if (this.show && this.fieldList.length == 0) {
        this.getFieldList();
      }
    },

    /**
     * 刷新列表
     */
    refreshList() {
      this.currentPage = 1;
      if (this.fieldList.length > 0) {
        this.getList();
      } else {
        this.getFieldList();
      }
    },

    /**
     * 勾選數據
     */
    handleSelectionChange(val) {
      this.selectionList = val; // 勾選的行
    },
    // 获取操作的 ids
    getSelectId() {
      const _this = this;
      const selectUser_ids = this.selectionList.map(function(
        item,
        index,
        array
      ) {
        return {
          todayCustomer: item.complaint_id, // 投诉 id
          followLeads: item.demand_id, // 需求 id
          followCustomer: item.demand_id // 意见 id
        }[_this.infoType];
      });
      return selectUser_ids;
    },
    /**
     * 勾選後的操作
     */
    selectionBarClick(type) {
      const ids = this.getSelectId();
      if (type === "delete") {
        this.$confirm("確定要刪除這些數據嗎?", "提示", {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.loading = true;
            // 客户反馈 投诉/需求/意见 删除
            const deleteRes = this.deleteRequest();
            deleteRes({
              id: ids
            })
              .then(res => {
                this.refreshList(); // 刷新列表
                this.$message({
                  type: "success",
                  message: res.data
                });
              })
              .catch(_ => {
                this.$message.error("删除失败");
                this.loading = false;
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      }
    },
    /**
     * 客户反馈 投诉/需求/意见 删除接口
     */
    deleteRequest() {
      return {
        todayCustomer: newComplaintDelete, // 投诉删除
        followLeads: newDemandDelete, // 需求删除
        followCustomer: newDemandDelete // 意见删除
      }[this.infoType];
    },

    /**
     * 獲取高級篩選字段數據後展示
     */
    getFilterFieldInfo() {
      filterIndexfields({
        types: "crm_" + this.crmType
      })
        .then(res => {
          this.filterFieldList = res.data;
          this.showFilter = true;
        })
        .catch(() => {});
    },

    /**
     * 選擇篩選字段
     */
    handleFilter(form) {
      this.filterObj = form;
      this.showFilter = false;
      this.refreshList();
    },

    /**
     * 刪除篩選字段
     */
    handleDeleteField(data) {
      this.filterObj = data.obj;
      var offsetHei = document.documentElement.clientHeight;
      var removeHeight = Object.keys(this.filterObj).length > 0 ? 310 : 240;
      this.tableHeight = offsetHei - removeHeight;
      this.refreshList();
    },

    /**
     * 表單元可點擊樣式
     */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (
        column.property === "name" ||
        column.property === "number" ||
        column.property === "customer_id" ||
        column.property === "contract_id" ||
        column.property === "business_id"
      ) {
        // 新增 投诉/需求/意见 去除可点击样式
        const notClickStyles = ["demand", "opinion", "complaint"];
        if (notClickStyles.includes(this.crmType)) {
          return "";
        }
        return { color: "#005DF7", cursor: "pointer" };
      } else {
        return "";
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/table.scss";
/** 場景和篩選 */
.filtrate-button {
  cursor: pointer;
  margin-left: 10px;
  display: inline-block;
  &-img {
    vertical-align: middle;
    margin: 0 5px;
    width: 12px;
  }
}
.filtrate-button:hover {
  color: $xr-color-primary;
}

.ec-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.title {
  padding: 0 20px;
  font-size: 16px;
  line-height: 60px;
  height: 60px;

  i {
    cursor: pointer;
    margin-left: 5px;
    color: #dcdfe6;
  }

  i:hover {
    color: $xr-color-primary;
  }
}
.option-bar {
  padding: 5px 20px;
}

/** 勾選操作 */
.selection-bar {
  font-size: 12px;
  height: 34px;
  color: #777;

  .selected—title {
    flex-shrink: 0;
    padding-right: 20px;
    border-right: 1px solid $--table-border-color;
    .selected—count {
      color: $xr-color-primary;
    }
  }
}

.selection-items-box {
  .selection-item {
    width: auto;
    padding: 15px;
    .selection-item-icon {
      display: block;
      margin-right: 5px;
      width: 15px;
      height: 15px;
    }
    .selection-item-name {
      cursor: pointer;
      color: #777;
    }
    .selection-item-name:hover {
      color: $xr-color-primary;
    }
  }
}
</style>
