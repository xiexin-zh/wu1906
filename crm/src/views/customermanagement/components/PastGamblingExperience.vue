<template>
  <div>
    <flexbox v-if="!isSeas" class="rc-head" direction="row-reverse">
      <el-button @click.native="addClick()" type="primary" v-show="titles"
        >新增過往經驗</el-button
      >
    </flexbox>
    <distinguished-guest
      class="editer"
      ref="distinguishedGuestChild"
      :flagData="compileFlagData"
      @compileClose="compileFlag"
      :list="this.list"
    ></distinguished-guest>
    <teams-handle
      :crmType="crmType"
      :title="titleList"
      :selectionList="[detail]"
      @handle="handleCallBack"
      :dialogVisible.sync="teamsDialogShow"
    ></teams-handle>
    <c-r-m-create-view
      v-if="isCreate"
      :titleList="flagTitle"
      :crmType="flagContent"
      :action="createActionInfo"
      :currentHash="flagUrl"
      :crmFormList="compileList"
      @save-edit-success-get-customer-detail="PastExperience"
    ></c-r-m-create-view>
  </div>
</template>

<script type="text/javascript">
import CRMCreateView from "./CRMCreateView";
// import { crmSettingTeam } from "@/api/customermanagement/common";
import { crmCustomerDetail } from "@/api/new-api/common";
import loading from "../mixins/loading";
import TeamsHandle from "./selectionHandle/TeamsHandle"; // 操作团队成员
import { crmSettingTeamSave } from "@/api/customermanagement/common";
import distinguishedGuest from "./distinguishedGuest";

