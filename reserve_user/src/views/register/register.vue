<template>
  <div class="login-div">
    <img :src="require('../../assets/login/bg.png')" alt />
    <div class="login-home">
      <div class="login-home-icon" @click="clickLogin">
        <van-icon name="arrow-left" class="login-home-icon-img" size="0.8rem" />
      </div>
      <div class="login-home-div">
        <span class="login-home-zhong">{{title}}</span>
      </div>
    </div>
    <div class="login-img">
      <img :src="require('../../assets/login/zi.png')" class="login-img-src" alt />
      <div class="login-img-div" v-if="loginFlag">
        <van-cell-group>
          <van-field v-model="mobile" label="手机号" placeholder="请输入手机号码" />
          <van-field v-model="code" label="验证码" placeholder="请输入验证码">
            <van-button
              slot="button"
              size="small"
              type="primary"
              v-if="clickButtonFlag"
              @click="clickButtoNumn"
            >获取验证码</van-button>
            <van-button
              slot="button"
              size="small"
              type="primary"
              v-else-if="!clickButtonFlag"
            >验证码时间{{timeNum}}秒</van-button>
          </van-field>
          <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" right-icon="warning-o" />
        </van-cell-group>
      </div>
      <div class="login-img-div" v-else-if="!loginFlag">
        <van-cell-group>
          <van-field v-model="name" label="姓名" placeholder="请输入姓名" />
          <van-field v-model="account" label="身份证号" placeholder="请输入身份证号" />
        </van-cell-group>
      </div>
      <div class="login-img-text">
        <div class="login-img-circle" @click="clickCircle" v-if="circleFlag"></div>
        <div class="login-img-circle-red" @click="clickCircle" v-else-if="!circleFlag"></div>
        <span @click="clickCircle">授权并登录后将读取您的身份信息</span>
      </div>
      <div class="login-img-button">
        <van-button class="login-button-list" @click="clickPerform" v-if="loginFlag">下一步</van-button>
        <van-button class="login-button-list" @click="clickPerformTure" v-else-if="!loginFlag">完成</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as AdminAction from "../../api/admin";
import { regIdCard } from "../../utils/transform";
import { Toast } from "vant";
export default {
  name: "register",
  data() {
    return {
      mobile: "",
      password: "",
      code: "",
      name: "",
      loginFlag: true,
      circleFlag: true,
      clickButtonFlag: true,
      timeNum: "",
      account: "",
      title: "注册"
    };
  },
  methods: {
    async clickButtoNumn() {
      if (this.mobile == "") {
        this.$toast("请填写正确的电话号码");
      } else {
        let params = {};
        params.mobile = this.mobile;
        params.type = "10";
        const res = await AdminAction.getCode({
          ...params
        });
        if (res.error == 0) {
          Toast("验证码已发送，请注意查收");
        } else {
          Toast.fail(res.msg);
        }
      }
    },
    async clickPerform() {
      if (this.circleFlag == false) {
        if (this.code == "" || this.mobile == "" || this.password == "") {
          this.$toast("电话号码，密码或者验证码不正确");
        } else {
          let params = {};
          params.code = this.code;
          params.mobile = this.mobile;
          params.password = this.password;
          const res = await AdminAction.register({
            ...params
          });
          if (res.error == 0) {
            this.loginFlag = false;
            sessionStorage.setItem("JWT_TOKEN", res.data.token);
            // Toast.success("注册成功");
            // this.$router.push({
            //   name: "login"
            // });
          } else {
            Toast.fail(res.msg);
          }
          // this.loginFlag = false;
        }
      }
    },
    clickCircle() {
      this.circleFlag = !this.circleFlag;
    },
    async clickPerformTure() {
      if (this.name.trim().length == 0) {
        return Toast.fail("请填写姓名");
      }
      if (!regIdCard(this.account)) {
        return Toast.fail("身份证号码格式错误");
      }
      const res = await AdminAction.certification({
        realname: this.name,
        idcardno: this.account
      });
      if (res.error == 0) {
        Toast.success("验证成功，请重新登陆");
        sessionStorage.setItem("JWT_TOKEN", "");
        this.$router.push({ name: "login" });
      } else {
        Toast.fail(res.msg);
      }
    },
    clickLogin() {
      this.$router.push({ name: "login" });
    }
  },
  mounted() {
    if (this.$route.params.isAuth == "0") {
      this.loginFlag = true;
      this.title = "注册";
    } else {
      this.loginFlag = false;
      this.title = "实名认证";
    }
  },
  beforeDestroy() {
    // 清楚定时器
    clearInterval(this.timeOut);
  }
};
</script>

<style scoped lang="scss">
.login-div {
  position: relative;
  width: 100%;
  .login-home {
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: rgba(255, 255, 255, 1);
    .login-home-icon {
      display: inline-block;
      widows: 50%;
      padding-bottom: 10px;
      .login-home-icon-img {
        margin-top: 10px;
      }
    }
    .login-home-div {
      display: inline-block;
      float: right;
      width: 58%;
      .login-home-zhong {
        font-size: 27px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(3, 3, 3, 1);
        line-height: 60px;
      }
    }
  }
  .login-img {
    position: absolute;
    top: 23%;
    left: 0;
    .login-img-src {
      width: 80%;
      margin: 0 auto;
    }
    .login-img-div {
      margin-top: 60px;
      .van-cell {
        background: rgba(239, 240, 242, 1);
      }
    }
    .login-img-text {
      height: 60px;
      line-height: 60px;
      .login-img-circle {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin: 10px 5px 0;
        border: 1px solid rgba(151, 151, 151, 1);
        border-radius: 50%;
      }
      .login-img-circle-red {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin: 10px 5px 0;
        border: 1px solid red;
        border-radius: 50%;
        background-color: red;
      }
    }
    .login-img-button {
      width: 100%;
      margin-left: 7.5%;
      .login-button-list {
        margin: 0;
        padding: 0;
        border: 1px solid transparent; //自定义边框
        outline: none;
        width: 85%;
        height: 60px;
        font-size: 20px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        background: rgba(68, 92, 115, 1);
        border-radius: 40px;
      }
    }
    .login-img-register {
      width: 100%;
      height: 60px;
      line-height: 60px;
      margin-left: 42%;
      .login-register-span {
        width: 26%;
        font-weight: 400;
        color: rgba(74, 74, 74, 1);
        background-color: "";
      }
    }
  }
}
</style>