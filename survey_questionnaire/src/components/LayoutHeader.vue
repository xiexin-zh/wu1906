<template>
  <div class="layout-header" v-if="!isSetting">
    <!-- <div class="headerLeft" v-if="isSetting">
      <img :src="canelIcon" alt="返回" title="返回列表" @click="routeToList" v-if="isSetting">
    </div>
    <div class="headerRight">
      <slot />
      <a class="logout" @click="logout">注销 {{ userName }}</a>
    </div>-->
    <slot />
    <!-- <a class="logout" @click="logout">注销 {{ userName }}</a> -->
    <el-dropdown class="logout" trigger="click">
      <span class="el-dropdown-link">{{ userName }}</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <a class="loginBtn" @click="userMessage">用户信息</a>
        </el-dropdown-item>
        <el-dropdown-item>
          <a class="loginBtn" @click="logout">退出</a>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="用户信息编辑"
      :visible.sync="showUserModal"
      :destroy-on-close="true"
      width="40%"
      class="editDialog"
    >
      <div class="msgBox">
        <span class="title">用户名称：</span>
        <el-input class="inputBox" v-model="username" :disabled="true"></el-input>
      </div>
      <div class="msgBox">
        <span class="title">组织单位：</span>
        <el-input class="inputBox" :disabled="!showCompany" v-model="company"></el-input>
        <span v-show="!showCompany" class="edit" @click="editMsg('company')">修改</span>
        <div v-show="showCompany" class="optionBox">
          <span class="cancel" @click="cancelMsg('company')">取消</span>
          <span class="save" @click="saveMsg('company')">保存</span>
        </div>
      </div>
      <div class="msgBox">
        <span class="title">手机号：</span>
        <el-input class="inputBox" :disabled="!showMobile" v-model="mobile"></el-input>
        <span v-show="!showMobile" class="edit" @click="editMsg('mobile')">修改</span>
        <div v-show="showMobile" class="optionBox">
          <span class="cancel" @click="cancelMsg('mobile')">取消</span>
          <span class="save" @click="saveMsg('mobile')">保存</span>
        </div>
      </div>
      <div class="msgBox">
        <span class="title">邮箱：</span>
        <el-input class="inputBox" :disabled="!showEmail" v-model="email"></el-input>
        <span v-show="!showEmail" class="edit" @click="editMsg('email')">修改</span>
        <div v-show="showEmail" class="optionBox">
          <span class="cancel" @click="cancelMsg('email')">取消</span>
          <span class="save" @click="saveMsg('email')">保存</span>
        </div>
      </div>
      <div class="msgBox">
        <span class="title">密码：</span>
        <div class="inputBox"></div>
        <span v-show="!showPwd" class="edit" @click="editMsg('pwd')">修改</span>
        <div v-show="showPwd" class="optionBox">
          <span class="cancel" @click="cancelMsg('pwd')">取消</span>
          <span class="save" @click="saveMsg('pwd')">保存</span>
        </div>
      </div>
      <div v-show="showPwd">
        <div class="msgBox">
          <span class="title">旧密码：</span>
          <el-input type="password" class="inputBox" v-model="oldPwd"></el-input>
        </div>
        <div class="msgBox">
          <span class="title">新密码：</span>
          <el-input type="password" class="inputBox" v-model="newPwd"></el-input>
        </div>
        <div class="msgBox">
          <span class="title">确认密码：</span>
          <el-input type="password" class="inputBox" v-model="comparePwd"></el-input>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import * as UserData from "@/api/admin";
import { regEmail, regPwd, regClass, regTel } from "../utils/transform";

@Component
export default class LayoutHeaderComponent extends Vue {
  private canelIcon = require("../../public/icon/cancel.png");
  private showUserModal: boolean = false;
  private username: string = "";
  private company: string = "";
  private mobile: string = "";
  private email: string = "";
  private showCompany: boolean = false;
  private showMobile: boolean = false;
  private showEmail: boolean = false;
  private showPwd: boolean = false;
  private oldPwd: string = "";
  private newPwd: string = "";
  private comparePwd: string = "";
  private oldUserData: any = {};

  get userName() {
    return UserModule.userName;
  }

  get isSetting() {
    return this.$route.meta ? this.$route.meta.isSetting || false : false;
  }

