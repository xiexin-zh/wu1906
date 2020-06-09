<template>
  <create-view :loading="loading" :body-style="{ height: '100%' }">
    <flexbox direction="column" align="stretch" class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;">{{ title }}</div>
        <img
          @click="hidenView"
          class="close"
          src="@/assets/img/task_close.png"
        />
      </flexbox>
      <div class="crm-create-flex">
        <create-sections title="基本信息">
          <flexbox direction="column" align="stretch">
            <div class="crm-create-body">
              <el-form
                ref="crmForm"
                :model="crmForm"
                label-position="top"
                class="crm-create-box"
              >
                <el-form-item
                  v-for="(item, index) in crmForm.crmFields"
                  :key="item.key"
                  :prop="'crmFields.' + index + '.value'"
                  :class="{
                    'crm-create-block-item': item.showblock,
                    'crm-create-item': !item.showblock
                  }"
                  :rules="
                    item.name == '上市公司' && rulesFlag == false
                      ? {}
                      : crmRules[item.key]
                  "
                  :show-message="rulesFlag"
                  :style="{
                    'padding-left': getPaddingLeft(item, index),
                    'padding-right': getPaddingRight(item, index)
                  }"
                >
                  <div
                    slot="label"
                    style="display: flex;width: 100%; justifyContent: space-between;"
                  >
                    <div
                      style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;"
                    >
                      {{ item.data.name }}
                      <span
                        style="color:#999;"
                        v-if="
                          item.data.input_tips && item.data.input_tips !== '萬'
                        "
                        >{{ "（" + item.data.input_tips + "）" }}</span
                      >
                    </div>
                    <UnitComponent
                      v-if="
                        item.data.input_tips && item.data.input_tips === '萬'
                      "
                      style="color:#999;"
                    />
                  </div>
                  <!-- 员工 和部门 为多选（radio=false）  relation 相关合同商机使用-->
                  <component
                    :is="item.data.form_type | typeToComponentName"
                    :value="item.value"
                    :index="index"
                    :item="item"
                    :relation="item.relation"
                    :radio="false"
                    :disabled="item.disabled"
                    @value-change="fieldValueChange"
                  ></component>
                </el-form-item>
              </el-form>
            </div>
          </flexbox>
        </create-sections>
        <create-sections v-if="showExamine" title="審核信息">
          <div
            slot="header"
            v-if="examineInfo.config === 1 || examineInfo.config === 0"
            class="examine-type"
          >
            {{ examineInfo.config === 1 ? "固定審批流" : "授權審批人" }}
          </div>
          <create-examine-info
            ref="examineInfo"
            :types="'crm_' + crmType"
            :types_id="action.id"
            @value-change="examineValueChange"
          ></create-examine-info>
        </create-sections>
      </div>

      <div class="handle-bar">
        <el-button class="handle-button" @click.native="hidenView"
          >取消</el-button
        >
        <el-button
          v-if="hideSaveAndNewBtn"
          class="handle-button"
          type="primary"
          style="background: #005DF7"
          @click.native="saveField(true)"
          >保存並新建自然人</el-button
        >
        <el-button
          class="handle-button"
          type="primary"
          style="background: #005DF7"
          @click.native="saveField(false)"
          >保存</el-button
        >
      </div>
    </flexbox>
  </create-view>
</template>
<script type="text/javascript">
import { Message } from "element-ui";
import CreateView from "@/components/CreateView";
import CreateSections from "@/components/CreateSections";
import CreateExamineInfo from "@/components/Examine/CreateExamineInfo";
import { filedGetField, filedValidates } from "@/api/customermanagement/common";
import { crmLeadsSave, crmLeadsUpdate } from "@/api/customermanagement/clue";
import {
  crmCustomerSave,
  crmCustomerUpdate
} from "@/api/customermanagement/customer";
import {
  crmContactsSave,
  crmContactsUpdate
} from "@/api/customermanagement/contacts";
import {
  crmBusinessSave,
  crmBusinessUpdate,
  crmBusinessProduct // 商机下产品
} from "@/api/customermanagement/business";
import {
  crmContractSave,
  crmContractUpdate
} from "@/api/customermanagement/contract";
import {
  crmProductSave,
  crmProductUpdate
} from "@/api/customermanagement/product";
import {
  crmReceivablesSave,
  crmReceivablesUpdate
} from "@/api/customermanagement/money";
import {
  crmReceivablesPlanSave,
  crmReceivablesPlanUpdate
} from "@/api/customermanagement/contract";
// 新 api
import {
  adminFieldGetField,
  CrmCustomer_Save,
  crmCustomerDetailSave,
  crmCustomerDetailUpdate
} from "@/api/new-api/common";
import {
  newComplaintSave, // 投诉创建保存
  newDemandSave // 意见需求创建保存
} from "@/api/new-api/message";
import {
  regexIsNumber,
  regexIsCRMNumber,
  regexIsCRMMoneyNumber,
  regexIsCRMMobile,
  regexIsCRMEmail,
  formatTimeToTimestamp,
  timestampToFormatTime,
  getDateFromTimestamp
} from "@/utils";

import {
  XhInputColor,
  XhInput,
  XhTextarea,
  XhSelect,
  XhMultipleSelect,
  XhDate,
  XhDateTime,
  XhUserCell,
  XhStructureCell,
  XhFiles,
  CrmRelativeCell,
  XhProuctCate,
  XhProduct,
  XhBusinessStatus,
  XhCustomerAddress,
  XhReceivablesPlan, // 回款计划期数
  XhUploadImg, // 上傳頭像
  XhSelectAndInput // 下拉選擇後帶inpuit
} from "@/components/CreateCom";