export default {
  name: "PastGamblingExperience",
  components: {
    TeamsHandle,
    CRMCreateView,
    distinguishedGuest
  },
  computed: {},
  created() {
    // 获取列表数据
    this.getDetail();
  },
  mixins: [loading],
  data() {
    return {
      compileFlagData: "",
      items: [
        {
          component: distinguishedGuest,
          FormDataList: {}
        }
      ],
      backdropForm: {
        client: "",
        background: "",
        experience: "",
        creditLoan: "",
        rateGrade: "",
        ShoppingRecord: ""
      },
      visibleForm: false,
      fieldFlag: "",
      titleList: "",
      backdrop: false,
      customer: "",
      isCreate: false,
      titles: true,
      list: [],
      fieldList: [],
      tableHeight: "400px",
      teamsDialogShow: false, //是否展示添加团队成员窗口
      handleType: 1, // 权限类型
      editPermissionShow: false, //编辑权限接口展示
      selectionList: [], //勾选的数据
      flagTitle: "",
      flagContent: "",
      createActionInfo: { type: "save" },
      flagUrl: "crm_customer_experience",
      flag: true,
      compileList: {}
    };
  },
  watch: {
    id: function() {
      // 監聽 id 改變重新請求 過往博彩經驗 數據
      this.list = [];
      this.getDetail();
    }
  },
  props: {
    /** 模块ID */
    id: [String, Number],
    /** 联系人人下 新建商机 需要联系人里的客户信息  合同下需要客户和商机信息 */
    detail: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ""
    },
    /** 是公海 默认是客户 */
    isSeas: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.items.length > 0) {
      this.flag = false;
    }
    let url = window.document.location.hash;
    if (url == "#/crm/customerInformation") {
    }
    this.Bus.$on("flagFalse", data => {
      this.isCreate = false;
    });
    this.Bus.$on("addCustomerData", data => {
      this.items.push({
        component: distinguishedGuest,
        FormDataList: data
      });
      this.isCreate = false;
      if (this.items.length > 0) {
        this.flag = false;
      }
      console.log(this.items);
    });
    // (this.flagTitle = "新增過往經驗"),
      (this.flagContent = "customer"),
      (this.flagUrl = "crm_customer_experience");
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    PastExperience() {
      this.isCreate = false;
      this.compileFlagData = 1;
      this.getDetail();
      // this.$refs.distinguishedGuestChild.getPastGamblingExperience();
    },
    compileFlag(val) {
      this.flagTitle = "編輯過往經驗"
      this.createActionInfo.currentItem = { customer_id: this.id };
      this.createActionInfo.request_type = "experience";
      if (val.hasOwnProperty("customer_id")) {
        this.createActionInfo.type = "update";
        this.createActionInfo.currentItem = val;
      }
      this.isCreate = true;
    },
    editorClick() {
      if (this.selectionList.length == 1) {
        this.backdropForm = JSON.parse(JSON.stringify(this.selectionList[0]));
        this.visibleForm = true;
        this.fieldFlag = "edit";
      } else {
        this.$message.error("請勾選需要編輯的信息");
      }
    },
    handleCancelCancel() {
      this.visibleForm = false;
      this.createActionInfo.type = "save";
    },
    // 保存
    handleConfirm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.fieldFlag == "add") {
            this.list.push(this.backdropForm);
            this.visibleForm = false;
            this.backdropForm = {
              client: "",
              background: "",
              experience: "",
              creditLoan: "",
              rateGrade: ""
            };
          } else if (this.fieldFlag == "edit") {
            this.selectionList.forEach((val, index) => {
              this.list.forEach((v, i) => {
                if (val.client === v.client) {
                  // i 为选中的索引
                  this.list.splice(i);
                }
              });
            });
            this.list.push(this.backdropForm);
            this.visibleForm = false;
            this.backdropForm = {
              client: "",
              background: "",
              experience: "",
              creditLoan: "",
              rateGrade: ""
            };
          }
          this.fieldFlag = "";
        }
      });
    },
    // 删除
    removeClick(data) {
      data.forEach((val, index) => {
        this.list.forEach((v, i) => {
          if (val.client === v.client) {
            // i 为选中的索引
            this.tableData.splice(i);
          }
        });
      });
    },
    //新增
    addClick() {
      this.flagTitle = "新增過往經驗"
      this.createActionInfo.currentItem = { customer_id: this.id };
      this.createActionInfo.request_type = "experience";
      this.createActionInfo.type = "save";
      this.isCreate = true;
    },
    getDetail() {
      this.loading = true;
      crmCustomerDetail({
        request_type: "experience",
        customer_id: this.id,
        page: 1,
        limit: 10
      })
        .then(res => {
          this.loading = false;
          this.list = res.data.list;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.selectionList = val;
    },
    handleClick(type) {
      if (type == "add") {
        this.teamsDialogShow = true;
      } else {
        if (this.selectionList.length == 0) {
          this.$message.error("請勾選需要操作的團隊成員");
        } else {
          if (type == "edit") {
            if (window.document.location.hash == "#/crm/customerInformation") {
              if (this.selectionList.length < 2) {
                this.backdropForm = this.selectionList[0];
                this.teamsDialogShow = true;
              }
              this.fieldFlag = "edit";
            } else {
              this.editPermissionShow = true;
            }
          } else if (type == "remove") {
            this.$confirm("此操作將移除這些團隊成員是否繼續?", "提示", {
              confirmButtonText: "確定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                if (
                  window.document.location.hash == "#/crm/customerInformation"
                ) {
                  this.selectionList.forEach((val, index) => {
                    this.list.forEach((v, i) => {
                      if (val.client === v.client) {
                        // i 为选中的索引
                        this.list.splice(i, 1);
                      }
                    });
                  });
                } else {
                  var user_ids = this.selectionList.map(function(
                    item,
                    index,
                    array
                  ) {
                    return item.id;
                  });
                  var params = {
                    types: "crm_" + this.crmType,
                    types_id: [this.detail[this.crmType + "_id"]],
                    user_id: user_ids
                  };
                  params.is_del = 1;

                  this.loading = true;
                  crmSettingTeamSave(params)
                    .then(res => {
                      this.$message({
                        type: "success",
                        message: res.data
                      });
                      this.loading = false;
                      this.getDetail();
                    })
                    .catch(() => {
                      this.loading = false;
                    });
                }
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消刪除"
                });
              });
          }
        }
      }
    },
    /** 添加操作 */
    handleCallBack(data) {
      if (window.document.location.hash == "#/crm/customerInformation") {
        if (this.fieldFlag == "add") {
          this.list.push(data);
        } else if (this.fieldFlag == "edit") {
          this.selectionList = [];
          this.list.forEach((v, i) => {
            if (v.index === data.index) {
              this.list[i] = data;
            }
          });
        }
        this.fieldFlag == "";
      } else {
        this.getDetail();
      }
    },
    hidenView() {
      this.isCreate = false;
      //   this.$emit("hiden-view");
    },
    /** 编辑操作确定 */
    handleEditConfirm() {
      var user_ids = this.selectionList.map(function(item, index, array) {
        return item.id;
      });
      this.loading = true;
      crmSettingTeamSave({
        types: "crm_" + this.crmType,
        types_id: [this.detail[this.crmType + "_id"]],
        user_id: user_ids,
        type: this.handleType
      })
        .then(res => {
          this.editPermissionShow = false;
          this.$message({
            type: "success",
            message: res.data
          });
          this.loading = false;
          this.getDetail();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //返回值用来决定这一行的 CheckBox 是否可以勾选
    handleSelectable(row, index) {
      if (row.type == 0) {
        // 0负责人，1只读，2读写
        return false;
      }
      return true;
    },
    //当某一行被点击时会触发该事件
    handleRowClick(row, column, event) {},
    /** 通过回调控制表头style */
    headerRowStyle({ row, column, rowIndex, columnIndex }) {
      return { textAlign: "center" };
    },
    /** 通过回调控制style */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return { textAlign: "center" };
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../styles/relativecrm.scss";
.rc-head {
  background-color: #f6f6f6;
  padding: 10px 20px 10px 0;
}
.form-span-dialog {
  display: inline-block;
  width: 180px;
  height: 50px;
}
.editer-p {
  width: 100%;
  text-align: center;
}
</style>
