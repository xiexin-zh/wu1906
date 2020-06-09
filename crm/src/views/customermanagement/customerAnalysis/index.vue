<template>
  <!-- 客户分析頁面 -->
  <div class="header_crm">
    <c-r-m-list-head
      title="客户分析"
      placeholder="請輸入戶口名稱"
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      main-title="新建客戶"
      @on-export="exportInfos"
      :crm-type="crmType"
      @on-addStaticData="addStaticData"
      :currentHash="hash"
    >
    </c-r-m-list-head>
    <div
      v-empty="!crm.customer.index"
      xs-empty-icon="nopermission"
      xs-empty-text="暫無權限"
      class="crm-container"
    >
      <!-- 客户信息 -->
      <c-r-m-table-head
        ref="crmTableHead"
        :crm-type="crmType"
        @filter="handleFilter"
        @handle="handleHandle"
        @scene="handleScene"
        @on-deleteStaticData="deleteStaticData"
        :currentHash="hash"
      ></c-r-m-table-head>
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
        @header-dragend="handleHeaderDragend"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column
          show-overflow-tooltip
          type="selection"
          align="center"
          width="55"
        >
        客户分析 没有前边的选择框
        </el-table-column> -->
        <!-- 内容展示 -->
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          show-overflow-tooltip
          align="center"
          :fixed="index == 0"
          :prop="item.prop"
          :label="item.label"
          :formatter="fieldFormatter"
        >
          <!-- table head 各项 -->
          <template slot="header" slot-scope="scope">
            <div class="table-head-name">{{ scope.column.label }}</div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 当前页面底部的翻页 -->
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
        >
        </el-pagination>
      </div>
    </div>
    <!-- 相关详情页面 -->
    <c-r-m-all-detail
      :visible.sync="showDview"
      :crmType="rowType"
      :id="rowID"
      class="d-view"
    >
    </c-r-m-all-detail>
    <fields-set
      :crmType="crmType"
      @set-success="setSave"
      :dialogVisible.sync="showFieldSet"
    ></fields-set>
  </div>
</template>

<script>
import CRMAllDetail from "@/views/customermanagement/components/CRMAllDetail";
import table from "../mixins/table";

export default {
  /** 客户管理 的 客户列表 */
  name: "customerAnalysis",
  components: {
    CRMAllDetail
  },
  mixins: [table], //这是表格的数据  ///////////////
  data() {
    return {
      crmType: "customer", //类型
      hash: "customerAnalysis"
    };
  },
  computed: {},
  mounted() {
    this.getHash();
  },
  methods: {
    // 路由判斷獲取 靜態數據
    getHash() {
      const { hash } = window.document.location;
      this.hash = hash.split("/")[2];
    },
    relativeBusinessClick(data) {
      this.rowID = data.business_id;
      this.rowType = "business";
      this.showDview = true;
    },
    /** 通过回调控制style */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (
        column.property === "name" ||
        column.property === "business-check" ||
        column.property === "customer_id"
      ) {
        return { color: "#005DF7", cursor: "pointer" };
      } else {
        return "";
      }
    },
    // 商机信息查看
    businessCheckClick(e, scope) {
      if (scope.row.business_count == 0) {
        return;
      }
      this.$set(scope.row, "show", !scope.row.show);
      const popoverEl = e.target.parentNode;
      popoverEl.__vue__.showPopper = !scope.row.show;
    },
    businessClose(e, scope) {
      const popoverEl = e.parentNode;
      popoverEl.__vue__.showPopper = false;
      this.$set(scope.row, "show", false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/table.scss";
.customer-lock {
  color: #f15e64;
}

.el-table /deep/ tbody tr td:nth-child(2) {
  border-right-width: 0;
}
</style>
