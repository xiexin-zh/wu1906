<template>
  <div
    class="rc-cont"
    v-empty="nopermission"
    xs-empty-icon="nopermission"
    xs-empty-text="暫無權限"
  >
    <flexbox
      v-if="!isSeas && tabCurrentName !== 'session'"
      class="rc-head"
      direction="row-reverse"
    >
      <!-- <el-button class="rc-head-item" @click.native="createClick" type="primary"
        >新建商機</el-button
      >-->
      <el-button
        v-if="canRelation"
        class="rc-head-item"
        @click.native="unRelevanceHandleClick"
        type="primary"
        >解除關聯</el-button
      >
      <el-popover
        v-if="canRelation"
        v-model="showRelativeView"
        placement="bottom"
        width="700"
        popper-class="no-padding-popover"
        trigger="click"
        style="margin-right: 20px;"
      >
        <crm-relative
          v-model="showRelativeView"
          :show="showRelativeView"
          :radio="false"
          ref="crmrelative"
          :action="{
            type: 'condition',
            data: { form_type: 'customer', customer_id: customer_id }
          }"
          :selectedData="{ business: list }"
          crm-type="business"
          @close="showRelativeView = false"
          @changeCheckout="checkRelativeInfos"
        ></crm-relative>
        <el-button
          slot="reference"
          class="rc-head-item"
          style="margin-right: 0;"
          @click.native="showRelativeView = true"
          type="primary"
          >關聯</el-button
        >
      </el-popover>
    </flexbox>
    <!-- <div class="relative-title">本月入場資訊</div> -->
    <el-table
      :data="list"
      :height="tableHeight"
      stripe
      style="width: 100%;border: 1px solid #E6E6E6;"
      :header-cell-style="headerRowStyle"
      :cell-style="cellStyle"
      @row-click="handleRowClick"
      @selection-change="selectionList = $event"
    >
      <el-table-column
        v-if="canRelation && fieldList.length > 0"
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
        :formatter="fieldFormatter"
        :label="item.label"
      >
        <template slot-scope="scope">
          <div v-if="item.prop === 'start_time'">
            {{
              scope.row.start_time
                | filterTimestampToFormatTime("YYYY-MM-DD HH:mm:ss")
            }}
          </div>
          <div v-else>{{ scope.row[item.prop] }}</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div
      class="footer"
      style="border-right:1px solid #E6E6E6;border-left:1px solid #E6E6E6;padding: 10px 0px;"
    >
      <p>本月</p>
      <p>6次</p>
      <p>全年 | 開戶</p>
      <p>42次 | 110次</p>
    </div>-->
    <!-- <div class="footer" style="border:1px solid #E6E6E6;padding: 10px 0px;">
      <p>平均逗留天數</p>
      <p>1 天</p>
      <p>平均入場金額</p>
      <p>40.06 萬</p>
    </div>-->

    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      crmType="business"
      :id="businessId"
    ></c-r-m-full-screen-detail>
    <c-r-m-create-view
      v-if="isCreate"
      crm-type="business"
      :action="createActionInfo"
      @save-success="createSaveSuccess"
      @hiden-view="isCreate = false"
    ></c-r-m-create-view>
  </div>
</template>

