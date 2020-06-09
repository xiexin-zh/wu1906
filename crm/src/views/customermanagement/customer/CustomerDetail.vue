<template>
  <slide-view
    v-empty="!canShowDetail"
    :listenerIDs="listenerIDs"
    :noListenerIDs="noListenerIDs"
    :noListenerClass="noListenerClass"
    @side-close="hideView"
    :body-style="{ padding: 0, height: '100%' }"
  >
    <flexbox
      v-if="canShowDetail"
      v-loading="loading"
      xs-empty-icon="nopermission"
      xs-empty-text="暫無權限"
      direction="column"
      align="stretch"
      class="d-container"
    >
      <c-r-m-detail-head
        crmType="customer"
        :isSeas="isSeas"
        @handle="detailHeadHandle"
        @close="hideView"
        :detail="detailData"
        :headDetails="headDetails"
        :id="id"
        :currentHash="currentHash"
      ></c-r-m-detail-head>
      <el-container class="box-tabs">
        <el-aside
          class="tabs"
          style="height:100%;background-color: #F5F6F9;width:180px"
        >
          <el-tabs
            v-model="tabCurrentName"
            @tab-click="handleClick"
            class="tabs-tabnames"
          >
            <el-tab-pane
              v-for="(item, index) in tabnames"
              :key="index"
              :label="item.label"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
        </el-aside>
        <el-main class="t-loading-content" id="follow-log-content">
          <keep-alive>
            <component
              v-bind:is="tabName"
              crmType="customer"
              :detail="detailData"
              :id="id"
              :isSeas="isSeas"
              :tabCurrentName="tabCurrentName"
            ></component>
          </keep-alive>
        </el-main>
      </el-container>
    </flexbox>
    <c-r-m-create-view
      v-if="isCreate"
      crm-type="customer"
      :action="{ type: 'update', id: this.id }"
      @save-success="editSaveSuccess"
      @hiden-view="isCreate = false"
    ></c-r-m-create-view>
  </slide-view>
</template>

