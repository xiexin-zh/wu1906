<template>
  <el-dialog
    :title="title"
    v-loading="loading"
    :visible.sync="visible"
    @close="handleCancel"
    :append-to-body="true"
    width="400px"
  >
    <div class="handle-box">
      <flexbox class="handle-item" align="stretch" v-if="title != '新增'">
        <div class="handle-item-name" style="margin-top: 8px;">
          選擇團隊成員：
        </div>
        <xh-user-cell
          class="handle-item-content"
          :radio="false"
          placeholder="點擊選擇（多選）"
          @value-change="userChage"
        ></xh-user-cell>
        <div v-if="title != '添加團隊成員'" class="tips">
          此操作不可移除數據操作人
        </div>
      </flexbox>
      <flexbox v-if="title == '添加團隊成員'" class="handle-item">
        <div class="handle-item-name">權限：</div>
        <el-radio-group v-model="handleType">
          <el-radio :label="1">只讀</el-radio>
          <el-radio :label="2">讀寫</el-radio>
        </el-radio-group>
      </flexbox>
      <flexbox v-else-if="title == '新增'" class="handle-item">
        <el-form
          ref="backdropForm"
          :model="backdropForm"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="客户" prop="backdropForm.client">
            <el-input v-model="backdropForm.client"></el-input>
          </el-form-item>
          <el-form-item label="業務背景" prop="backdropForm.background">
            <el-input v-model="backdropForm.background"></el-input>
          </el-form-item>
          <el-form-item label="過往博彩經驗歷史" prop="backdropForm.experience">
            <el-input v-model="backdropForm.experience"></el-input>
          </el-form-item>
          <el-form-item label="信貸" prop="backdropForm.creditLoan">
            <el-input v-model="backdropForm.creditLoan"></el-input>
          </el-form-item>
          <el-form-item label="評級" prop="backdropForm.rateGrade">
            <el-input v-model="backdropForm.rateGrade"></el-input>
          </el-form-item>
          <!-- <el-form-item label="附加文件">
            <div class="content">
          <flexbox class="file-select"> -->
          <!-- <el-input v-model="file.name"
                      :disabled="true"></el-input> -->
          <!-- <el-button type="primary"
                      
                       accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
             @change="uploadFile">選擇文件</el-button> -->
          <!-- <input type="file"
             id="importInputFile"
             accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
             @change="uploadFile">
           </input> -->
          <!-- </flexbox>
        </div>
          </el-form-item> -->
        </el-form>
      </flexbox>
      <flexbox
        v-if="title == '添加團隊成員' && crmType === 'customer'"
        class="handle-item"
      >
        <div class="handle-item-name">同時添加至：</div>
        <el-checkbox-group v-model="addsTypes">
          <!-- <el-checkbox label="contacts">联系人</el-checkbox> -->
          <el-checkbox label="crm_business">商機</el-checkbox>
          <el-checkbox label="crm_contract">合同</el-checkbox>
        </el-checkbox-group>
      </flexbox>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">取消</el-button>
      <el-button
        type="primary"
        style="background: #005DF7"
        @click.native="handleConfirm"
        v-if="title != '新增'"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { XhUserCell } from "@/components/CreateCom";
import { crmSettingTeamSave } from "@/api/customermanagement/common";

export default {
  /** 客户管理 的 勾选后的 团队成员 操作 移除操作不可移除客户负责人*/
  name: "teams-handle",
  components: {
    XhUserCell
  },
  mixins: [],
  watch: {
    dialogVisible: {
      handler(val) {
        this.visible = val;
        if (val) {
        }
      },
      deep: true,
      immediate: true
    }
  },
  props: {
    selectionListData: {
      type: Object,
      default: null
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ""
    },
    /** 转移数据 */
    selectionList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      rules: {},
      backdropForm: {
        client: "",
        background: "",
        experience: "",
        creditLoan: "",
        rateGrade: ""
      },
      loading: false, // 加载动画
      visible: false,

      usersList: [], // 变更负责人
      handleType: 1, // 操作类型
      addsTypes: [] // 添加至
    };
  },
  computed: {},
  mounted() {
    this.visible = this.dialogVisible;
  },
  methods: {
    /**
     * 取消选择
     */
    handleCancel() {
      this.visible = false;
      this.$emit("update:dialogVisible", false);
    },
    /** 负责人更改 */
    userChage(data) {
      this.usersList = data.value;
    },
    handleConfirm() {
      // 移除操作不可移除客户负责人
      if (this.usersList.length === 0) {
        this.$message.error("請選擇團隊成員");
      } else {
        var self = this;
        var action_ids = this.selectionList.map(function(item, index, array) {
          return item[self.crmType + "_id"];
        });
        var user_ids = this.usersList.map(function(item, index, array) {
          return item.id;
        });
        var params = {
          types: "crm_" + this.crmType,
          types_id: action_ids,
          user_id: user_ids
        };
        if (this.crmType === "customer" && this.title == "添加團隊成員") {
          // 只有客户下面同时添加到
          params.module = this.addsTypes;
        }
        if (this.title == "添加團隊成員") {
          // 1只读，2读写
          params.type = this.handleType;
        } else {
          /** 移除操作 */
          params.is_del = 1;
        }

        this.loading = true;
        crmSettingTeamSave(params)
          .then(res => {
            this.$message({
              type: "success",
              message: res.data
            });
            this.loading = false;
            this.handleCancel();
            this.$emit("handle", {
              type: this.title == "添加團隊成員" ? "add_user" : "delete_user"
            });
          })
          .catch(() => {
            this.loading = false;
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tips {
  color: #777;
  font-size: 12px;
  position: absolute;
  bottom: -2px;
  right: 125px;
}
.handle-box {
  color: #333;
  font-size: 12px;
}
.handle-item {
  padding-bottom: 15px;
  position: relative;
  .handle-item-name {
    flex-shrink: 0;
    width: 90px;
  }
  .handle-item-content {
    flex: 1;
  }
}
.handle-bar {
  position: relative;
  margin-top: 10px;
  height: 30px;
  button {
    float: right;
    margin-right: 10px;
  }
}
</style>
