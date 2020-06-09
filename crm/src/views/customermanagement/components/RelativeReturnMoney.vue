<template>
  <div class="rc-cont">
    <flexbox
      v-if="!isSeas && tabCurrentName !== 'account'"
      class="rc-head"
      direction="row-reverse"
    >
      <el-button
        class="rc-head-item"
        @click.native="createClick('plan')"
        type="primary"
        >新建回款計劃</el-button
      >
    </flexbox>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="交易" name="1">
        <!-- <div class="trading">交易</div> -->
        <el-table
          :data="palnList"
          :height="tableHeight"
          stripe
          style="width: 100%;border: 1px solid #E6E6E6;"
          :header-cell-style="headerRowStyle"
          :cell-style="cellStyle"
        >
          <el-table-column
            v-for="(item, index) in planFieldList"
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
          <el-table-column
            label="操作"
            width="100"
            v-if="tabCurrentName !== 'account'"
          >
            <template slot-scope="scope">
              <flexbox justify="center">
                <el-button type="text" @click.native="handleFile('edit', scope)"
                  >編輯</el-button
                >
                <el-button
                  type="text"
                  @click.native="handleFile('delete', scope)"
                  >刪除</el-button
                >
              </flexbox>
            </template>
          </el-table-column>
        </el-table>
        <div
          class="trading-footer"
          style="border: 1px solid #E6E6E6;padding: 10px 5px;"
        >
          <p>全年提存轉帳次數</p>
          <p>26 次</p>
          <p>
            轉碼
            <span class="date-type">全年 | 開戶</span>
          </p>
          <div>
            <p>7000</p>
            <div>
              <p style="font-size: xx-small;">(萬)</p>
              <p style="font-size: xx-small;">HKD</p>
            </div>
            <span class="division">|</span>
            <p>7000</p>
            <div>
              <p style="font-size: xx-small;">(萬)</p>
              <p style="font-size: xx-small;">HKD</p>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="禮遇" name="2">
        <!-- <flexbox
          class="rc-head"
          direction="row-reverse"
          style="margin-top: 15px;"
        >
          <el-button
            v-show="!isSeas && tabCurrentName !== 'account'"
            class="rc-head-item"
            @click.native="createClick('money')"
            type="primary"
            >新建回款</el-button
          >
        </flexbox> -->
        <el-table
          :data="list"
          :height="tableHeight"
          stripe
          style="width: 100%;border: 1px solid #E6E6E6;"
          :header-cell-style="headerRowStyle"
          :cell-style="cellStyle"
          @row-click="handleRowClick"
        >
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
        <div class="trading-footer" style="border-bottom:1px solid #E6E6E6">
          <p>次數</p>
          <p>26 次</p>
          <p>共計</p>
          <div>
            <p>3.19</p>
            <div>
              <p style="font-size: xx-small;">(萬)</p>
              <p style="font-size: xx-small;">HKD</p>
            </div>
          </div>
        </div>
        <div class="trading-footer">
          <p>
            殺數
            <span class="date-type">全年 | 開戶</span>
          </p>
          <div>
            <p>22.04</p>
            <div>
              <p style="font-size: xx-small;">(萬)</p>
              <p style="font-size: xx-small;">HKD</p>
            </div>
            <span class="division">|</span>
            <p>402.20</p>
            <div>
              <p style="font-size: xx-small;">(萬)</p>
              <p>HKD</p>
            </div>
          </div>
          <p>
            殺數率
            <span class="date-type">全年 | 開戶</span>
          </p>
          <div>
            <p>0.32 %</p>
            <span class="division">|</span>
            <p>5.23 %</p>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :crmType="showFullCrmType"
      :id="showFullId"
    ></c-r-m-full-screen-detail>
    <c-r-m-create-view
      v-if="isCreate"
      :crm-type="createCrmType"
      :action="createActionInfo"
      @save-success="saveSuccess"
      @hiden-view="isCreate = false"
    ></c-r-m-create-view>
  </div>
</template>