<script>
import { shoppingRecordTableContentList } from "../../../assets/data/shoppingRecord/shopping-record-table-content-list";
import { analysisTableContentList } from "../../../assets/data/customerAnalysis/table-content-list";
import { crmCustomerContactContentList } from "../../../assets/data/customerContact/crm-customer-contact-table-contentList";
import {
  crmCustomerRead,
  crmCustomerDetailEventType // 接触类别接口
} from "@/api/new-api/common";
import { crmCustomerTableContentList } from "../../../assets/data/customerInfo/crm-customer-table-contentList";
import SlideView from "@/components/SlideView";
import CRMDetailHead from "../components/CRMDetailHead";
import CustomerFollow from "./components/CustomerFollow"; // 跟进记录
import CRMBaseInfo from "../components/CRMBaseInfo"; // 基本信息
import RelativeContacts from "../components/RelativeContacts"; //相关联系人
import RelativeBusiness from "../components/RelativeBusiness"; //相关商机
import RelativeContract from "../components/RelativeContract"; //相关合同
import RelativeReturnMoney from "../components/RelativeReturnMoney"; //相关回款
import RelativeFiles from "../components/RelativeFiles"; //相关附件
import RelativeHandle from "../components/RelativeHandle"; //相关操作
import RelativeTeam from "../components/RelativeTeam"; //相关团队
import CRMCreateView from "../components/CRMCreateView"; // 新建页面
import AdmissionSstatus from "../components/AdmissionSstatus"; // 入场页面
import schedule from "../../OAManagement/schedule/index";
import moment from "moment";
import detail from "../mixins/detail";
import AnalysisConsumption from "./components/AnalysisConsumption";
import RelativeTableList from "../components/RelativeTableList";
import RelativeTouch from "../components/RelativeTouch";
import RelativeJourney from "../components/RelativeJourney";
import RelativeCourteous from "../components/RelativeCourteous";
import RelativeUnclaimed from "../components/RelativeUnclaimed";
import RelativealreadyReceived from "../components/RelativealreadyReceived";
import PastGamblingExperience from "../components/PastGamblingExperience";
import CustomerBackground from "../components/CustomerBackground";
import creditAndLoan from "../components/creditAndLoan";
import ShoppingRecord from "../components/ShoppingRecord";
export default {
  /** 客户管理 的 客户详情 */
  name: "customer-detail",
  components: {
    SlideView,
    CustomerFollow,
    CRMDetailHead,
    CRMBaseInfo,
    RelativeContacts,
    RelativeBusiness,
    RelativeContract,
    RelativeReturnMoney,
    RelativeFiles,
    RelativeHandle,
    creditAndLoan,
    RelativeTeam,
    CustomerBackground, //客戶信息---客戶背景
    ShoppingRecord,
    CRMCreateView,
    AdmissionSstatus,
    schedule,
    AnalysisConsumption,
    RelativeTableList,
    RelativeTouch,
    RelativeJourney,
    RelativeCourteous,
    RelativeUnclaimed,
    RelativealreadyReceived,
    PastGamblingExperience
  },
  mixins: [detail],
  props: {
    // 详情信息id
    id: [String, Number],
    // 监听的dom 进行隐藏详情
    listenerIDs: {
      type: Array,
      default: () => {
        return ["crm-main-container"];
      }
    },
    // 不监听
    noListenerIDs: {
      type: Array,
      default: () => {
        return [];
      }
    },
    noListenerClass: {
      type: Array,
      default: () => {
        return ["el-table__body"];
      }
    },
    currentHash: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      flagData: {},
      loading: false, // 展示加载loading
      crmType: "customer",
      detailData: {}, // read 详情
      headDetails: [
        { title: "戶口層級", value: "" },
        { title: "成交狀態", value: "" },
        { title: "跟進人", value: "" },
        { title: "更新時間", value: "" }
      ],
      tabCurrentName: "",
      isCreate: false, // 编辑操作
      eventTypeTitle: []
    };
  },
  computed: {
    tabName() {
      if (this.tabCurrentName == "followlog") {
        return "customer-follow";
      } else if (this.tabCurrentName == "basicinfo") {
        return "c-r-m-base-info";
      } else if (this.tabCurrentName == "contacts") {
        return "relative-contacts";
      } else if (this.tabCurrentName == "team") {
        return "CustomerBackground";
        // return "relative-team";
      } else if (
        this.tabCurrentName == "business" ||
        this.tabCurrentName == "session"
      ) {
        return "relative-business";
      } else if (this.tabCurrentName == "contract") {
        return "relative-contract";
      } else if (
        this.tabCurrentName == "returnedmoney" ||
        this.tabCurrentName == "account"
      ) {
        return "relative-return-money";
      } else if (this.tabCurrentName == "file") {
        return "relative-files";
      } else if (this.tabCurrentName == "operationlog") {
        return "relative-handle";
      } else if (this.tabCurrentName == "admission") {
        return "AdmissionSstatus";
      } else if (this.tabCurrentName == "schedule") {
        return "schedule";
      } else if (this.tabCurrentName == "consumption") {
        return "AnalysisConsumption";
      } else if (this.tabCurrentName == "crm_customer_travel_meeting") {
        return "RelativeTableList";
      } else if (this.tabCurrentName == "crm_customer_travel_contact") {
        return "RelativeTouch";
      } else if (this.tabCurrentName == "crm_customer_travel_admission") {
        return "RelativeJourney";
      } else if (this.tabCurrentName == "crm_customer_travel_courtesy") {
        return "RelativeCourteous";
      } else if (this.tabCurrentName == "unclaimed") {
        return "RelativeUnclaimed";
      } else if (this.tabCurrentName == "alreadyReceived") {
        return "RelativealreadyReceived";
      } else if (this.tabCurrentName == "experience") {
        return "PastGamblingExperience";
      } else if (this.tabCurrentName == "creditAndLoan") {
        return "creditAndLoan";
      } else if (this.tabCurrentName == "ShoppingRecord") {
        return "ShoppingRecord";
      }
      return "";
    },
    tabnames() {
      var tempsTabs = [];
      if (this.currentHash === "customerInformation") {
        tempsTabs.push({ label: "客戶背景", name: "team" });
        if (this.crm.customer && this.crm.customer.read) {
          tempsTabs.push({ label: "過往博彩經驗", name: "experience" });
        }
        if (this.crm.customer && this.crm.customer.read) {
          tempsTabs.push({ label: "信貸", name: "creditAndLoan" });
        }
        if (this.crm.customer && this.crm.customer.read) {
          tempsTabs.push({ label: "行程", name: "schedule" });
        }
        // tempsTabs.push({ label: "入場動態", name: "admission" });
        tempsTabs.push({ label: "購物記錄", name: "ShoppingRecord" });
      } else if (this.currentHash === "customerAnalysis") {
        tempsTabs.push({ label: "戶口分析", name: "account" });
        if (this.crm.business && this.crm.business.index) {
          tempsTabs.push({ label: "場次分析", name: "session" });
        }
        if (this.crm.receivables && this.crm.receivables.index) {
          tempsTabs.push({ label: "消費分析", name: "consumption" });
        }
      } else if (this.currentHash === "customerContact") {
        // 客户接触 二级
        this.eventTypeTitle.forEach(element => {
          tempsTabs.push({
            label: element.name,
            name: element.category
          });
        });
        // if (this.crm.business && this.crm.business.index) {
        //   tempsTabs.push({ label: "約見", name: "tableList" });
        // }
        // if (this.crm.business && this.crm.business.index) {
        //   tempsTabs.push({ label: "MD接觸", name: "touch" });
        // }
        // if (this.crm.business && this.crm.business.index) {
        //   tempsTabs.push({ label: "行程安排", name: "journey" });
        // }
        // if (this.crm.business && this.crm.business.index) {
        //   tempsTabs.push({ label: "禮遇", name: "courteous" });
        // }
      } else if (this.currentHash === "shoppingRecord") {
        if (this.crm.business && this.crm.business.index) {
          tempsTabs.push({ label: "未領取", name: "unclaimed" });
        }
        if (this.crm.business && this.crm.business.index) {
          tempsTabs.push({ label: "已領取", name: "alreadyReceived" });
        }
      } else {
        tempsTabs.push({ label: "跟進紀錄", name: "followlog" });
        if (this.crm.customer && this.crm.customer.read) {
          tempsTabs.push({ label: "基本信息", name: "basicinfo" });
        }
        if (this.crm.contacts && this.crm.contacts.index) {
          tempsTabs.push({ label: "自然人", name: "contacts" });
        }
        tempsTabs.push({ label: "相關團隊", name: "team" });
        if (this.crm.business && this.crm.business.index) {
          tempsTabs.push({ label: "商機", name: "business" });
        }
        if (this.crm.contract && this.crm.contract.index) {
          tempsTabs.push({ label: "合同", name: "contract" });
        }
        if (this.crm.receivables && this.crm.receivables.index) {
          tempsTabs.push({ label: "回款信息", name: "returnedmoney" });
        }
        tempsTabs.push({ label: "附件", name: "file" });
        tempsTabs.push({ label: "操作記錄", name: "operationlog" });
      }
      return tempsTabs;
    }
  },
  mounted() {
    this.cyrrentNameTab();
  },
  methods: {
    cyrrentNameTab() {
      const currentTabPage = {
        customerInformation: "team",
        customerAnalysis: "account",
        customerContact: "crm_customer_travel_contact",
        shoppingRecord: "unclaimed"
      };
      this.tabCurrentName = currentTabPage[this.currentHash];
    },
    getDetial() {
      this.flagData = JSON.parse(JSON.stringify(this.id));
      this.loading = true;
      // row 数据id 根据id查询数据
      const idData = [
        "#/crm/customerInformation",
        "#/crm/customerContact",
        "#/crm/customerAnalysis"
      ];
      if (idData.includes(window.document.location.hash)) {
        if (window.document.location.hash === "#/crm/customerContact") {
          crmCustomerDetailEventType().then(res => {
            this.eventTypeTitle = res.data;
          });
        }
        crmCustomerRead({
          id: this.flagData
        })
          .then(res => {
            this.detailData = res.data;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else if (window.document.location.hash == "#/crm/customerAnalysis") {
        let crmCustomerDataList = analysisTableContentList;
        this.detailData = crmCustomerDataList[this.flagData - 1];
        this.headDetails[0].value = crmCustomerTableContentList[1].level;
        this.headDetails[1].value = crmCustomerTableContentList[1].deal_status;
        this.headDetails[2].value = this.isSeas
          ? "- -"
          : this.detailData.owner_user_id_info
          ? this.detailData.owner_user_id_info.realname
          : "";
        this.headDetails[3].value = this.detailData.update_time;
        this.loading = false;
      } else if (window.document.location.hash == "#/crm/shoppingRecord") {
        let crmCustomerDataList = shoppingRecordTableContentList;
        this.detailData = crmCustomerDataList[this.flagData - 1];
        this.headDetails[0].value = crmCustomerTableContentList[1].level;
        this.headDetails[1].value = crmCustomerTableContentList[1].deal_status;
        this.headDetails[2].value = this.isSeas
          ? "- -"
          : this.detailData.owner_user_id_info
          ? this.detailData.owner_user_id_info.realname
          : "";
        this.headDetails[3].value = this.detailData.update_time;
        this.loading = false;
      } else {
        crmCustomerRead({
          id: this.flagData
        })
          .then(res => {
            this.detailData = res.data;
            this.headDetails[0].value = res.data.level;
            this.headDetails[1].value = res.data.deal_status;
            this.loading = false;
            // 负责人

            this.headDetails[2].value = this.isSeas
              ? "- -"
              : res.data.owner_user_id_info
              ? res.data.owner_user_id_info.realname
              : "";
            this.headDetails[3].value = res.data.update_time;
          })

          .catch(() => {
            this.loading = false;
          });
      }
    },
    //** 点击关闭按钮隐藏视图 */
    hideView() {
      this.$emit("hide-view");
    },
    //** tab标签点击 */
    handleClick(tab, event) {
      // this.getDetial();
    },
    editSaveSuccess() {
      this.$emit("handle", { type: "save-success" });
      this.getDetial();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/crmdetail.scss";
.tabs-tabnames {
  display: flex;
  flex-direction: column;
}
</style>