<script type="text/javascript">
import loading from "../mixins/loading";
import CRMCreateView from "./CRMCreateView";
// import { crmBusinessIndex } from "@/api/customermanagement/business";
import { crmContactsRelationAPI } from "@/api/customermanagement/contacts";
import { crmCustomerDetailContactDetail } from "@/api/new-api/common"; // 客户接触 二级 列表展示
import CrmRelative from "@/components/CreateCom/CrmRelative";
import { tableHeadList } from "../../../assets/data/relativeBusiness/table-head-list";
// import { relativeTouchList } from "../../../assets/data/relativeTableListNum/relative-table-list-num-data";
export default {
  name: "RelativeTouch", //相关联系人商机  可能再很多地方展示 放到客户管理目录下（新建时仅和客户进行关联）
  components: {
    CRMFullScreenDetail: () => import("./CRMFullScreenDetail.vue"),
    CRMCreateView,
    CrmRelative
  },
  computed: {
    // 联系人下客户id获取关联商机
    customer_id() {
      return this.detail.customer_id;
    },
    // 是否能关联
    canRelation() {
      return this.crmType == "contacts";
    }
  },
  mixins: [loading],
  data() {
    return {
      nopermission: false,
      list: [],
      fieldList: [],
      tableHeight: "400px",
      showFullDetail: false,
      isCreate: false, // 控制新建
      businessId: "", //  ID
      /** 格式化规则 */
      formatterRules: {},
      // 创建的相关信息
      createActionInfo: { type: "relative", crmType: this.crmType, data: {} },
      /**
       * 关联的逻辑
       */
      showRelativeView: false, // 控制关联信息视图
      selectionList: [] // 取消关联勾选的数据
    };
  },
  watch: {
    id: function(val) {
      this.list = [];
      this.getDetail();
    }
  },
  props: {
    /** 模块ID */
    id: [String, Number],
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ""
    },
    /** 是公海 默认是客户 */
    isSeas: {
      type: Boolean,
      default: false
    },
    /** 联系人人下 新建商机 需要联系人里的客户信息  合同下需要客户和商机信息 */
    detail: {
      type: Object,
      default: () => {
        return {};
      }
    },
    tabCurrentName: {
      type: String,
      default: ""
    }
  },
  mounted() {
    this.getDetail();
    this.Bus.$on("addCustomerContactData", data => {
      this.list.push(data);
    });
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    /**
     * 关联的数据
     */
    checkRelativeInfos(data) {
      if (data.data.length > 0) {
        let params = { is_relation: 1 };
        params[this.crmType + "_id"] = this.id;
        params.business_id = data.data.map(item => {
          return item.business_id;
        });
        crmContactsRelationAPI(params)
          .then(res => {
            this.getDetail();
            this.$message.success(res.data);
          })
          .catch(() => {});
      }
    },

    /**
     * 取消关联
     */
    unRelevanceHandleClick() {
      if (this.selectionList.length == 0) {
        this.$message.error("請先勾選數據");
      } else {
        this.$confirm("確認取消關聯?", "提示", {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let params = { is_relation: 0 };
            params[this.crmType + "_id"] = this.id;
            params.business_id = this.selectionList.map(item => {
              return item.business_id;
            });
            crmContactsRelationAPI(params)
              .then(res => {
                this.getDetail();
                this.$message.success(res.data);
              })
              .catch(() => {});
          })
          .catch(() => {
            this.$message.info("已取消操作");
          });
      }
    },

    /**
     * 获取字段信息
     */
    getFieldList() {
      if (Object.is(this.tabCurrentName, "session")) {
        // 表格 head list
        this.fieldList = tableHeadList;
        return false;
      }
      this.fieldList.push({
        prop: "start_time",
        width: "200",
        label: "時間"
      });
      this.fieldList.push({
        prop: "travel_type",
        width: "200",
        label: "類型"
      });
      this.fieldList.push({
        prop: "title",
        width: "200",
        label: "主題"
      });
      this.fieldList.push({
        prop: "owner_user",
        width: "200",
        label: "部門|跟進人"
      });
      this.fieldList.push({
        prop: "address",
        width: "200",
        label: "地點"
      });
      this.fieldList.push({
        prop: "remark",
        width: "200",
        label: "簡述"
      });
    },

    /**
     * 客户接触中的  接触列表
     * 获取详情列表
     */
    getDetail() {
      this.loading = true;
      crmCustomerDetailContactDetail({
        travel_type: "127", // 接触
        customer_id: this.id,
        page: 1,
        limit: 10
      })
        .then(res => {
          if (this.fieldList.length == 0) {
            this.getFieldList();
          }
          this.nopermission = false;
          this.loading = false;
          this.list = res.data.list;
        })
        .catch(data => {
          if (data.code == 102) {
            this.nopermission = true;
          }
          this.loading = false;
        });
    },
    /** 格式化字段 */
    fieldFormatter(row, column) {
      // 如果需要格式化
      var aRules = this.formatterRules[column.property];
      if (aRules) {
        if (aRules.type === "crm") {
          if (column.property) {
            return aRules.formatter(row[column.property + "_info"]);
          } else {
            return "";
          }
        } else {
          return aRules.formatter(row[column.property]);
        }
      }
      return row[column.property];
    },
    //当某一行被点击时会触发该事件
    handleRowClick(row, column, event) {
      // 客戶分析--場次分析，禁止點擊某行
      return false;
      this.businessId = row.business_id;
      this.showFullDetail = true;
    },
    /** 通过回调控制表头style */
    headerRowStyle({ row, column, rowIndex, columnIndex }) {
      return { textAlign: "center" };
    },
    /** 通过回调控制style */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return { textAlign: "center" };
    },
    /** 新建 */
    createClick() {
      /** 客户 和 联系人 下可新建商机  */
      if (this.crmType == "contacts") {
        this.createActionInfo.data["customer"] = this.detail.customer_id_info;
      } else if (this.crmType == "customer") {
        this.createActionInfo.data["customer"] = this.detail;
      }
      this.isCreate = true;
    },

    /**
     * 创建成功刷新相关信息
     */
    createSaveSuccess() {
      if (this.canRelation) {
        this.$refs.crmrelative.refreshList();
      } else {
        this.getDetail();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../styles/relativecrm.scss";
.relative-title {
  font-size: 16px;
  // font-weight: bold;
}
.current-month {
  margin: 10px 0;
}
.footer {
  display: flex;
  justify-content: space-around;
  p {
    width: 85px;
    text-align: left;
    font-size: 14px;
    @extend .relative-title;
  }
}
</style>