  logout() {
    UserModule.logout();
    this.$message.warning("已登出!");
    this.$router.push("/login");
  }

  routeToList() {
    this.$router.push("/list");
  }

  userMessage() {
    this.showUserModal = true;
  }

  editMsg(val: string) {
    switch (val) {
      case "company":
        this.showCompany = true;
        break;
      case "mobile":
        this.showMobile = true;
        break;
      case "email":
        this.showEmail = true;
        break;
      case "pwd":
        this.showPwd = true;
        break;
      default:
        console.log(val);
    }
  }

  cancelMsg(val: string) {
    switch (val) {
      case "company":
        this.showCompany = false;
        this.company = this.oldUserData.company;
        break;
      case "mobile":
        this.mobile = this.oldUserData.mobile;
        this.showMobile = false;
        break;
      case "email":
        this.showEmail = false;
        this.email = this.oldUserData.email;
        break;
      case "pwd":
        this.showPwd = false;
        this.oldPwd = "";
        this.newPwd = "";
        this.comparePwd = "";
        break;
      default:
        console.log(val);
    }
  }

  saveMsg(val: string) {
    switch (val) {
      case "company":
        this.saveUserMsg("10", this.company);
        break;
      case "mobile":
        this.saveUserMsg("20", this.mobile);
        break;
      case "email":
        this.saveUserMsg("30", this.email);
        break;
      case "pwd":
        this.saveUserPwd(this.oldPwd, this.newPwd, this.comparePwd);
        break;
      default:
        console.log(val);
    }
  }

  async saveUserMsg(type: string, keyword: string) {
    if (type == "10") {
      if(!keyword || keyword.trim().length == 0){
        return this.$message.error("请输入组织单位");
      }
      if (!regClass(keyword)) {
        return this.$message.error("长度限制中文25个汉字，英文50个字母");
      }
    }
    if (type == "20") {
      if (!regTel(keyword)) {
        return this.$message.error("电话号码格式错误");
      }
    }
    if (type == "30") {
      if (!regEmail(keyword)) {
        return this.$message.error("邮箱格式格式错误");
      }
    }
    const res = await UserData.saveUserMsg({
      type,
      keyword
    });
    if (res.success) {
      this.$message.success("保存成功");
      this.getUserMsg();
      this.showCompany = false;
      this.showMobile = false;
      this.showEmail = false;
    } else {
      this.$message.error("保存失败");
    }
  }

  async saveUserPwd(oldpwd: string, newpwd: string, newpwd2: string) {
    if(oldpwd.trim().length == 0){
      return this.$message.error("请输入旧密码");
    }
    if (!regPwd(newpwd)) {
      return this.$message.error("密码5-12位，包含数字或字母");
    }
    if (newpwd != newpwd2) {
      return this.$message.error("两次密码不一致");
    }
    const res = await UserData.saveUserPwd({
      oldpwd,
      newpwd,
      newpwd2
    });
    if (res.success) {
      this.oldPwd = '';
      this.newPwd = '';
      this.comparePwd = '';
      this.$message.success("保存成功");
    } else {
      this.$message.error("保存失败");
    }
  }

  async getUserMsg() {
    const res = await UserData.getUserMsg();
    if (res.success) {
      this.username = res.data.username;
      this.company = res.data.company;
      this.mobile = res.data.mobile;
      this.email = res.data.email;
      this.oldUserData = res.data;
    } else {
      this.$message.error("用户信息获取失败");
    }
  }

  mounted() {
    this.getUserMsg();
  }
}
</script>

<style lang="scss" scoped>
.layout-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

  .logout {
    float: right;
    padding-right: 30px;
    line-height: 60px;
    font-size: 16px;
    cursor: pointer;
  }
}
.loginBtn {
  display: block;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-dropdown-link:hover {
  color: blue;
}
.msgBox {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .title {
    display: block;
    width: 100px;
  }

  .inputBox {
    flex: 1;
    max-width: 300px;
  }
}
.saveMsg {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.edit {
  cursor: pointer;
  margin: 0 20px;
}
.cancel {
  cursor: pointer;
  margin: 0 20px;
}
.save {
  cursor: pointer;
}
</style>