<script type="text/javascript">
import loading from "../mixins/loading";
import CRMCreateView from "./CRMCreateView";
import {
  crmReceivablesIndex,
  crmReceivablesPlanIndex,
  crmReceivablesPlanDeleteAPI
} from "@/api/customermanagement/money";
import { crmCustomerDetailAnalysisDetail } from "@/api/new-api/common";
import { timestampToFormatTime } from "@/utils";

// 交易/禮遇 table content
import { courtesyTableContentList } from "../../../assets/data/relativeReturnMoney/relative-return-money";

export default {
  name: "relative-return-money", //相关回款  可能再很多地方展示 放到客户管理目录下

  components: {
    CRMCreateView,
    CRMFullScreenDetail: () => import("./CRMFullScreenDetail.vue")
  },

  computed: {},

  mixins: [loading],

  data() {
    return {
      activeNames: ["1"],
      list: [],
      fieldList: [],
      tableHeight: "300px",
      showFullDetail: false,
      showFullCrmType: "receivables",
      showFullId: "", // 查看全屏详情的 ID
      createCrmType: "receivables_plan", // 创建回款计划
      isCreate: false, // 新建回款回款
      palnList: [],
      planFieldList: [],
      createActionInfo: {} // 新建回款计划的时候 在客户 合同下导入关联信息
    };
  },

  watch: {
    id: function(val) {
      this.list = [];
      this.palnList = [];
      this.getList();
      this.getPlanList();
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
    /** 客户和 合同下 可新建 回款计划 */
    detail: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /** 是公海 默认是客户 */
    isSeas: {
      type: Boolean,
      default: false
    },
    tabCurrentName: {
      type: String,
      default: ""
    }
  },

  mounted() {
    this.planFieldList =
      this.tabCurrentName === "account"
        ? [
            { prop: "start_time", width: "200", label: "日期" },
            { prop: "admission_amount", width: "200", label: "金額" },
            { prop: "type", width: "200", label: "類型" },
            { prop: "address", width: "200", label: "場館" }
          ]
        : [
            { prop: "num", width: "200", label: "期數" },
            { prop: "customer_id", width: "200", label: "戶口名稱" },
            { prop: "contract_id", width: "200", label: "合同編號" },
            { prop: "money", width: "200", label: "計劃回款金額" },
            { prop: "return_date", width: "200", label: "計劃回款日期" },
            { prop: "return_type", width: "200", label: "計劃回款方式" },
            { prop: "remind", width: "200", label: "提前幾日提醒" },
            { prop: "remark", width: "200", label: "備註" }
          ];

    this.getPlanList();

    this.fieldList =
      this.tabCurrentName === "account"
        ? [
            { prop: "start_time", width: "200", label: "日期" },
            { prop: "travel_type", width: "200", label: "類別" },
            { prop: "admission_amount", width: "200", label: "金額" },
            { prop: "type", width: "200", label: "類型" },
            { prop: "address", width: "200", label: "場館" }
          ]
        : [
            { prop: "number", width: "200", label: "回款編號" },
            { prop: "contract_id", width: "200", label: "合同名稱" },
            { prop: "contract_money", width: "200", label: "合同金額" },
            { prop: "money", width: "200", label: "回款金額" },
            { prop: "num", width: "200", label: "期數" },
            { prop: "owner_user_id", width: "200", label: "跟進人" },
            { prop: "check_status_info", width: "200", label: "狀態" },
            { prop: "return_time", width: "200", label: "回款日期" }
          ];
    this.getList();
  },

  methods: {
    /**
     * 回款计划列表
     */
    getPlanList() {
      this.loading = true;
      // 交易 teble content
      crmCustomerDetailAnalysisDetail({
        travel_type: 129,
        customer_id: this.id,
        nearly_month: 0,
        page: 1,
        limit: 10
      })
        .then(res => {
          this.loading = false;
          this.palnList = res.data.list;
          // this.palnList = courtesyTableContentList;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /**
     * 回款列表
     */
    getList() {
      this.loading = true;
      // 禮遇 table content
      crmCustomerDetailAnalysisDetail({
        travel_type: 325,
        customer_id: this.id,
        nearly_month: 0,
        page: 1,
        limit: 10
      })
        .then(res => {
          this.loading = false;
          this.list = res.data.list;
          // this.list = courtesyTableContentList;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /**
     * 获取上传参数
     */
    getParams() {
      if (this.crmType === "customer") {
        return { customer_id: this.id, pageType: "all" };
      } else if (this.crmType === "contract") {
        return { contract_id: this.id, pageType: "all" };
      }
      return {};
    },

    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {
      return false;
      this.showFullId = row.receivables_id;
      this.showFullCrmType = "receivables";
      this.showFullDetail = true;
    },

    /**
     * 通过回调控制style
     */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 1) {
        return { color: "#005DF7" };
      } else {
        return "";
      }
    },

    /**
     * 新建回款和回款计划
     */
    createClick(type) {
      this.createActionInfo = {
        type: "relative",
        crmType: this.crmType,
        data: {}
      };
      if (type == "money") {
        if (this.crmType === "contract") {
          this.createActionInfo.data["customer"] = this.detail.customer_id_info;
          this.createActionInfo.data["contract"] = this.detail;
        } else if (this.crmType === "customer") {
          this.createActionInfo.data["customer"] = this.detail;
        }
        this.createCrmType = "receivables";
        this.isCreate = true;
      } else if (type == "plan") {
        if (this.crmType === "contract") {
          this.createActionInfo.data["customer"] = this.detail.customer_id_info;
          this.createActionInfo.data["contract"] = this.detail;
        } else if (this.crmType === "customer") {
          this.createActionInfo.data["customer"] = this.detail;
        }
        this.createCrmType = "receivables_plan";
        this.isCreate = true;
      }
    },

    /**
     * 新建成功
     */
    saveSuccess() {
      if (this.createCrmType == "receivables") {
        this.getList();
      } else {
        this.getPlanList();
      }
    },

    /**
     * 编辑操作
     */
    handleFile(type, item) {
      if (type == "edit") {
        this.createActionInfo = { type: "update", id: item.row.plan_id };
        this.createCrmType = "receivables_plan";
        this.isCreate = true;
      } else if (type == "delete") {
        this.$confirm("您確定要刪除嗎?", "提示", {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            crmReceivablesPlanDeleteAPI({
              id: item.row.plan_id
            })
              .then(res => {
                this.palnList.splice(item.$index, 1);
                this.$message.success(res.data);
              })
              .catch(() => {});
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
     * 格式化字段
     */
    fieldFormatter(row, column) {
      // 如果需要格式化
      if (column.property === "contract_id") {
        return row.contract_id_info.name;
      } else if (column.property === "customer_id") {
        return row.customer_id_info.name;
      } else if (column.property === "create_time") {
        return timestampToFormatTime(row.customer_id_info.create_time);
      } else if (column.property === "owner_user_id") {
        return row.owner_user_id_info.realname;
      }
      return row[column.property];
    },

    /**
     * 通过回调控制表头style
     */
    headerRowStyle({ row, column, rowIndex, columnIndex }) {
      return { textAlign: "center" };
    },

    /**
     * 通过回调控制style
     */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return { textAlign: "center" };
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../styles/relativecrm.scss";
.trading,
.courtesy {
  font-size: 16px;
  font-weight: bold;
}
// .trading-footer {

// }
.trading-footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 12px;
  // font-weight: bold;
  border-top: 0px solid #fff !important;
  .date-type {
    font-size: xx-small;
    font-weight: normal;
  }
}
.trading-footer > div {
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    text-align: center;
    margin-right: 10px;
  }
  .division {
    margin: 0 8px;
    font-weight: bold;
  }
}
.trading-footer > div,
.trading-footer > p {
  width: 170px;
  padding-left: 40px;
}
/deep/.el-collapse {
  border-right: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  .el-collapse-item {
    .el-collapse-item__header {
      padding-left: 10px;
    }
  }
}
</style>
