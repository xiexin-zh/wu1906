/** crm自定义列表 公共逻辑 */
import { filedGetField } from "@/api/customermanagement/common";
// import {
//   crmMessageCheckContractAPI,
//   crmMessageCheckReceivablesAPI,
//   crmMessageTodayCustomerAPI,
//   crmMessageFollowLeadsAPI,
//   crmMessageFollowCustomerAPI,
//   crmMessagEndContractAPI,
//   crmMessagRemindreceivablesplanAPI
// } from "@/api/customermanagement/message";
// 新 api
import {
  newComplaintList,
  newDemandList
  // newOpinionList
} from "@/api/new-api/message";
import { getDateFromTimestamp } from "@/utils";
import moment from "moment";

// import { customerFeedbackTableHeadList } from "../../../../assets/data/customerLeedback/customer-feedback-table-headList";
// import { customerFeedbackTableContentMap } from "../../../../assets/data/customerLeedback/customer-feedback-table-content-list";

export default {
  components: {},
  data() {
    return {
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 300, // 表的高度
      list: [],
      fieldList: [],
      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 45, 60],
      total: 0,

      /** 格式化规则 */
      formatterRules: {}
    };
  },

  mounted() {
    this.$bus.on("message-scroll", tableHeight => {
      this.tableHeight = tableHeight;
    });
  },

  beforeDestroy() {
    this.$bus.off("message-scroll");
  },

  methods: {
    /**
     * 当某一行被点击时会触发该事件
     * @param {*} row
     * @param {*} column
     * @param {*} event
     */
    handleRowClick(row, column, event) {
      if (this.crmType === "leads") {
        this.rowID = row.leads_id;
        this.rowType = "leads";
        this.showDview = true;
      } else if (this.crmType === "customer") {
        this.rowID = row.customer_id;
        this.rowType = "customer";
        this.showDview = true;
      } else if (this.crmType === "contacts") {
        if (column.property === "customer_id") {
          this.rowID = row.customer_id_info.customer_id;
          this.rowType = "customer";
        } else {
          this.rowID = row.contacts_id;
          this.rowType = "contacts";
        }
        this.showDview = true;
      } else if (this.crmType === "business") {
        if (column.property === "customer_id") {
          this.rowID = row.customer_id_info.customer_id;
          this.rowType = "customer";
        } else {
          this.rowID = row.business_id;
          this.rowType = "business";
        }
        this.showDview = true;
      } else if (this.crmType === "contract") {
        if (column.property === "customer_id") {
          this.rowID = row.customer_id_info.customer_id;
          this.rowType = "customer";
        } else if (column.property === "business_id") {
          this.rowID = row.business_id_info.business_id;
          this.rowType = "business";
        } else if (column.property === "contacts_id") {
          this.rowID = row.contacts_id_info.contacts_id;
          this.rowType = "contacts";
        } else {
          this.rowID = row.contract_id;
          this.rowType = "contract";
        }
        this.showDview = true;
      } else if (this.crmType === "product") {
        this.rowID = row.product_id;
        this.showDview = true;
      } else if (this.crmType === "receivables") {
        if (column.property === "customer_id") {
          this.rowID = row.customer_id_info.customer_id;
          this.rowType = "customer";
        } else if (column.property === "contract_id") {
          this.rowID = row.contract_id;
          this.rowType = "contract";
        } else {
          this.rowID = row.receivables_id;
          this.rowType = "receivables";
        }
        this.showDview = true;
      } else if (this.crmType === "receivables_plan") {
        if (column.property === "customer_id") {
          this.rowID = row.customer_id_info.customer_id;
          this.rowType = "customer";
          this.showDview = true;
        } else if (column.property === "contract_id") {
          this.rowID = row.contract_id;
          this.rowType = "contract";
          this.showDview = true;
        }
      }
    },

    /** 获取列表数据 */
    getList() {
      this.loading = true;
      var crmIndexRequest = this.getIndexRequest();
      let params = {
        page: this.currentPage,
        limit: this.pageSize,
        customer_id: "", // 传空返回所有信息
        status: this.isSubType, // 0 是未处理 1 是已处理
        start_time: 0,
        end_time: 0
      };
      // 意见/需求改为同一个接口 type 区分 1是意见 2是需求
      if (this.infoType === "followLeads") {
        // 需求
        params.type = 2;
      } else if (this.infoType === "followCustomer") {
        // 意见
        params.type = 1;
      }
      for (var key in this.filterObj.obj) {
        params[key] = this.filterObj.obj[key];
      }
      crmIndexRequest(params)
        .then(res => {
          this.list = res.data.list;
          this.total = res.data.dataCount;

          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /** 获取列表请求 */
    getIndexRequest() {
      return {
        todayCustomer: newComplaintList,
        followLeads: newDemandList,
        followCustomer: newDemandList
      }[this.infoType];
    },

    /** 获取字段 */
    getFieldList() {
      this.loading = true;
      filedGetField({
        types: "crm_" + this.crmType,
        module: "crm",
        controller: "customer",
        action: "index"
      })
        .then(res => {
          this.loading = false;
          this.handelFieldList(res.data);
        })
        .catch(() => {
          this.loading = false;
        });
    },

    handelFieldList(list) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        /** 获取需要格式化的字段 和格式化的规则 */
        if (element.form_type === "date") {
          function fieldFormatter(time) {
            if (time == "0000-00-00") {
              time = "";
            }
            return time;
          }
          this.formatterRules[element.field] = {
            formatter: fieldFormatter
          };
        } else if (element.form_type === "datetime") {
          function fieldFormatter(time) {
            if (time == 0 || !time) {
              return "";
            }
            return moment(getDateFromTimestamp(time)).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          this.formatterRules[element.field] = {
            formatter: fieldFormatter
          };
        } else if (
          element.field === "create_user_id" ||
          element.field === "owner_user_id"
        ) {
          function fieldFormatter(info) {
            return info ? info.realname : "";
          }
          this.formatterRules[element.field] = {
            type: "crm",
            formatter: fieldFormatter
          };
        } else if (
          element.form_type === "user" &&
          !["todayCustomer", "followLeads", "followCustomer"].includes(
            this.infoType
          )
        ) {
          function fieldFormatter(info) {
            if (info) {
              var content = "";
              for (let index = 0; index < info.length; index++) {
                const element = info[index];
                content =
                  content +
                  element.realname +
                  (index === info.length - 1 ? "" : ",");
              }
              return content;
            }
            return "";
          }
          this.formatterRules[element.field] = {
            type: "crm",
            formatter: fieldFormatter
          };
        } else if (
          element.form_type === "structure" &&
          !["todayCustomer", "followLeads", "followCustomer"].includes(
            this.infoType
          )
        ) {
          function fieldFormatter(info) {
            if (info) {
              var content = "";
              for (let index = 0; index < info.length; index++) {
                const element = info[index];
                content =
                  content +
                  element.name +
                  (index === info.length - 1 ? "" : ",");
              }
              return content;
            }
            return "";
          }
          this.formatterRules[element.field] = {
            type: "crm",
            formatter: fieldFormatter
          };
          /** 联系人 客户 商机 合同*/
        } else if (
          !["todayCustomer", "followLeads", "followCustomer"].includes(
            this.infoType
          ) &&
          (element.field === "contacts_id" ||
            element.field === "customer_id" ||
            element.field === "business_id" ||
            element.field === "contract_id")
        ) {
          function fieldFormatter(info) {
            return info ? info.name : "";
          }
          this.formatterRules[element.field] = {
            type: "crm",
            formatter: fieldFormatter
          };
        } else if (
          element.field === "status_id" ||
          element.field === "type_id" ||
          element.field === "category_id"
        ) {
          function fieldFormatter(info) {
            return info ? info : "";
          }
          this.formatterRules[element.field] = {
            type: "crm",
            formatter: fieldFormatter
          };
        } else if (element.field === "receive_employee_id") {
          // 客戶反饋---投訴---接收投訴員工
          function fieldFormatter(info) {
            return info ? info.realname : "";
          }
          this.formatterRules[element.field] = {
            formatter: fieldFormatter
          };
        } else if (element.field === "receive_department_id") {
          // 客戶反饋---投訴---接收投訴部門
          function fieldFormatter(info) {
            return info ? info.name : "";
          }
          this.formatterRules[element.field] = {
            formatter: fieldFormatter
          };
        } else if (
          element.field === "complained_employee_id" ||
          element.field === "follow_member_id"
        ) {
          // 客戶反饋---投訴---被投訴的員工
          function fieldFormatter(info) {
            return info ? info.realname : "";
          }
          this.formatterRules[element.field] = {
            formatter: fieldFormatter
          };
        } else if (
          element.field === "complained_department_id" ||
          element.field === "department_id"
        ) {
          // 客戶反饋---投訴---被投訴的部門
          function fieldFormatter(info) {
            return info ? info.name : "";
          }
          this.formatterRules[element.field] = {
            formatter: fieldFormatter
          };
        }

        var width = 0;
        if (!element.width) {
          if (element.name && element.name.length <= 6) {
            width = element.name.length * 15 + 45;
          } else {
            width = 140;
          }
        } else {
          width = element.width;
        }
        this.fieldList.push({
          prop: element.field,
          label: element.name,
          width: width
        });
      }

      // 获取好字段开始请求数据
      this.getList();
    },

    /** 格式化字段 */
    fieldFormatter(row, column) {
      // 如果需要格式化
      var aRules = this.formatterRules[column.property];
      if (aRules) {
        if (aRules.type === "crm") {
          if (column.property) {
            return aRules.formatter(row[column.property + "_info"]) || "--";
          } else {
            return "";
          }
        } else {
          return aRules.formatter(row[column.property]) || "--";
        }
      }
      return row[column.property] || "--";
    },

    // 更改每页展示数量
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },

    // 更改当前页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },

    // 0待审核、1审核中、2审核通过、3审核未通过
    getStatusStyle(status) {
      if (status == 0) {
        return {
          "border-color": "#E6A23C",
          "background-color": "#FDF6EC",
          color: "#E6A23C"
        };
      } else if (status == 1) {
        return {
          "border-color": "#409EFF",
          "background-color": "#ECF5FF",
          color: "#409EFF"
        };
      } else if (status == 2) {
        return {
          "border-color": "#67C23A",
          "background-color": "#F0F9EB",
          color: "#67C23A"
        };
      } else if (status == 3) {
        return {
          "border-color": "#F56C6B",
          "background-color": "#FEF0F0",
          color: "#F56C6B"
        };
      } else if (status == 4) {
        return {
          "background-color": "#FFFFFF"
        };
      }
    }
  },

  beforeDestroy() {
    if (document.getElementById("crm-table")) {
      document.getElementById("crm-table").removeEventListener("click", e => {
        e.stopPropagation();
      });
    }
  }
};