// 新增客户接触/客户约见 表格数据
import {
  contactsCreateTitle,
  crmCustomerContactTableHeadList
} from "../../../assets/data/customerContact/crm-customer-contact-table-headList";
// 新增客户信息  表格数据
import { crmCustomerTableHeadList } from "../../../assets/data/customerInfo/crm-customer-table-headList";
// 新增反馈 投诉/需求/意见 新增内容替换
import {
  contactsCreateTitleFeedback
  // customerFeedbackTableHeadList
} from "../../../assets/data/customerLeedback/customer-feedback-table-headList";
// 客户分析
import { analysisTableHeadList } from "../../../assets/data/customerAnalysis/table-head-list";
import { newBgList } from "../../../assets/data/newCustomerBackground/newBgList";
// 萬字單位組件
import UnitComponent from "../../../components/UnitComponent";
import {
  scheduleList,
  scheduleAdd,
  scheduleEdit
} from "@/api/oamanagement/schedule";
export default {
  name: "crm-create-view", // 所有新建效果的view
  components: {
    UnitComponent,
    CreateView,
    CreateSections,
    CreateExamineInfo, // 审核信息
    XhInputColor,
    XhInput,
    XhTextarea,
    XhSelect,
    XhMultipleSelect,
    XhDate,
    XhDateTime,
    XhUserCell,
    XhStructureCell,
    XhFiles,
    CrmRelativeCell,
    XhProuctCate,
    XhProduct,
    XhBusinessStatus,
    XhCustomerAddress,
    XhReceivablesPlan,
    XhUploadImg, // 上傳頭像
    XhSelectAndInput
  },
  computed: {
    hideSaveAndNewBtn() {
      return (
        this.crmType == "customer" &&
        this.action.type == "save" &&
        this.crmType === "contacts"
      );
    },
    /** 合同 回款 下展示审批人信息 */
    showExamine() {
      if (this.crmType === "contract" || this.crmType === "receivables") {
        return true;
      }
      return false;
    }
  },
  watch: {
    crmType: function(value) {
      this.title = this.getTitle();
      this.crmRules = {};
      this.crmForm = {
        crmFields: []
      };
      this.examineInfo = {};
      this.getField();
    },
    typeList: function(newVal, oldVal) {
      console.log(oldVal);
      this.oldTypeList = oldVal;
      if (this.action.action == "update") {
        if (oldVal !== "") {
          this.getField();
        }
      } else {
        this.getField();
      }
    },
    colorData: function(val) {},
    CRMcustomerId_id: function(newVal, oldVal) {
      console.log(newVal);
      if (newVal !== "") {
        this.CRMcustomerIdClick();
      }
    }
  },
  data() {
    return {
      isNumberList: "",
      CRMcustomerId_id: "",
      CRMcustomerId: {},
      typeListTpye: "",
      dialogImageUrl: "",
      blurClickFlag: false,
      constData: [],
      colorData: {
        id: 117
      },
      oldTypeList: "",
      typeList: "",
      rulesFlag: true,
      customerInformationList: [], //接口字段数据
      flag: false,
      // 标题展示名称
      title: "",
      loading: false,
      saveAndCreate: false, // 保存并新建
      // 自定义字段验证规则
      crmRules: {},
      // 自定义字段信息表单
      crmForm: {
        crmFields: []
      },
      // 审批信息
      examineInfo: {},
      nameList: {}
    };
  },
  filters: {
    /** 根据type 找到组件 */
    typeToComponentName(form_type) {
      if (
        form_type == "text" ||
        form_type == "number" ||
        form_type == "floatnumber" ||
        form_type == "mobile" ||
        form_type == "email"
      ) {
        return "XhInput";
      } else if (form_type == "XhInputColor") {
        return "XhInputColor";
      } else if (form_type == "textarea") {
        return "XhTextarea";
      } else if (form_type == "select" || form_type == "business_status") {
        return "XhSelect";
      } else if (form_type == "selectAndInput") {
        return "XhSelectAndInput";
      } else if (form_type == "checkbox") {
        return "XhMultipleSelect";
      } else if (form_type == "date") {
        return "XhDate";
      } else if (form_type == "datetime") {
        return "XhDateTime";
      } else if (form_type == "user") {
        return "XhUserCell";
      } else if (form_type == "structure") {
        return "XhStructureCell";
      } else if (form_type == "file") {
        return "XhFiles";
      } else if (
        form_type == "contacts" ||
        form_type == "customer" ||
        form_type == "contract" ||
        form_type == "business"
      ) {
        return "CrmRelativeCell";
      } else if (form_type == "category") {
        // 产品类别
        return "XhProuctCate";
      } else if (form_type == "business_type") {
        // 商机类别
        return "XhBusinessStatus";
      } else if (form_type == "product") {
        return "XhProduct";
      } else if (form_type == "map_address") {
        return "XhCustomerAddress";
      } else if (form_type == "receivables_plan") {
        return "XhReceivablesPlan";
      } else if (form_type === "upload_img") {
        return "XhUploadImg";
      }
    }
  },
  props: {
    editBtn: {
      type: Object
    },
    crmFormList: {
      type: Object
    },
    titleList: {
      type: String,
      default: ""
    },
    currentHash: {
      type: String,
      default: ""
    },
    // CRM类型
    crmType: {
      type: String,
      default: ""
    },
    createSubType: {
      type: String,
      default: ""
    },
    /**
     * save:添加、update:编辑(action_id)、read:详情、index:列表
     * relative: 相关 添加(目前用于客户等相关添加)
     */
    action: {
      type: Object,
      default: () => {
        return {
          type: "save",
          id: ""
        };
      }
    },
    // 日程修改数据
    formData: {
      type: Object
    }
  },
  mounted() {
    this.Bus.$on("CRMcustomerId", data => {
      this.CRMcustomerId = data;
      this.CRMcustomerId_id = data.value;
    });
    this.Bus.$on("ImageUrl", data => {
      this.dialogImageUrl = data;
    });
    this.Bus.$on("blurClickFlag", data => {
      this.blurClickFlag = data;
    });
    this.Bus.$on("colorData", data => {
      this.colorData = data;
    });
    this.Bus.$on("Appointment", data => {
      this.typeList = data.value;
      this.typeListTpye = data.categoryValue;
    });
    this.Bus.$on("flagRules", data => {
      this.rulesFlag = data;
    });
    this.nameList = JSON.parse(localStorage.getItem("nameList"));
    // 获取title展示名称
    if (window.document.location.hash === "#/crm/customerContact") {
      // 客户接触
      this.title = this.titleList;
      this.getField();
    } else if (window.document.location.hash === "#/crm/customerInformation") {
      if (
        this.titleList == "新增過往經驗" ||
        this.titleList == "新增客戶背景" ||
        this.titleList == "新增購物" ||
        this.titleList == "新增日程" ||
        this.titleList == "編輯客戶背景" ||
        this.titleList == "編輯過往經驗" ||
        this.titleList == "編輯日程"
      ) {
        this.title = this.titleList;
      } else {
        this.title = "新建客戶";
      }
      this.getField();
    } else {
      document.body.appendChild(this.$el);
      this.title = this.getTitle();
      this.getField();
    }
  },
  methods: {
    // 客户接触新增切换
    CRMcustomerIdClick() {
      let params = {};
      const {
        type,
        data: { category }
      } = this.action;
      if (this.CRMcustomerId.id == "") {
        params.types = "crm_customer_travel";
      } else {
        params.types = category;
      }
      params.module = "crm";
      params.controller = "customer_detail";
      params.action = "save";
      params.customer_id = this.CRMcustomerId.value;
      adminFieldGetField(params)
        .then(res => {
          res.data.splice(1, 1);
          this.getcrmRulesAndModel(res.data);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
      return false;
    },
    // 审批信息值更新
    examineValueChange(data) {
      this.examineInfo = data;
    },
    // 字段的值更新
    fieldValueChange(data) {
      var item = this.crmForm.crmFields[data.index];
      item.value = data.value;
      // item.value = this.crmFormList;
      //商机下处理商机状态
      if (
        this.crmType == "business" &&
        item.data.form_type == "business_type"
      ) {
        //找到阶段数据
        for (
          let statusIndex = 0;
          statusIndex < this.crmForm.crmFields.length;
          statusIndex++
        ) {
          const statusElement = this.crmForm.crmFields[statusIndex];
          if (statusElement.data.form_type == "business_status") {
            for (let typeIndex = 0; typeIndex < data.data.length; typeIndex++) {
              const typeElement = data.data[typeIndex];
              if (typeElement.type_id == data.value) {
                statusElement.data.setting = typeElement.statusList.map(
                  function(item, index) {
                    item["value"] = item.status_id;
                    return item;
                  }
                );
                statusElement.value = "";
                this.$set(this.crmForm.crmFields, statusIndex, statusElement);
                break;
              }
            }
          }
        }
      } else if (this.crmType == "contract") {
        if (item.data.form_type == "customer") {
          // 新建合同 选择客户 要将id交于 商机
          for (let index = 0; index < this.crmForm.crmFields.length; index++) {
            const element = this.crmForm.crmFields[index];
            if (element.key === "business_id") {
              // 如果是商机 改变商机样式和传入客户ID
              if (item.value.length > 0) {
                element.disabled = false;
                var customerItem = item.value[0];
                customerItem["form_type"] = "customer";
                element["relation"] = customerItem;
              } else {
                element.disabled = true;
                element["relation"] = {};
                element.value = [];
              }
              break;
            }
          }
        } else if (item.data.form_type == "business") {
          if (item.value.length > 0) {
            crmBusinessProduct({
              business_id: item.value[0].business_id
            })
              .then(res => {
                for (
                  let index = 0;
                  index < this.crmForm.crmFields.length;
                  index++
                ) {
                  const element = this.crmForm.crmFields[index];
                  if (element.key === "product") {
                    element["value"] = {
                      product: res.data.list,
                      total_price: res.data.total_price,
                      discount_rate: res.data.discount_rate
                    };
                    break;
                  }
                }
              })
              .catch(() => {});
          }
        }
      } else if (this.crmType == "receivables") {
        // 新建回款 选择客户 要将id交于 合同
        if (item.data.form_type == "customer") {
          var planItem = null; // 合同更改 重置回款计划
          for (let index = 0; index < this.crmForm.crmFields.length; index++) {
            const element = this.crmForm.crmFields[index];
            if (element.key === "contract_id") {
              // 如果是合同 改变合同样式和传入客户ID
              if (item.value.length > 0) {
                element.disabled = false;
                var customerItem = item.value[0];
                customerItem["form_type"] = "customer";
                customerItem["params"] = { check_status: 2 };
                element["relation"] = customerItem;
              } else {
                element.disabled = true;
                element["relation"] = {};
                element.value = [];
              }
            } else if (element.key === "plan_id") {
              planItem = element;
            }
          }
          if (planItem) {
            planItem.disabled = true;
            planItem["relation"] = {};
            planItem.value = "";
          }
        } else if (item.data.form_type == "contract") {
          for (let index = 0; index < this.crmForm.crmFields.length; index++) {
            const element = this.crmForm.crmFields[index];
            if (element.key === "plan_id") {
              // 如果是回款 改变回款样式和传入客户ID
              if (item.value.length > 0) {
                element.disabled = false;
                var contractItem = item.value[0];
                contractItem["form_type"] = "contract";
                element["relation"] = contractItem;
              } else {
                element.disabled = true;
                element["relation"] = {};
                element.value = "";
              }
              break;
            }
          }
        }
      }

      //无事件的处理 后期可换成input实现
      if (
        item.data.form_type == "user" ||
        item.data.form_type == "structure" ||
        item.data.form_type == "file" ||
        item.data.form_type == "category" ||
        item.data.form_type == "customer" ||
        item.data.form_type == "business" ||
        item.data.form_type == "contract"
      ) {
        this.$refs.crmForm.validateField("crmFields." + data.index + ".value");
      }
    },
    // 获取客户信息和客户分析静态数据的判断
    getStaticData() {
      const staticInfo = {
        // customerInformation: crmCustomerTableHeadList["crm_customer"],
        customerAnalysis: analysisTableHeadList,
        // customerContact: crmCustomerTableHeadList[this.titleData],
        // crm_customerInformation: crmCustomerTableHeadList["crmCustomer"],
        crm_customer_background: newBgList
      };

      return staticInfo[this.currentHash];
    },

    // 获取自定义字段
    getField() {
      const getFieldType = [
        "crm_customer",
        "crm_customer_background",
        "crm_customer_experience",
        "crm_customer_credit",
        "crm_customer_shop",
        "crm_customer_travel",
        "crm_customer_travel_admission"
      ];
      // 客户反馈中 投诉/需求/意见 新增时获取的 getField
      const feedbackNewGetFieldTypes = ["demand", "opinion", "complaint"];
      if (this.currentHash === "customerInformation") {
        window.determineWhetherToUseLocalInterface = false;
      } else if (feedbackNewGetFieldTypes.includes(this.currentHash)) {
        // 客户反馈
        this.loading = true;
        // 获取自定义字段的更新时间
        var params = {};
        params.types = "crm_" + this.createSubType;
        params.module = "crm";
        params.controller = this.createSubType;
        params.action = this.action.type;
        adminFieldGetField(params)
          .then(res => {
            this.getcrmRulesAndModel(res.data);
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
        return false;
      } else if (this.currentHash === "customerContact") {
        const {
          type,
          data: { category }
        } = this.action;
        // 客户反馈----新增不同类型
        this.loading = true;
        // 获取自定义字段的更新时间
        var params = {};
        if (this.typeList == "") {
          params.types = "crm_customer_travel";
        } else {
          params.types = this.typeListTpye;
        }
        params.module = "crm";
        params.controller = "customer_detail";
        params.action = "save";
        adminFieldGetField(params).then(res => {
          const { data } = res;
          this.getcrmRulesAndModel(data);
          this.loading = false;
        });
      }

      if (!window.determineWhetherToUseLocalInterface) {
        if (getFieldType.includes(this.currentHash)) {
          this.loading = true;
          // 获取自定义字段的更新时间
          var params = {};
          params.types = this.currentHash;
          params.module = "crm";
          params.controller = "customer_detail";
          params.action = this.action.type;
          params.customer_id = this.action.currentItem.customer_id;
          // 进行编辑操作
          if (this.action.type == "update") {
            params.action_id = this.action.currentItem.id;
          }
          adminFieldGetField(params)
            .then(res => {
              if (this.currentHash === "crm_customer_background") {
                if (this.action.type == "update") {
                  let listDataA = res.data[8].setting;
                  let listDataB = res.data[14].setting;
                  let listDataAValue = res.data[8].value;
                  let listDataBValue = res.data[14].value;
                  let listDataC = res.data[9].value;
                  let listDataD = res.data[15].value;
                  listDataA = JSON.stringify(listDataA);
                  listDataB = JSON.stringify(listDataB);
                  listDataC = JSON.stringify(listDataC);
                  listDataD = JSON.stringify(listDataD);
                  localStorage.setItem("settingA", listDataA);
                  localStorage.setItem("settingB", listDataB);
                  localStorage.setItem("settingC", listDataC);
                  localStorage.setItem("settingD", listDataD);
                  localStorage.setItem("settingAValue", listDataAValue);
                  localStorage.setItem("settingBValue", listDataBValue);
                  res.data.splice(9, 1);
                  res.data.splice(14, 1);
                } else {
                  res.data.splice(9, 1);
                  res.data.splice(14, 1);
                  let listDataA = res.data[8].setting;
                  let listDataB = res.data[13].setting;
                  listDataA = JSON.stringify(listDataA);
                  listDataB = JSON.stringify(listDataB);
                  localStorage.setItem("settingA", listDataA);
                  localStorage.setItem("settingB", listDataB);
                }
              }
              // else{
              const { data } = res;
              this.getcrmRulesAndModel(data);
              this.loading = false;
              // }
            })
            .catch(() => {
              this.loading = false;
            });
          return false;
        } else if (this.currentHash === "crm_customer_schedule") {
          this.loading = true;
          // 获取自定义字段的更新时间
          var params = {};
          if (this.typeList == "") {
            params.types = "crm_customer_travel";
          } else {
            params.types = this.typeListTpye;
          }
          params.module = "crm";
          params.controller = "customer_detail";
          params.action = "save";
          params.customer_id = JSON.parse(
            localStorage.getItem("nameList")
          ).customer_id;
          adminFieldGetField(params)
            .then(res => {
              this.constData = res.data;
              if (this.action.action == "update") {
                let params_c = {};
                if (this.formData.travel_type == "接觸") {
                  params.types = "crm_customer_travel_contact";
                } else if (this.formData.travel_type == "約見") {
                  params.types = "crm_customer_travel_meeting";
                } else if (this.formData.travel_type == "入場動態") {
                  params.types = "crm_customer_travel_admission";
                } else if (this.formData.travel_type == "禮遇") {
                  params.types = "crm_customer_travel_courtesy";
                }
                params.module = "crm";
                params.controller = "customer";
                params.action = "update";
                params.customer_id = this.formData.customer_id;
                params.action_id = this.formData.id;
                if (this.oldTypeList === "") {
                  adminFieldGetField(params).then(res => {
                    res.data.forEach(element => {
                      if (element.field == "color") {
                        this.Bus.$emit("colorListDatas", element.value);
                        let colorList = JSON.stringify(element.setting);
                        localStorage.setItem("colorList", colorList);
                      } else {
                        this.constData.push(element);
                      }
                    });
                    this.getcrmRulesAndModel(this.constData);
                    this.loading = false;
                  });
                } else {
                  res.data.forEach(element => {
                    if (element.field == "color") {
                      let colorList = JSON.stringify(element.setting);
                      localStorage.setItem("colorList", colorList);
                      res.data.splice(1, 1);
                    }
                  });
                  const { data } = res;
                  this.getcrmRulesAndModel(data);
                  this.loading = false;
                }
              } else {
                res.data.forEach(element => {
                  if (element.field == "color") {
                    let colorList = JSON.stringify(element.setting);
                    localStorage.setItem("colorList", colorList);
                    res.data.splice(1, 1);
                  }
                });
                const { data } = res;
                this.getcrmRulesAndModel(data);
                this.loading = false;
              }
            })
            .catch(() => {
              this.loading = false;
            });
          return false;
        } else if (this.currentHash === "crm_customerInformation") {
          this.loading = true;
          // 获取自定义字段的更新时间
          var params = {};
          params.types = "crm_customer_experience";
          params.module = "crm";
          params.controller = "customer_detail";
          params.action = this.action.type;
          params.customer_id = this.action.currentItem.customer_id;
          // 进行编辑操作
          if (this.action.type == "update") {
            params.action_id = this.action.currentItem.id;
          }
          adminExperienceDetail(params)
            .then(res => {
              const { data } = res;
              this.getcrmRulesAndModel(data);
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
          return false;
        } else if (this.currentHash === "customerInformation") {
          this.loading = true;
          var params = {};
          params.types = "crm_customer";
          params.module = "crm";
          params.controller = "customer";
          params.action = "save";
          adminFieldGetField(params).then(res => {
            const { data } = res;
            this.getcrmRulesAndModel(data);
            this.loading = false;
          });
        }
        //新建表格信息----靜態數據
        const creactDataList =
          this.crmType === "contacts"
            ? crmCustomerContactTableHeadList[this.createSubType]
            : [];
        this.getcrmRulesAndModel(creactDataList);
        return false;
      }

      this.loading = true;
      // 获取自定义字段的更新时间
      var params = {};
      params.types = "crm_" + this.crmType;
      params.module = "crm";
      params.controller = this.crmType;
      params.action =
        this.action.type === "relative" ? "save" : this.action.type;
      if (this.currentHash === "customerInformation") {
        params.action = "save";
      }
      // 进行编辑操作
      if (this.action.type == "update") {
        params.action_id = this.action.id;
      }
      adminFieldGetField(params)
        .then(res => {
          if (this.currentHash === "customerInformation") {
            this.getcrmRulesAndModel(res.data);
            return false;
          }
          //新建表格信息
          const creactDataList =
            this.crmType === "contacts"
              ? crmCustomerContactTableHeadList[this.createSubType]
              : this.crmType === "customer"
              ? this.getStaticData()
              : res.data;

          this.getcrmRulesAndModel(creactDataList);

          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 根据自定义字段获取自定义字段规则
    getcrmRulesAndModel(list) {
      if (this.CRMcustomerId_id !== "") {
        if (this.action.data.name == "接觸") {
          this.crmForm.crmFields.splice(2, 10);
        } else if (this.action.data.name == "約見") {
          this.crmForm.crmFields.splice(2, 16);
        } else if (this.action.data.name == "入場動態") {
          this.crmForm.crmFields.splice(2, 6);
        } else if (this.action.data.name == "禮遇") {
          this.crmForm.crmFields.splice(2, 8);
        }
      }
      if (this.action.action == "update") {
        if (this.oldTypeList === "接觸" || this.oldTypeList === 127) {
          this.crmForm.crmFields.splice(2, 10);
        } else if (this.oldTypeList === "約見" || this.oldTypeList === 128) {
          this.crmForm.crmFields.splice(2, 16);
        } else if (
          this.oldTypeList === "入場動態" ||
          this.oldTypeList === 129
        ) {
          this.crmForm.crmFields.splice(2, 6);
        } else if (this.oldTypeList === "禮遇" || this.oldTypeList === 325) {
          this.crmForm.crmFields.splice(2, 8);
        }
      } else {
        if (this.oldTypeList === 127) {
          this.crmForm.crmFields.splice(2, 10);
        } else if (this.oldTypeList === 128) {
          this.crmForm.crmFields.splice(2, 16);
        } else if (this.oldTypeList === 129) {
          this.crmForm.crmFields.splice(2, 6);
        } else if (this.oldTypeList === 325) {
          this.crmForm.crmFields.splice(2, 8);
        }
      }

      if (
        this.titleList == "新增過往經驗" ||
        this.titleList == "新增客戶背景"
      ) {
        list[0].value = this.nameList.name;
      } else if (this.titleList == "新增日程" || this.titleList == "編輯日程") {
        if (this.crmForm.crmFields.length == 0) {
          console.log(this.formData);
          list[0].value = this.formData.travel_type;
          list[1].value = this.nameList.name;
        }
      } else if (window.document.location.hash === "#/crm/customerContact") {
        if (this.CRMcustomerId_id === "") {
          list[0].value = this.action.data.name;
        }
      }
      let showStyleIndex = -1;
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        showStyleIndex += 1;
        /**
         * 规则数据  res.data.splice(8,1)
         */
        this.crmRules[item.field] = this.getItemRulesArrayFromItem(item);
        /**
         * 表单数据
         */
        if (
          // crm相关信息特殊处理
          item.form_type == "contacts" ||
          item.form_type == "customer" ||
          item.form_type == "contract" ||
          item.form_type == "business" ||
          item.form_type == "receivables_plan"
        ) {
          var params = {};
          params["key"] = item.field;
          params["data"] = item;
          // 获取 value relative 信息
          this.getParamsValueAndRelativeInfo(params, item, list);
          params["disabled"] = this.getItemDisabledFromItem(item);

          params["styleIndex"] = showStyleIndex;
          this.crmForm.crmFields.push(params);
        } else if (item.form_type == "category") {
          /** 产品分类 */
          var params = {};
          params["key"] = item.field;
          params["data"] = item;
          if (this.action.type == "update" && item.value) {
            params["value"] = item.value
              ? item.value.map(function(item, index, array) {
                  return parseInt(item);
                })
              : [];
          } else {
            params["value"] = [];
          }
          params["disabled"] = false; // 是否可交互
          params["styleIndex"] = showStyleIndex;
          this.crmForm.crmFields.push(params);
        } else if (item.form_type == "product") {
          // 关联产品信息比较多 用字典接收
          var params = {};
          params["value"] = item.value;
          params["key"] = item.field;
          params["data"] = item;
          params["disabled"] = false; // 是否可交互
          params["showblock"] = true; // 展示整行效果
          if (index % 2 == 0) {
            showStyleIndex = -1;
          }
          this.crmForm.crmFields.push(params);
        } else if (item.form_type == "map_address") {
          // 关联产品信息比较多 用字典接收
          var params = {};

          if (this.action.type == "update") {
            params["value"] = item.value; // 编辑的值 在value字段
          } else {
            params["value"] = {}; // 加入默认值 可能编辑的时候需要调整
          }
          params["key"] = item.field;
          params["data"] = item;
          params["disabled"] = false; // 是否可交互
          params["showblock"] = true; // 展示整行效果
          if (index % 2 == 0) {
            showStyleIndex = -1;
          }
          this.crmForm.crmFields.push(params);
        } else if (item.form_type == "datetime") {
          // 返回的时间戳  要处理为格式化时间（编辑的时候）
          // 关联产品信息比较多 用字典接收
          var params = {};
          if (this.action.type == "update" || this.action.action == "update") {
            params["value"] =
              item.value && item.value !== 0
                ? timestampToFormatTime(item.value, "YYYY-MM-DD HH:mm:ss")
                : ""; // 编辑的值 在value字段
          } else {
            params["value"] = item.default_value; // 加入默认值 可能编辑的时候需要调整
          }

          params["key"] = item.field;
          params["data"] = item;
          params["disabled"] = false; // 是否可交互
          params["styleIndex"] = showStyleIndex;
          this.crmForm.crmFields.push(params);
        } else {
          var params = {};
          if (this.action.type == "update") {
            params["value"] = item.value; // 编辑的值 在value字段
          } else {
            params["value"] = item.default_value
              ? item.default_value
              : item.value; // 加入默认值 可能编辑的时候需要调整
          }
          params["key"] = item.field;
          params["data"] = item;
          if (
            item.field === "remark" &&
            this.currentHash === "crm_customer_background"
          ) {
            params["showblock"] = true; // 展示整行效果
          }
          if (
            item.field === "content" &&
            this.currentHash === "crm_customer_shop"
          ) {
            params["showblock"] = true; // 展示整行效果
          }
          params["disabled"] = false; // 是否可交互
          // 客户接触 新增的  类型 不可编辑
          if (
            this.currentHash === "customerContact" &&
            item.field === "travel_type"
          ) {
            params["disabled"] = true;
          }
          const disabledType = [
            "crm_customer_background",
            "crm_customer_experience",
            "crm_customer_shop",
            "crm_customer_schedule"
          ];
          if (
            item.field === "customer_id" &&
            disabledType.includes(this.currentHash)
          ) {
            params["disabled"] = true; // 是否可交互
          }
          //如果是人脸识别ID
          if (item.field == "face_id" && item.value != "") {
            params["disabled"] = true; // 是否可交互
          }

          params["styleIndex"] = showStyleIndex;
          this.crmForm.crmFields.push(params);
        }
      }
    },
    /**
     * 获取关联项的值 和 关联信息
     */
    getParamsValueAndRelativeInfo(params, item, list) {
      if (this.action.type == "relative") {
        let relativeData = this.action.data[item.form_type];
        if (item.form_type == "receivables_plan") {
          params["value"] = "";
        } else {
          params["value"] = relativeData ? [relativeData] : [];
        }
      } else {
        params["value"] = item.value;
      }
      if (this.action.type == "relative" || this.action.type == "update") {
        // 回款计划 需要合同信息
        if (item.form_type === "receivables_plan") {
          let contractItem = this.getItemRelatveInfo(item, list, "contract");
          if (contractItem) {
            contractItem["form_type"] = "contract";
            params["relation"] = contractItem;
          }
          // 商机合同 需要客户信息
        } else if (
          item.form_type == "business" ||
          item.form_type == "contract"
        ) {
          let customerItem = this.getItemRelatveInfo(item, list, "customer");
          if (item.form_type == "business" && customerItem) {
            customerItem["form_type"] = "customer";
            params["relation"] = customerItem;
          } else if (item.form_type == "contract" && customerItem) {
            customerItem["form_type"] = "customer";
            customerItem["params"] = { check_status: 2 };
            params["relation"] = customerItem;
          }
        }
      }
    },
    /**
     * 获取相关联item
     */
    getItemRelatveInfo(item, list, from_type) {
      let crmItem = null;
      if (this.action.type == "relative") {
        crmItem = this.action.data[from_type];
      } else {
        let crmObj = list.find(listItem => {
          return listItem.form_type === from_type;
        });
        if (crmObj && crmObj.value && crmObj.value.length > 0) {
          crmItem = crmObj.value[0];
        }
      }
      return crmItem;
    },
    /**
     * 获取关联项是否可操作
     */
    getItemDisabledFromItem(item) {
      // 相关添加
      if (this.action.type == "relative") {
        let relativeDisInfos = {
          business: {
            customer: { customer: true },
            contacts: { customer: true }
          },
          contacts: {
            customer: { customer: true }
          },
          contract: {
            customer: { customer: true },
            business: { customer: true, business: true }
          },
          receivables_plan: {
            contract: { customer: true, contract: true },
            customer: { customer: true }
          },
          receivables: {
            contract: { customer: true, contract: true },
            customer: { customer: true }
          }
        };
        // 添加类型
        let crmTypeDisInfos = relativeDisInfos[this.crmType];
        if (crmTypeDisInfos) {
          // 在哪个类型下添加
          let relativeTypeDisInfos = crmTypeDisInfos[this.action.crmType];
          if (relativeTypeDisInfos) {
            // 包含的字段值
            return relativeTypeDisInfos[item.form_type] || false;
          }
        }
        return false;
      } else if (this.action.type != "update") {
        // 新建
        if (this.crmType === "contract" && item.form_type === "business") {
          return true;
          // 回款下 新建 合同 和 回款计划 默认不能操作
        } else if (this.crmType === "receivables") {
          if (item.form_type === "contract") {
            return true;
          } else if (item.form_type === "receivables_plan") {
            return true;
          }
        }
      }
      return false;
    },
    /**
     * 验证表单----自定义字段验证规则
     * item 当行数据源
     */
    getItemRulesArrayFromItem(item) {
      var tempList = [];
      console.log(item);
      // 判断输入的是否是数字
      const isNum = [
        "phone_code",
        "register_capital",
        "max_amount",
        "average_amount",
        "brokerage",
        "overdraft",
        "meeting_amount",
        "admission_amount"
      ];
      if (isNum.includes(item.field)) {
        let isNumber = (rule, value, callback) => {
          if (!value || value == "" || regexIsNumber(value)) {
            this.isNumberList = "0";
            callback();
          } else {
            this.isNumberList = "1";
            callback(new Error("请输入数字"));
          }
        };
        tempList.push({
          validator: isNumber,
          item: item,
          trigger: ["blur"]
        });
      }
      return tempList;
    },
    // getItemRulesArrayFromItem(item) {
    //   var tempList = [];
    //   // if(item.value !="" ){
    //   //   tempList.push({
    //   //        required: false,
    //   //     })
    //   // }
    //   //验证必填

    //   if (item.is_null == 1) {
    //     if (item.form_type == "category") {
    //       tempList.push({
    //         required: true,
    //         message: item.name + "不能為空",
    //         trigger: []
    //       });
    //     } else if (item.is_show == "0" || item.is_show == "1") {
    //       tempList.push({
    //         required: false,
    //         message: item.name + "不能為空",
    //         trigger: ["blur", "change"]
    //       });
    //     } else {
    //       tempList.push({
    //         required: true,
    //         message: item.name + "不能為空",
    //         trigger: ["blur", "change"]
    //       });
    //     }
    //   }

    //   //验证唯一
    //   if (item.is_unique == 1) {
    //     var validateUnique = (rule, value, callback) => {
    //       if (!value && rule.item.is_null == 0) {
    //         callback();
    //       } else {
    //         var validatesParams = {};
    //         validatesParams.field = rule.item.field;
    //         validatesParams.val = value;
    //         validatesParams.types = "crm_" + this.crmType;
    //         if (this.action.type == "update") {
    //           validatesParams.id = this.action.id;
    //         }
    //         filedValidates(validatesParams)
    //           .then(res => {
    //             callback();
    //           })
    //           .catch(error => {
    //             callback(new Error(error.error ? error.error : "驗證出錯"));
    //           });
    //       }
    //     };
    //     tempList.push({
    //       validator: validateUnique,
    //       item: item,
    //       trigger: ["blur"]
    //     });
    //   }

    //   // 特殊字符
    //   if (item.form_type == "number") {
    //     var validateCRMNumber = (rule, value, callback) => {
    //       if (!value || value == "" || regexIsCRMNumber(value)) {
    //         callback();
    //       } else {
    //         callback(new Error("數字的整數部分須少於12位，小數部分須少於4位"));
    //       }
    //     };
    //     tempList.push({
    //       validator: validateCRMNumber,
    //       item: item,
    //       trigger: ["blur"]
    //     });
    //   } else if (item.form_type == "floatnumber") {
    //     var validateCRMMoneyNumber = (rule, value, callback) => {
    //       if (!value || value == "" || regexIsCRMMoneyNumber(value)) {
    //         callback();
    //       } else {
    //         callback(new Error("貨幣的整數部分須少於10位，小數部分須少於2位"));
    //       }
    //     };
    //     tempList.push({
    //       validator: validateCRMMoneyNumber,
    //       item: item,
    //       trigger: ["blur"]
    //     });
    //   } else if (item.form_type == "mobile") {
    //     var validateCRMMobile = (rule, value, callback) => {
    //       if (!value || value == "" || regexIsCRMMobile(value)) {
    //         callback();
    //       } else {
    //         callback(new Error("手機格式有誤"));
    //       }
    //     };
    //     tempList.push({
    //       validator: validateCRMMobile,
    //       item: item,
    //       trigger: ["blur"]
    //     });
    //   } else if (item.form_type == "email") {
    //     var validateCRMEmail = (rule, value, callback) => {
    //       if (!value || value == "" || regexIsCRMEmail(value)) {
    //         callback();
    //       } else {
    //         callback(new Error("郵箱格式有誤"));
    //       }
    //     };
    //     tempList.push({
    //       validator: validateCRMEmail,
    //       item: item,
    //       trigger: ["blur"]
    //     });
    //   }
    //   return tempList;
    // },
    // 保存数据
    saveField(saveAndCreate) {
      const addStaticDataType = [
        "customer",
        "contacts",
        "product",
        "crm_customer_shop"
      ];
      // 新增 投诉/需求/意见 接口请求判断
      const feedbackNewGetFieldTypes = ["demand", "opinion", "complaint"];
      if (addStaticDataType.includes(this.crmType)) {
        // 添加静态数据的方法
        const params_a = this.getSubmiteParams(this.crmForm.crmFields);
        if (window.document.location.hash === "#/crm/customerContact") {
          params_a.travel_type = this.action.data.id;
        }
        if (feedbackNewGetFieldTypes.includes(this.currentHash)) {
          for (let key in params_a) {
            if (!params_a[key] && params_a[key] !== 0) {
              Message({
                message: "请填写完整信息",
                type: "error"
              });
              return false;
            }
          }
          this.loading = true;
          // 客户反馈  - 新增投诉
          // 意见/需求改为同一个接口 type 区分 1是意见 2是需求
          if (this.currentHash === "demand") {
            // 需求
            params_a.type = 2;
          } else if (this.currentHash === "opinion") {
            // 意见
            params_a.type = 1;
          }
          if (this.currentHash === "complaint") {
            newComplaintSave(params_a)
              .then(res => {
                this.$message.success("新增成功");
                this.$emit("on-addData");
                // 关闭弹窗
                this.$emit("hiden-view");
                this.loading = false;
              })
              .catch(() => {
                this.$message.success("新增失败");
                this.loading = false;
              });
          } else {
            // 新增 需求/意见
            newDemandSave(params_a)
              .then(res => {
                this.$message.success("新增成功");
                this.$emit("on-addData");
                // 关闭弹窗
                this.$emit("hiden-view");
                this.loading = false;
              })
              .catch(() => {
                this.$message.success("新增失败");
                this.loading = false;
              });
          }

          return false;
        }
        if (
          this.currentHash === "crm_customer_background" ||
          this.currentHash === "crm_customer_experience" ||
          this.currentHash === "crm_customer_shop" ||
          this.currentHash === "crm_customer_shop"
        ) {
          const {
            type,
            request_type,
            currentItem: { customer_id }
          } = this.action;
          params_a.request_type = request_type;
          params_a.customer_id = this.nameList.customer_id;
          if (type === "update") {
            const {
              currentItem: { id }
            } = this.action;
            // 修改
            params_a.id = id;
          }
          if (!this.rulesFlag) {
            params_a.listed_company = 47;
          }
          for (let key in params_a) {
            if (window.document.location.hash === "#/crm/customerContact") {
              if (!params_a[key] && params_a[key] !== 0) {
                Message({
                  message: "请填写完整信息",
                  type: "error"
                });
                return false;
              }
            } else {
              if (!params_a[key]) {
                Message({
                  message: "请填写完整信息",
                  type: "error"
                });
                return false;
              }
            }
          }

          if (
            this.currentHash === "crm_customer_shop" &&
            params_a.content.length >= 200
          ) {
            // 新增購物紀錄 內容字數限制 200
            Message({
              message: "購買物品字數不得超過 200 字",
              type: "error"
            });
            return false;
          }
          // return false;
          if (type === "save") {
            this.loading = true;
            /**
             * 新增保存和更新调用相同的接口
             * 通过改变 request_type 字段来区别请求
             */
            if (this.currentHash === "crm_customer_background") {
              if (!this.rulesFlag) {
                params_a.phone = params_a.phone_code;
                params_a.phone_code = localStorage.getItem("phoneCode");
              } else {
                params_a.company_code = params_a.listed_company;
                params_a.listed_company = localStorage.getItem("listedCompany");
                params_a.phone = params_a.phone_code;
                params_a.phone_code = localStorage.getItem("phoneCode");
              }
            }

            crmCustomerDetailSave(params_a).then(res => {
              this.$message.success("新增成功");
              this.$emit("save-edit-success-get-customer-detail");
            });
          } else if (type === "update") {
            this.loading = true;
            if (this.currentHash === "crm_customer_background") {
              if (!this.rulesFlag) {
                params_a.phone = params_a.phone_code;
                params_a.phone_code = localStorage.getItem("phoneCode");
              } else {
                if (localStorage.getItem("settingC") === "") {
                  Message({
                    message: "请填写完整信息",
                    type: "error"
                  });
                  return false;
                } else {
                  if (this.blurClickFlag) {
                    params_a.company_code = localStorage.getItem("settingC");
                  } else {
                    let setting_code = localStorage.getItem("settingC");
                    params_a.company_code = setting_code.slice(1, -1);
                  }
                  params_a.listed_company = localStorage.getItem(
                    "listedCompany"
                  );
                  params_a.phone = params_a.phone_code;
                  params_a.phone_code = localStorage.getItem("phoneCode");
                }

                // params_a.company_code = localStorage.getItem("settingC");
              }
            }
            crmCustomerDetailUpdate(params_a).then(res => {
              this.$message.success(res.data);
              this.$emit("save-edit-success-get-customer-detail");
            });
          }

          return false;
        } else if (this.currentHash === "crm_customer_schedule") {
          params_a.color = this.colorData.id;
          console.log(params_a.color);
          params_a.customer_id = this.nameList.customer_id;
        }
        if (this.dialogImageUrl) {
          params_a.avatar = this.dialogImageUrl;
        }
        for (let key in params_a) {
          if (
            window.document.location.hash === "#/crm/customerContact" ||
            this.titleList == "新增日程" ||
            this.titleList == "編輯日程"
          ) {
            if (
              (!params_a[key] && params_a[key] !== 0) ||
              this.isNumberList == "1"
            ) {
              Message({
                message: "请填写完整信息",
                type: "error"
              });
              return false;
            }
          } else {
            if (!params_a[key]) {
              Message({
                message: "请填写完整信息",
                type: "error"
              });
              return false;
            }
          }
        }

        if (window.document.location.hash == "#/crm/customerContact") {
          params_a.color = this.colorData.id;
          params_a.request_type = "event";
          scheduleAdd(params_a)
            .then(res => {
              this.Bus.$emit("crmCustomerDetailContact");
              if (this.titleList == "新增約見") {
                this.Bus.$emit("on-addCustomerContactData", params_a);
              } else {
                this.Bus.$emit("addCustomerContactData", params_a);
              }
            })
            .catch(err => {
              this.loading = false;
            });
        } else if (
          window.document.location.hash == "#/crm/customerInformation"
        ) {
          if (this.titleList == "新增過往經驗") {
            this.Bus.$emit("addCustomerData", params_a);
          } else if (
            this.titleList == "新增日程" ||
            this.titleList == "編輯日程"
          ) {
            if (this.action.action == "update") {
              params_a.id = this.editBtn.id;
              if (this.typeList == 127 || this.typeList == "接觸") {
                params_a.travel_type = 127;
                // params_a.types = "crm_customer_travel_contact";
              } else if (this.typeList == 128 || this.typeList == "約見") {
                params_a.travel_type = 128;
                // params_a.types = "crm_customer_travel_meeting";
              } else if (this.typeList == 129 || this.typeList == "入場動態") {
                params_a.travel_type = 129;
                // params_a.types = "crm_customer_travel_courtesy";
              } else if (this.typeList == 325 || this.typeList == "禮遇") {
                params_a.travel_type = 325;
              }
              params_a.types = this.typeListTpye;
              params_a.module = "crm";
              params_a.controller = "customer_detail";
              params_a.action = "update";
              params_a.request_type = "event";
              params_a.customer_id = this.nameList.customer_id;
              scheduleEdit(params_a)
                .then(res => {
                  this.Bus.$emit("onSubmitLoading", res.data);
                  this.loading = false;
                })
                .catch(err => {
                  this.loading = false;
                });
            } else {
              console.log(params_a);
              params_a.request_type = "event";
              params_a.customer_id = this.nameList.customer_id;
              scheduleAdd(params_a)
                .then(res => {
                  this.Bus.$emit("onSubmitLoading");
                  this.loading = false;
                })
                .catch(err => {
                  this.loading = false;
                });
            }
          } else {
            CrmCustomer_Save(params_a).then(res => {
              this.Bus.$emit("CrmCustomer_Save", params_a);
            });
          }
        } else if (this.currentHash === "crm_customer_schedule") {
        } else {
          this.$emit("on-addData", params_a);
        }
        // 关闭弹窗
        this.$emit("hiden-view");
        return false;
      }
      this.saveAndCreate = saveAndCreate;
      this.$refs.crmForm.validate(valid => {
        if (valid) {
          if (this.showExamine) {
            /** 验证审批数据 */
            this.$refs.examineInfo.validateField(() => {
              var params = this.getSubmiteParams(this.crmForm.crmFields);
              if (this.examineInfo.config === 0) {
                params["check_user_id"] = this.examineInfo.value[0].id;
              }
              this.submiteParams(params);
            });
          } else {
            var params = this.getSubmiteParams(this.crmForm.crmFields);
            this.submiteParams(params);
          }
        } else {
          return false;
        }
      });
    },
    /** 上传 */
    submiteParams(params) {
      this.loading = true;
      var crmRequest = this.getSubmiteRequest();
      if (this.action.type == "update") {
        params.id = this.action.id;
      }
      crmRequest(params)
        .then(res => {
          this.loading = false;
          if (this.crmType == "customer") {
            if (!this.saveAndCreate) {
              this.$message.success(
                this.action.type == "update" ? "編輯成功" : "添加成功"
              );
              this.hidenView();
            }
          } else {
            this.hidenView();
            this.$message.success(res.data);
          }
          // 回到保存成功
          this.$emit("save-success", {
            type: this.crmType,
            data: res.data,
            saveAndCreate: this.saveAndCreate
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /** 获取上传url */
    getSubmiteRequest() {
      if (this.crmType == "leads") {
        return this.action.type == "update" ? crmLeadsUpdate : crmLeadsSave;
      } else if (this.crmType == "customer") {
        return this.action.type == "update"
          ? crmCustomerUpdate
          : crmCustomerSave;
      } else if (this.crmType == "contacts") {
        return this.action.type == "update"
          ? crmContactsUpdate
          : crmContactsSave;
      } else if (this.crmType == "business") {
        return this.action.type == "update"
          ? crmBusinessUpdate
          : crmBusinessSave;
      } else if (this.crmType == "product") {
        return this.action.type == "update" ? crmProductUpdate : crmProductSave;
      } else if (this.crmType == "contract") {
        return this.action.type == "update"
          ? crmContractUpdate
          : crmContractSave;
      } else if (this.crmType == "receivables") {
        return this.action.type == "update"
          ? crmReceivablesUpdate
          : crmReceivablesSave;
      } else if (this.crmType == "receivables_plan") {
        return this.action.type == "update"
          ? crmReceivablesPlanUpdate
          : crmReceivablesPlanSave;
      }
    },
    /** 拼接上传传输 */
    getSubmiteParams(array) {
      var params = {};
      if (this.currentHash === "crm_customer_background") {
        array[0].default_value = this.nameList.customer_id;
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          // 关联产品数据需要特殊拼接
          if (element.key == "product") {
            this.getProductParams(params, element);
          } else if (element.key == "customer_address") {
            // 位置信息需要注入多个字段
            this.getCustomerAddressParams(params, element);
          } else {
            let value = this.getRealParams(element);
            if (!(element.data.form_type == "date" && !value)) {
              params[element.key] = value;
            }
          }
        }
      } else {
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          // 关联产品数据需要特殊拼接
          if (element.key == "product") {
            this.getProductParams(params, element);
          } else if (element.key == "customer_address") {
            // 位置信息需要注入多个字段
            this.getCustomerAddressParams(params, element);
          } else {
            let value = this.getRealParams(element);
            if (!(element.data.form_type == "date" && !value)) {
              params[element.key] = value;
            }
          }
        }
      }

      return params;
    },
    getProductParams(params, element) {
      params["product"] = element.value.product;
      params["total_price"] = element.value.total_price
        ? element.value.total_price
        : 0;
      params["discount_rate"] = element.value.discount_rate
        ? element.value.discount_rate
        : 0;
    },
    // 获取客户位置参数
    getCustomerAddressParams(params, element) {
      params["address"] = element.value.address;
      params["detail_address"] = element.value.detail_address;
      params["location"] = element.value.location;
      params["lng"] = element.value.lng;
      params["lat"] = element.value.lat;
    },
    // 关联客户 联系人等数据要特殊处理
    getRealParams(element) {
      const feedbackNewGetFieldTypes = [
        "demand",
        "opinion",
        "complaint",
        "customerContact"
      ];
      // 客户接触 投诉新增时 customer_id 获取不到值的问题
      if (
        (element.key == "customer_id" &&
          !feedbackNewGetFieldTypes.includes(this.currentHash)) ||
        element.key == "contacts_id" ||
        element.key == "business_id" ||
        element.key == "leads_id" ||
        element.key == "contract_id"
      ) {
        if (!element.value.length) {
          return element.value[0][element.key];
        } else {
          return "";
        }
      } else if (
        element.data.form_type == "user" ||
        element.data.form_type == "structure"
      ) {
        return element.value.map(function(item, index, array) {
          return item.id;
        });
      } else if (element.data.form_type == "file") {
        return element.value.map(function(item, index, array) {
          return item.file_id;
        });
      } else if (element.data.form_type == "datetime") {
        // datetime 时间戳 date 格式化时间
        return element.value
          ? formatTimeToTimestamp(element.value)
          : element.value;
      }
      return element.value;
    },
    hidenView() {
      this.$emit("hiden-view");
      this.Bus.$emit("flagFalse", this.flag);
    },
    // 根据类型获取标题展示名称
    getTitle() {
      if (this.crmType == "leads") {
        return this.action.type == "update" ? "編輯線索" : "新建線索";
      } else if (this.crmType == "customer") {
        return this.action.type == "update" ? "編輯戶口" : "新建客户";
      } else if (this.crmType == "contacts") {
        return this.action.type == "update"
          ? "編輯自然人"
          : `新增${contactsCreateTitle[this.createSubType]}`;
      } else if (this.crmType == "business") {
        return this.action.type == "update" ? "編輯商機" : "新建商機";
      } else if (this.crmType == "product") {
        return this.action.type == "update"
          ? "編輯產品"
          : `新增${contactsCreateTitleFeedback[this.createSubType]}`;
      } else if (this.crmType == "contract") {
        return this.action.type == "update" ? "編輯合同" : "新建合同";
      } else if (this.crmType == "receivables") {
        return this.action.type == "update" ? "編輯回款" : "新建回款";
      } else if (this.crmType == "receivables_plan") {
        return this.action.type == "update" ? "編輯回款計劃" : "新建回款計劃";
      }
    },
    // 获取左边padding
    getPaddingLeft(item, index) {
      if (item.showblock && item.showblock == true) {
        return "0";
      }
      return item.styleIndex % 2 == 0 ? "0" : "25px";
    },
    // // 获取左边padding
    getPaddingRight(item, index) {
      if (item.showblock && item.showblock == true) {
        return "0";
      }
      return item.styleIndex % 2 == 0 ? "25px" : "0";
    }
  },
  destroyed() {
    // remove DOM node after destroy
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>
<style lang="scss" scoped>
.crm-create-container {
  position: relative;
  height: 100%;
}

.crm-create-flex {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
}

.crm-create-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    width: 40px;
    height: 40px;
    margin-right: -10px;
    padding: 10px;
    cursor: pointer;
  }
}

.crm-create-body {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

/** 将其改变为flex布局 */
.crm-create-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
}

.crm-create-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  // overflow: hidden;
  padding-bottom: 10px;
}

// 占用一整行
.crm-create-block-item {
  flex: 0 0 100%;
  flex-shrink: 0;
  padding-bottom: 10px;
}

.el-form-item /deep/ .el-form-item__label {
  line-height: normal;
  font-size: 13px;
  color: #333333;
  position: relative;
  padding-left: 8px;
  padding-bottom: 0;
}

.el-form /deep/ .el-form-item {
  margin-bottom: 0px;
}

.el-form /deep/ .el-form-item.is-required .el-form-item__label:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
  position: absolute;
  left: 0;
  top: 5px;
}

.handle-bar {
  position: relative;
  .handle-button {
    float: right;
    margin-top: 5px;
    margin-right: 20px;
  }
}

// 审核信息 里的审核类型
.examine-type {
  font-size: 12px;
  color: white;
  background-color: #fd715a;
  padding: 0 8px;
  margin-left: 5px;
  height: 16px;
  line-height: 16px;
  border-radius: 8px;
  transform: scale(0.8, 0.8);
}
</style>
