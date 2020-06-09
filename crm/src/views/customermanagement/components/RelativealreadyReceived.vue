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
            {{ scope.row.start_time | moment("YYYY-MM-DD HH:mm:ss") }}
          </div>
          <div v-else>{{ scope.row[item.prop] }}</div>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="footer"
      style="border:1px solid #E6E6E6;padding: 10px 0px;border-top:0px solid #fff"
    >
      <span style="padding-left:8%;">已領取的購物</span>
      <span style="padding-left:15%;">{{ this.list.length }}</span>
    </div>
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
import { crmBusinessIndex } from "@/api/customermanagement/business";
// 新 api --- 購物紀錄  已領取 請求
import { crmCustomerDetail } from "@/api/new-api/common";
import { crmContactsRelationAPI } from "@/api/customermanagement/contacts";
import CrmRelative from "@/components/CreateCom/CrmRelative";
import { tableHeadList } from "../../../assets/data/relativeBusiness/table-head-list";
// import { shoppingTableHeadListData } from "../../../assets/data/shoppingRecord/shopping-record-table-head-list-data";
export default {
  name: "RelativealreadyReceived", //相关联系人商机  可能再很多地方展示 放到客户管理目录下（新建时仅和客户进行关联）
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
      tableHeight: "500px",
      showFullDetail: false,
      isCreate: false, // 控制新建
      businessId: "", // 查看全屏联系人详情的 ID
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
    cus_tomer_id: function(val) {
      this.list = [];
      this.getDetail();
    }
  },
  props: {
    /** 模块ID */
    id: [String, Number],
    cus_tomer_id: [String, Number],

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
        prop: "content",
        width: "200",
        label: "購買物品"
      });
      this.fieldList.push({
        prop: "vip_room",
        width: "200",
        label: "場館"
      });
      this.fieldList.push({
        prop: "shop_status",
        width: "200",
        label: "狀態"
      });
    },
    // 購物紀錄 已領取 列表展示
    getShoppingHaveReceivedData() {
      // 1是已領取，2是未領取
      this.loading = true;
      const params = {
        request_type: "shop",
        customer_id: this.cus_tomer_id,
        status: 1,
        page: 1,
        limit: 10
      };
      crmCustomerDetail(params)
        .then(res => {
          const {
            data: { list, dataCount }
          } = res;
          if (this.fieldList.length == 0) {
            this.getFieldList();
          }
          this.list = list;
          this.loading = false;
        })
        .catch(_ => {
          this.loading = false;
        });
    },
    /**
     * 获取详情列表
     */
    getDetail() {
      if (this.crmType === "crm_customer_shop") {
        // 購物紀錄 已領取 接口
        this.getShoppingHaveReceivedData();
        return false;
      }
      this.loading = true;
      let params = { pageType: "all" };
      params[this.crmType + "_id"] = this.id;
      crmBusinessIndex(params)
        .then(res => {
          if (this.fieldList.length == 0) {
            this.getFieldList();
          }
          this.nopermission = false;
          this.loading = false;
          // 已領取
          // this.list = shoppingTableHeadListData;
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
  //   display: flex;
  justify-content: space-around;
  width: 100%;
  span {
    width: 85px;
    text-align: left;
    font-size: 14px;
    @extend .relative-title;
  }
}
</style>
