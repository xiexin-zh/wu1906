<template>
  <div class="rc-cont">
    <flexbox v-if="!isSeas" class="rc-head" direction="row-reverse">
      <el-button
        class="rc-head-item"
        @click.native="handleClick('remove')"
        type="primary"
        >移除</el-button
      >
      <el-button
        class="rc-head-item"
        @click.native="handleClick('edit')"
        type="primary"
        v-show="!titles"
        >編輯</el-button
      >
      <el-button
        class="rc-head-item"
        @click.native="editorClick('edit')"
        type="primary"
        v-show="titles"
        >編輯</el-button
      >
      <el-button
        class="rc-head-item"
        @click.native="handleClick('add')"
        type="primary"
        v-show="!titles"
        >添加團隊成員</el-button
      >
      <el-button
        class="rc-head-item"
        @click.native="addClick()"
        type="primary"
        v-show="titles"
        >新增</el-button
      >
    </flexbox>
    <el-dialog
      title="新增"
      width="400px"
      :append-to-body="true"
      v-loading="loading"
      :visible.sync="visibleForm"
    >
      <el-form ref="backdropForm" :model="backdropForm" label-width="80px">
        <el-form-item
          label="客户"
          prop="client"
          :rules="[{ required: true, message: '请填写客户', trigger: 'blur' }]"
        >
          <el-input v-model="backdropForm.client"></el-input>
        </el-form-item>
        <el-form-item
          label="業務背景"
          prop="background"
          :rules="[
            { required: true, message: '请填写業務背景', trigger: 'blur' }
          ]"
        >
          <el-input v-model="backdropForm.background"></el-input>
        </el-form-item>
        <el-form-item
          label="購物記錄"
          prop="ShoppingRecord"
          :rules="[
            { required: true, message: '请填写購物記錄', trigger: 'blur' }
          ]"
        >
          <el-input v-model="backdropForm.ShoppingRecord"></el-input>
        </el-form-item>
        <el-form-item
          label="過往博彩經驗歷史"
          prop="experience"
          :rules="[
            {
              required: true,
              message: '请填写過往博彩經驗歷史',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="backdropForm.experience"></el-input>
        </el-form-item>
        <el-form-item
          label="信貸"
          prop="creditLoan"
          :rules="[{ required: true, message: '请填写信貸', trigger: 'blur' }]"
        >
          <el-input v-model="backdropForm.creditLoan"></el-input>
        </el-form-item>
        <el-form-item
          label="評級"
          prop="rateGrade"
          :rules="[{ required: true, message: '请填写評級', trigger: 'blur' }]"
        >
          <el-input v-model="backdropForm.rateGrade"></el-input>
        </el-form-item>
      </el-form>
      <el-button
        @click.native="handleCancelCancel"
        style="margin-left:240px"
        class="form-bottom"
        >取消</el-button
      >
      <el-button
        type="primary"
        class="form-bottom-right"
        style="background: #005DF7"
        @click.native="handleConfirm('backdropForm')"
        >保存</el-button
      >
    </el-dialog>
    <el-table
      :data="list"
      :height="tableHeight"
      stripe
      style="width: 100%;border: 1px solid #E6E6E6;"
      :header-cell-style="headerRowStyle"
      :cell-style="cellStyle"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        show-overflow-tooltip
        type="selection"
        align="center"
        width="55"
        :selectable="handleSelectable"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        type="index"
        align="center"
        width="80"
        label="序号"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, index) in fieldList"
        :key="index"
        show-overflow-tooltip
        :prop="item.prop"
        :label="item.label"
      >
      </el-table-column>
    </el-table>
    <teams-handle
      :crmType="crmType"
      :title="titleList"
      :selectionList="[detail]"
      @handle="handleCallBack"
      :dialogVisible.sync="teamsDialogShow"
    ></teams-handle>

    <el-dialog
      title="編輯權限"
      v-loading="loading"
      :visible.sync="editPermissionShow"
      :append-to-body="true"
      width="400px"
    >
      <div class="handle-box">
        <flexbox class="handle-item">
          <div class="handle-item-name">權限：</div>
          <el-radio-group v-model="handleType">
            <el-radio :label="1">只讀</el-radio>
            <el-radio :label="2">讀寫</el-radio>
          </el-radio-group>
        </flexbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="editPermissionShow = false">取消</el-button>
        <el-button type="primary" @click.native="handleEditConfirm"
          >保存</el-button
        >
      </span>
    </el-dialog>
    <c-r-m-create-view
      v-if="isCreate"
      :crm-type="customer"
      :action="createActionInfo"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"
    ></c-r-m-create-view>
  </div>
</template>

<script type="text/javascript">
import CRMCreateView from "./CRMCreateView";
import { crmSettingTeam } from "@/api/customermanagement/common";
import loading from "../mixins/loading";
import TeamsHandle from "./selectionHandle/TeamsHandle"; // 操作团队成员
import { crmSettingTeamSave } from "@/api/customermanagement/common";

export default {
  name: "relative-team", //相关团队  可能再很多地方展示 放到客户管理目录下
  components: {
    TeamsHandle,
    CRMCreateView
  },
  computed: {},
  mixins: [loading],
  data() {
    return {
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
      selectionList: [] //勾选的数据
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
    let url = window.document.location.hash;
    if (url == "#/crm/customerInformation") {
      // this.fieldList.push({ type:"index", width: "50", label: "序号" });
      this.fieldList.push({ prop: "client", width: "200", label: "客户" });
      this.fieldList.push({
        prop: "background",
        width: "200",
        label: "業務背景"
      });
      this.fieldList.push({
        prop: "ShoppingRecord",
        width: "200",
        label: "購物記錄"
      });
      this.fieldList.push({
        prop: "experience",
        width: "200",
        label: "過往博彩經驗歷史"
      });
      this.fieldList.push({ prop: "creditLoan", width: "200", label: "信貸" });
      this.fieldList.push({ prop: "rateGrade", width: "200", label: "評級" });
      // this.fieldList.push({
      //   prop: "attached",
      //   width: "200",
      //   label: "附加文件"
      // });
      this.customer = "customerInformation";
      this.titleList = "新增";
    } else {
      this.fieldList.push({ prop: "realname", width: "200", label: "姓名" });
      this.fieldList.push({
        prop: "structure_name",
        width: "200",
        label: "職位"
      });
      this.fieldList.push({
        prop: "group_name",
        width: "200",
        label: "團隊角色"
      });
      this.fieldList.push({ prop: "authority", width: "200", label: "權限" });
      this.titles = false;
      this.titleList = "添加團隊成員";
      this.getDetail();
    }
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
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
      this.visibleForm = true;
      this.fieldFlag = "add";
    },
    getDetail() {
      this.loading = true;
      crmSettingTeam({
        types: "crm_" + this.crmType,
        types_id: this.id
      })
        .then(res => {
          this.loading = false;
          this.list = res.data;
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
      this.$emit("hiden-view");
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
.form-span-dialog {
  display: inline-block;
  width: 180px;
  height: 50px;
}
</style>
