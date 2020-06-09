<template>
  <div class="addForm">
    <el-form
      ref="addUser"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="80px"
      class="form"
    >
      <el-form-item label="姓名" prop="u_name">
        <el-input v-model="form.u_name"></el-input>
      </el-form-item>
      <el-form-item label="编号" prop="u_number">
        <el-input v-model="form.u_number"></el-input>
      </el-form-item>
      <el-form-item label="组织单位" prop="u_class">
        <el-input v-model="form.u_class"></el-input>
      </el-form-item>
      <el-form-item label="出生日期" prop="u_birthday">
        <el-input v-model="form.u_birthday" placeholder="格式：1995-1-12"></el-input>
      </el-form-item>
      <el-form-item label="民族" prop="u_nation">
        <el-input v-model="form.u_nation"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="u_mobile">
        <el-input v-model="form.u_mobile"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="u_identity">
        <el-input v-model="form.u_identity"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="u_sex">
        <el-radio-group v-model="form.u_sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="访问码" prop="u_visitcode">
        <el-input v-model="form.u_visitcode"></el-input>
      </el-form-item>
    </el-form>
    <div class="footerBtn">
      <el-button @click="cancelSave">取 消</el-button>
      <el-button type="primary" @click="submit('addUser')">确定</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as userData from "@/api/user";
import {
  getLength,
  regTel,
  regNumber,
  regClass,
  regBirthday,
  regIdCard,
  regCode
} from "@/utils/transform";

export default {
  props: ["rowId"],
  data() {
    const validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (getLength(value) > 20) {
        callback(new Error("长度:中文10个字，英文20个字母"));
      } else {
        callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入编号"));
      } else if (!regNumber(value)) {
        callback(new Error("长度:1-10位，包含汉字、字母、下划线 _ 或连接符 -"));
      } else {
        callback();
      }
    };
    const validateClass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入组织单位"));
      } else if (getLength(value) > 50 || !regClass(value)) {
        callback(new Error("长度限制中文25个汉字，英文50个字母"));
      } else {
        callback();
      }
    };
    const validateBirthday = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入生日"));
      } else if (!regBirthday(value)) {
        callback(new Error("请输入正确的日期"));
      } else {
        callback();
      }
    };
    const validateNation = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入民族"));
      } else {
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!regTel(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    const validateIdentity = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证号"));
      } else if (!regIdCard(value)) {
        callback(new Error("身份证号码格式错误"));
      } else {
        callback();
      }
    };
    const validateVisitcode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入访问码"));
      }else if(!regCode(value)){
        callback(new Error("长度6位，由数字或大写字母组成"));
      } else {
        callback();
      }
    };
    return {
      form: {
        u_number: "",
        u_identity: "",
        u_name: "",
        u_nation: "",
        u_birthday: "",
        u_sex: "男",
        u_class: "",
        u_mobile: "",
        u_visitcode: ""
      },
      rules: {
        u_name: [{ required: true, validator: validateName, trigger: "blur" }],
        u_number: [
          { required: true, validator: validateNumber, trigger: "blur" }
        ],
        u_class: [
          { required: true, validator: validateClass, trigger: "blur" }
        ],
        u_birthday: [
          { required: true, validator: validateBirthday, trigger: "blur" }
        ],
        u_nation: [
          { required: true, validator: validateNation, trigger: "blur" }
        ],
        u_mobile: [
          { required: true, validator: validateMobile, trigger: "blur" }
        ],
        u_identity: [
          { required: true, validator: validateIdentity, trigger: "blur" }
        ],
        u_visitcode: [
          { required: true, validator: validateVisitcode, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit(addUser) {
      const _this = this;
      this.$refs[addUser].validate(valid => {
        if (valid) {
          _this.addUserData();
        } else {
          return false;
        }
      });
    },
    async addUserData() {
      const res = await userData.addPublishUser({
        surveyId: this.rowId,
        u_name: this.form.u_name,
        u_sex: this.form.u_sex == "男" ? 0 : 1,
        u_class: this.form.u_class,
        u_number: this.form.u_number,
        u_birthday: this.form.u_birthday,
        u_identity: this.form.u_identity,
        u_nation: this.form.u_nation,
        u_mobile: this.form.u_mobile,
        u_visitcode: this.form.u_visitcode,
        u_id: "0"
      });
      if (res.success) {
        this.$message.success("添加成功");
        this.$emit("cancelClick", true);
      } else {
        this.$message.error("添加失败");
      }
    },
    cancelSave() {
      this.$emit("cancelClick", false);
    }
  }
};
</script>

<style scoped>
.addForm {
}
.footerBtn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
