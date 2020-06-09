/** crm自定义列表 公共逻辑 */
import { mapGetters } from "vuex";
import CRMListHead from "../components/CRMListHead";
import CRMTableHead from "../components/CRMTableHead";
import FieldsSet from "../components/fieldsManager/FieldsSet";
import {
  filedGetField,
  crmFieldColumnWidth
} from "@/api/customermanagement/common";
import {
  crmLeadsIndex,
  crmLeadsExcelExport
} from "@/api/customermanagement/clue";
import {
  crmCustomerIndex,
  crmCustomerPool,
  crmCustomerExcelExport,
  crmCustomerPoolExcelExportAPI
} from "@/api/customermanagement/customer";
import {
  crmContactsIndex,
  crmContactsExcelExport
} from "@/api/customermanagement/contacts";
import { crmBusinessIndex } from "@/api/customermanagement/business";
import { crmContractIndex } from "@/api/customermanagement/contract";
import {
  crmProductIndex,
  crmProductExcelExport
} from "@/api/customermanagement/product";
import { crmReceivablesIndex } from "@/api/customermanagement/money";
import { getDateFromTimestamp } from "@/utils";
import moment from "moment";
// 客户信息：表格头部 静态数据
import { crmCustomerTableHeadList } from "../../../assets/data/customerInfo/crm-customer-table-headList";
// 新 API
import {
  adminListDetail,
  adminFieldGetField,
  crmCustomerDetailContact,
  crmCustomerDetailAnalysis
} from "@/api/new-api/common";
// 客户信息：表格内容 静态数据
import { crmCustomerTableContentList } from "../../../assets/data/customerInfo/crm-customer-table-contentList";
// 客户接触：表格头部 静态数据
import { crmCustomerContactTableHeadList } from "../../../assets/data/customerContact/crm-customer-contact-table-headList";
// 客户接触：表格内容 静态数据
import { crmCustomerContactContentList } from "../../../assets/data/customerContact/crm-customer-contact-table-contentList";
// 客户分析：表格头部 静态数据
import { analysisTableHeadList } from "../../../assets/data/customerAnalysis/table-head-list";
// 客户分析：表格内容 静态数据
import { analysisTableContentList } from "../../../assets/data/customerAnalysis/table-content-list";
// 購物紀錄：表格头部 静态数据
import { shoppingRecordTableHeadList } from "../../../assets/data/shoppingRecord/shopping-record-table-head-list";
// 購物紀錄：表格内容 静态数据
import { shoppingRecordTableContentList } from "../../../assets/data/shoppingRecord/shopping-record-table-content-list";

// 获取客户信息和客户分析静态数据的判断
const staticContentInfo = {
  customerInformation: crmCustomerTableContentList,
  customerAnalysis: analysisTableContentList,
  customerContact: crmCustomerContactContentList,
  shoppingRecord: shoppingRecordTableContentList
};

