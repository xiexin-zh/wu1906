<template>
  <div class="memberManage">
    <div class="box_content">
      <div class="box_box">
        <div class="header">
          <div class="btn_tag">
            <el-button @click="openDialogVisible" class="add">
              <i class="icon-add"></i>
              添加用户
            </el-button>
          </div>
          <HeadSearch :selectChange="selectChange" :options="options" :clickSerchBtn="clickSerch" />
        </div>
        <div class="content">
          <el-table :data="userlist" border style="width: 100%">
            <el-table-column width="62" align="center" type="index" label="编号"></el-table-column>
            <el-table-column align="center" prop="realname" label="姓名"></el-table-column>
            <el-table-column align="center" prop="name" label="用户名"></el-table-column>
            <el-table-column align="center" prop="idNo" label="员工编号"></el-table-column>
            <el-table-column align="center" prop="mobile" label="手机号"></el-table-column>
            <el-table-column width="240" align="center" label="操作">
              <template v-slot="{ row }">
                <el-button class="commonBtn" title="编辑" type="primary" @click="handleEdit(row)">编辑</el-button>
                <el-button class="commonBtn" title="删除" type="danger" @click="handleDel(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="listCount"
          ></el-pagination>
        </div>
      </div>
      <template>
        <el-dialog :title="isEdit?'编辑用户':'添加用户'" :visible.sync="dialogVisible" width="30%">
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
            label-position="left"
          >
            <el-form-item label="姓名" prop="realname">
              <el-input v-model="ruleForm.realname"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="员工编号" prop="idNo">
              <el-input v-model="ruleForm.idNo"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          </span>
        </el-dialog>
      </template>
    </div>
  </div>
</template>

<script>
import HeadSearch from "@/components/HeadSearch.vue";
import { memberlist, editAdmin, delAdmin } from "../../api/admin";
import { regName, regTel, regNumber, regPwd } from "../../utils/transform";
const initState = {
  realname: "",
  name: "",
  idNo: "",
  mobile: "",
  password: ""
};
export default {
  data() {
    let reNames = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("名字不能为空"));
      } else if (!regName(value)) {
        return callback(new Error("请填写正确的名字"));
      } else {
        callback();
      }
    };
    let reTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("号码不能为空"));
      } else if (!regTel(value)) {
        return callback(new Error("请输入正确的号码"));
      } else {
        callback();
      }
    };
    let reIdNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("编码不能为空"));
      } else if (!regNumber(value)) {
        return callback(new Error("请输入正确的编码"));
      } else {
        callback();
      }
    };
    let rePwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (!regPwd(value)) {
        return callback(new Error("请输入正确的密码"));
      } else {
        callback();
      }
    };
    return {
      options: [
        {
          value: "10",
          label: "姓名"
        },
        {
          value: "20",
          label: "身份证号"
        },
        {
          value: "30",
          label: "手机号"
        }
      ],
      dialogVisible: false,
      userlist: [],
      inputValue: "",
      type: "",
      pageSize: 10,
      isEdit: false,
      serchinput: "",
      ruleForm: initState,
      listCount: 0,
      adminId: "",
      currentPage: 1,
      rules: {
        realname: [
          { required: true, message: "请输入名字", trigger: "blur" },
          { validator: reNames, trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入名字", trigger: "blur" },
          { validator: reNames, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入号码", trigger: "blur" },
          { validator: reTel, trigger: "blur" }
        ],
        idNo: [
          { required: true, message: "请输入编号", trigger: "blur" },
          { validator: reIdNo, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: rePwd, trigger: "blur" }
        ]
      }
    };
  },
  components: {
    HeadSearch
  },
  methods: {
    async getMemberlist(offset, limit) {
      const res = await memberlist({
        type: this.type,
        keyword: this.serchinput,
        offset,
        limit
      });
      console.log(res);
      if (res.error == 0) {
        (this.userlist = res.data.list), (this.listCount = res.data.total);
      } else {
        this.$message.error(res.msg);
      }
    },
    openDialogVisible() {
      this.ruleForm = initState;
      this.isEdit = false;
      this.dialogVisible = true;
      this.adminId = "";
    },
    selectChange(val) {
      this.type = val;
    },
    clickSerch(val) {
      this.serchinput = val;
      this.getMemberlist(0, this.pageSize);
    },
    handleEdit(val) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.ruleForm = val;
      this.adminId = val.id;
    },
    submitForm(data) {
      this.$refs[data].validate(validate => {
        if (validate) {
          editAdmin({
            ...this.ruleForm,
            adminId: this.isEdit ? this.adminId : 0
          }).then(res => {
            if (res.error == 0) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.getMemberlist(0, this.pageSize);
              this.dialogVisible = false;
            } else {
              this.$message(res.msg);
            }
          });
        } else {
          this.$message("请填写信息");
        }
      });
    },
    handleDel(val) {
      const { id } = val;
      delAdmin({
        adminId: id
      }).then(res => {
        if (res.error == 0) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.getMemberlist(0, this.pageSize);
        } else {
          this.$message(res.msg);
        }
      });
    },
    handleCurrentChange(val) {
      this.getMemberlist((val - 1) * this.pageSize, this.pageSize);
    }
  },
  mounted() {
    this.getMemberlist(0, this.pageSize);
  }
};
</script>

<style scoped lang="less">
.memberManage {
  flex: 1;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .btn_tag {
    .add {
      background-color: #445c73;
      color: white;
      .icon-add {
        background: url("../../assets/add.png");
        height: 12px;
        width: 12px;
        display: inline-block;
      }
    }
  }
}
.content {
  margin-top: 25px;
}
.footer {
  text-align: center;
}
</style>