export default {
  components: {
    CRMListHead,
    CRMTableHead,
    FieldsSet
  },

  data() {
    return {
      url: "",
      resData: [], //客户分析字段
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 240, // 表的高度
      list: [],
      fieldList: [],
      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 45, 60],
      total: 0,
      search: "", // 搜索内容
      /** 控制详情展示 */
      rowID: "", // 行信息
      rowType: "", //详情类型
      showDview: false,
      /** 格式化规则 */
      formatterRules: {},
      /** 高级筛选 */
      filterObj: {}, // 筛选确定数据
      scene_id: "", // 场景筛选ID
      scene_name: "", // 场景名字
      /** 列表展示字段管理 */
      showFieldSet: false,
      /** 勾选行 */
      selectionList: [], // 勾选数据 用于全局导出
      nameList: ""
    };
  },

  computed: {
    ...mapGetters(["crm"])
  },

  mounted() {
    this.Bus.$on("CrmCustomer_Save", data => {
      this.getFieldList();
    });
    this.Bus.$on("crmCustomerDetailContact", data => {
      this.getList();
    });
    var self = this;
    /** 控制table的高度 */
    window.onresize = function() {
      var offsetHei = document.documentElement.clientHeight;
      var removeHeight = Object.keys(self.filterObj).length > 0 ? 310 : 240;
      self.tableHeight = offsetHei - removeHeight;
    };
    this.getFieldList();
    // if (this.crm[this.crmType].index) {
    //   if (this.isSeas) {
    //     this.getFieldList();
    //   } else {
    //     this.loading = true;
    //   }
    // }
  },

  methods: {
    addStaticData(addData) {
      this.list.push({
        ...addData,
        customer_id: this.list.length + 1
      });
    },
    deleteStaticData(deleteIds) {
      this.list = this.list.filter(listItem => {
        return !deleteIds.includes(listItem.customer_id);
      });
    },
    /** 获取列表数据 */
    getList() {
      this.loading = true;
      var params = {
        page: this.currentPage,
        limit: this.pageSize,
        search: this.search
      };
      for (var key in this.filterObj) {
        params[key] = this.filterObj[key];
      }
      if (this.hash === "customerAnalysis") {
        // 客户分析 列表展示接口
        crmCustomerDetailAnalysis(params)
          .then(res => {
            this.list = res.data.list;
            this.total = res.data.dataCount;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
        return false;
      }
      if (this.hash === "customerContact") {
        // 客户接触 列表展示接口
        crmCustomerDetailContact(params)
          .then(res => {
            this.list = res.data.list;
            this.total = res.data.dataCount;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
        return false;
      }
      if (this.hash !== "customerInformation") {
        // var crmIndexRequest = this.getIndexRequest();
        if (this.scene_id) {
          params.scene_id = this.scene_id;
        }
      }
      //这是表格的数据
      adminListDetail(params)
        .then(res => {
          if (this.crmType === "customer") {
            if (this.hash === "customerInformation") {
              this.list = res.data.list.map(element => {
                element.show = false;
                return element;
              });
            } else {
              this.list = staticContentInfo[this.hash].map(element => {
                element.show = false;
                return element;
              });
            }
          } else if (this.crmType === "contacts") {
            // 客户接触 table 内容展示
            this.list = crmCustomerContactContentList.map(element => {
              element.show = false;
              return element;
            });
          } else {
            if (this.crmType === "contract") {
              // 合同列表展示金额信息
              this.moneyData = res.data.data;
            }
            this.list = res.data.list;
          }

          this.total = res.data.dataCount;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /** 获取列表请求 */
    getIndexRequest() {
      if (this.crmType === "leads") {
        return crmLeadsIndex;
      } else if (this.crmType === "customer") {
        //客户表格
        // if (this.isSeas) {
        //   return crmCustomerPool;
        // } else {
        //   return crmCustomerIndex;
        // }
      } else if (this.crmType === "contacts") {
        //联系人表格
        return crmContactsIndex;
      } else if (this.crmType === "business") {
        return crmBusinessIndex;
      } else if (this.crmType === "contract") {
        return crmContractIndex;
      } else if (this.crmType === "product") {
        return crmProductIndex;
      } else if (this.crmType === "receivables") {
        return crmReceivablesIndex;
      }
    },
    // 客户接触: 左上角的 select 切换
    refreshList() {
      this.fieldList.length = 0;
      this.getFieldList();
    },
    // 获取客户信息和客户分析静态数据的判断
    getStaticData() {
      const staticInfo = {
        customerInformation: crmCustomerTableHeadList["crm_customer"],
        customerAnalysis: analysisTableHeadList,
        customerContact: crmCustomerContactTableHeadList,
        shoppingRecord: shoppingRecordTableHeadList
      };

      return staticInfo[this.hash];
    },
    /** 获取字段 */
    getFieldList() {
      if (this.fieldList.length == 0) {
        if (this.hash === "customerInformation") {
          window.determineWhetherToUseLocalInterface = false;
        } else if (this.hash === "customerContact") {
          // 客户接触
          this.loading = true;
          var params = {
            types: "crm_customer_contact_index",
            module: "crm",
            action: "index",
            controller: "customer"
          };
          adminFieldGetField(params)
            .then(res => {
              for (let index = 0; index < res.data.length; index++) {
                const element = res.data[index];
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
                    // 客户接触 没有 type crm
                    type: this.hash === "customerContact" ? "" : "crm",
                    formatter: fieldFormatter
                  };
                } else if (element.form_type === "user") {
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
                } else if (element.form_type === "structure") {
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
                  element.field === "contacts_id" ||
                  (element.field === "customer_id" &&
                    this.hash !== "customerContact") ||
                  element.field === "business_id" ||
                  element.field === "contract_id"
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
              //这里是初次请求的地方 --在这里吧face_id  放入查询条件里
              this.search = this.$store.state.user.faceID;
              this.getList();
              // this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
          return false;
        }
        if (window.determineWhetherToUseLocalInterface) {
          // 當進入到此 if 則掉的是 飛哥本地後台接口
          // 做判断是因为其他页面还需要做参考，如果有静态数据则用静态数据，就展示静态数据，如果没有，则使用接口数据；
          const headInfoShow = Object.is(this.crmType, "customer")
            ? this.getStaticData()
            : Object.is(this.crmType, "contacts")
            ? crmCustomerContactTableHeadList[this.isSubType]
            : "";
          for (let index = 0; index < headInfoShow.length; index++) {
            const element = headInfoShow[index];
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
            } else if (element.form_type === "user") {
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
            } else if (element.form_type === "structure") {
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
              element.field === "contacts_id" ||
              (element.field === "customer_id" &&
                this.hash !== "customerAnalysis") ||
              element.field === "business_id" ||
              element.field === "contract_id"
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
          //这里是初次请求的地方 --在这里吧face_id  放入查询条件里
          this.search = this.$store.state.user.faceID;
          this.getList();
          return false;
        }
        this.loading = true;
        var params = {
          types: "crm_" + this.crmType,
          module: "crm",
          action: this.isSeas ? "pool" : "index"
        };
        params.controller = this.crmType;
        if (this.hash === "customerInformation") {
          params.action = "index";
        }
        adminFieldGetField(params)
          .then(res => {
            // 做判断是因为其他页面还需要做参考，如果有静态数据则用静态数据，就展示静态数据，如果没有，则使用接口数据；
            let headInfoShow = [];
            if (this.hash === "customerInformation") {
              headInfoShow = res.data;
            } else {
              headInfoShow = Object.is(this.crmType, "customer")
                ? this.getStaticData()
                : Object.is(this.crmType, "contacts")
                ? crmCustomerContactTableHeadList[this.isSubType]
                : res.data;
            }
            for (let index = 0; index < headInfoShow.length; index++) {
              const element = headInfoShow[index];
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
              } else if (element.form_type === "user") {
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
              } else if (element.form_type === "structure") {
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
                element.field === "contacts_id" ||
                (element.field === "customer_id" &&
                  this.hash !== "customerAnalysis") ||
                element.field === "business_id" ||
                element.field === "contract_id"
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
            //这里是初次请求的地方 --在这里吧face_id  放入查询条件里
            this.search = this.$store.state.user.faceID;
            this.getList();
            // this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        // 获取好字段开始请求数据
        this.getList();
      }
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
    /** */
    /** */
    /** 搜索操作 */
    //这是搜索的内容
    crmSearch(value) {
      //这是输入的搜索内容
      this.search = value;
      if (this.fieldList.length) {
        this.getList();
      }
    },

    /** 列表操作 */
    // 当某一行被点击时会触发该事件
    handleRowClick(row, column, event) {
      // this.Bus.$emit("nameList_Id", row);
      this.Bus.$emit("transmitId", row);
      this.nameList = JSON.stringify(row);
      localStorage.setItem("nameList", this.nameList);
      localStorage.setItem("nameList", this.nameList);
      if (column.type === "selection") {
        return; // 多选布局不能点击
      }
      if (this.crmType === "leads") {
        if (column.property === "name") {
          this.rowID = row.leads_id;
          this.showDview = true;
        } else {
          this.showDview = false;
        }
      } else if (this.crmType === "customer") {
        if (column.property === "customer_id") {
          // 客户反馈 二级弹出展示以及当前行的 id 获取
          this.rowID = row.name; // 某些原因  name 改成 了当前行的 id
          this.rowType = "customerContact";
          this.showDview = true;
          return false;
        }
        if (column.property === "business-check" && row.business_count > 0) {
          return; // 列表查看商机不展示详情
        }
        if (column.property === "name") {
          this.rowID = row.customer_id;
          this.rowType = "customer";
          this.showDview = true;
        } else {
          this.showDview = false;
        }
      } else if (this.crmType === "contacts") {
        if (column.property === "customer_id") {
          this.rowID = row.customer_id_info.customer_id;
          this.rowType = "customer";
          this.showDview = true;
        } else if (column.property === "name") {
          this.rowID = row.contacts_id;
          this.rowType = "contacts";
          this.showDview = true;
        } else {
          this.showDview = false;
        }
      } else if (this.crmType === "business") {
        if (column.property === "customer_id") {
          this.rowID = row.customer_id_info.customer_id;
          this.rowType = "customer";
          this.showDview = true;
        } else if (column.property === "name") {
          this.rowID = row.business_id;
          this.rowType = "business";
          this.showDview = true;
        } else {
          this.showDview = false;
        }
      } else if (this.crmType === "contract") {
        if (column.property === "customer_id") {
          this.rowID = row.customer_id_info.customer_id;
          this.rowType = "customer";
          this.showDview = true;
        } else if (column.property === "business_id") {
          this.rowID = row.business_id_info.business_id;
          this.rowType = "business";
          this.showDview = true;
        } else if (column.property === "contacts_id") {
          this.rowID = row.contacts_id_info.contacts_id;
          this.rowType = "contacts";
          this.showDview = true;
        } else if (column.property === "num") {
          this.rowID = row.contract_id;
          this.rowType = "contract";
          this.showDview = true;
        } else {
          this.showDview = false;
        }
      } else if (this.crmType === "product") {
        if (column.property === "name") {
          this.rowID = row.product_id;
          this.showDview = true;
        } else {
          this.showDview = false;
        }
      } else if (this.crmType === "receivables") {
        if (column.property === "customer_id") {
          this.rowID = row.customer_id_info.customer_id;
          this.rowType = "customer";
          this.showDview = true;
        } else if (column.property === "contract_id") {
          this.rowID = row.contract_id;
          this.rowType = "contract";
          this.showDview = true;
        } else if (column.property === "number") {
          this.rowID = row.receivables_id;
          this.rowType = "receivables";
          this.showDview = true;
        } else {
          this.showDview = false;
        }
      }
    },
    /**
     * 导出 线索 客户 联系人 产品
     * @param {*} data
     */
    // 导出操作
    exportInfos() {
      var params = {
        search: this.search
      };
      if (this.scene_id) {
        params.scene_id = this.scene_id;
      }
      for (var key in this.filterObj) {
        params[key] = this.filterObj[key];
      }

      let request;
      // 公海的请求
      if (this.isSeas) {
        request = crmCustomerPoolExcelExportAPI;
      } else {
        request = {
          customer: crmCustomerExcelExport,
          leads: crmLeadsExcelExport,
          contacts: crmContactsExcelExport,
          product: crmProductExcelExport
        }[this.crmType];
      }
      request(params)
        .then(res => {
          var blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download =
            decodeURI(
              res.headers["content-disposition"].split("filename=")[1]
            ) || ""; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch(() => {});
    },
    /** 筛选操作 */
    handleFilter(data) {
      this.filterObj = data;
      var offsetHei = document.documentElement.clientHeight;
      var removeHeight = Object.keys(this.filterObj).length > 0 ? 310 : 240;
      this.tableHeight = offsetHei - removeHeight;
      this.currentPage = 1;
      this.getList();
    },
    /** 场景操作 */
    handleScene(data) {
      this.scene_id = data.id;
      this.scene_name = data.name;
      this.currentPage = 1;
      this.getFieldList();
    },
    /** 勾选操作 */
    handleHandle(data) {
      if (
        data.type === "alloc" ||
        data.type === "get" ||
        data.type === "transfer" ||
        data.type === "transform" ||
        data.type === "delete"
      ) {
        this.showDview = false;
      }
      this.getList();
    },
    /** 自定义字段管理 */
    setSave() {
      this.fieldList = [];
      this.getFieldList();
    },
    /** */
    /** 页面头部操作 */
    listHeadHandle(data) {
      if (data.type === "save-success") {
        // 重新请求第一页数据
        this.currentPage = 1;
        this.getList();
      }
    },
    // 设置点击
    handleTableSet() {
      this.showFieldSet = true;
    },
    /** 勾选操作 */
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.selectionList = val; // 勾选的行
      this.$refs.crmTableHead.headSelectionChange(val);
    },
    // 当拖动表头改变了列的宽度的时候会触发该事件
    handleHeaderDragend(newWidth, oldWidth, column, event) {
      if (column.property) {
        const crmType = this.isSeas ? this.crmType + "_pool" : this.crmType;
        crmFieldColumnWidth({
          types: "crm_" + crmType,
          field: column.property,
          width: newWidth
        })
          .then(res => {
            this.$message({
              type: "success",
              message: res.data
            });
          })
          .catch(() => {});
      }
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

  beforeDestroy() {}
};
