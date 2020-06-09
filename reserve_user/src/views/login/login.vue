<template>
  <div class="login-div">
    <img :src="require('../../assets/login/bg.png')" alt />
    <div class="login-home">
      <div class="login-home-icon">
        <van-icon name="arrow-left" class="login-home-icon-img" size="0.8rem" />
      </div>
      <div class="login-home-div" v-if="activeNameFlag">
        <span class="login-home-zhong">密码登录</span>
      </div>
      <div class="login-home-div" v-else-if="!activeNameFlag">
        <span class="login-home-zhong">获取验证码</span>
      </div>
    </div>
    <div class="login-img">
      <img :src="require('../../assets/login/zi.png')" class="login-img-src" alt />
      <div class="login-home-div">
        <van-tabs v-model="activeName" class="login-img-tab" color="#445C73" @click="clickActiveName">
          <van-tab class="loginTabs" title="密码登录" name="1">
            <div class="login-img-div">
              <van-cell-group>
                <van-field v-model="username" label="账号" placeholder="请输入手机号码" />
                <van-field
                  v-model="password"
                  type="password"
                  label="密码"
                  placeholder="请输入密码"
                  right-icon="warning-o"
                />
              </van-cell-group>
            </div>
          </van-tab>
          <van-tab title="验证码登录" name="2">
            <div class="login-img-div">
              <van-cell-group>
                <van-field v-model="mobile" label="手机号" placeholder="请输入手机号码" border type="number" />
                <van-field v-model="code" center clearable label="验证码" border placeholder="请输入验证码">
                  <van-button
                    slot="button"
                    size="small"
                    type="primary"
                    v-if="clickButtonFlag"
                    @click="clickButton"
                  >获取验证码</van-button>
                  <van-button
                    slot="button"
                    size="small"
                    type="primary"
                    v-else-if="!clickButtonFlag"
                  >验证码时间{{timeNum}}秒</van-button>
                </van-field>
              </van-cell-group>
            </div>
          </van-tab>
        </van-tabs>
        <span class="login-home-zhong" @click="clickBtnLogin"></span>
        <span class="login-home-right" @click="clickBtn"></span>
      </div>

      <div class="login-img-text">
        <div class="login-img-circle" @click="clickCircle" v-if="circleFlag"></div>
        <div class="login-img-circle-red" @click="clickCircle" v-else-if="!circleFlag"></div>
        <span @click="clickCircle">授权并登录后将读取您的身份信息</span>
      </div>
      <div class="login-img-button">
        <van-button class="login-button-list" @click="clickPerformTure">登录</van-button>
      </div>
      <div class="login-img-register">
        <span class="login-register-span" @click="clickRegister">立即注册</span>
      </div>
      <div class="login-img-register">
        <span class="login-register-span" @click="forgetPassword">忘记密码</span>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
/* eslint-disable */
import * as UserAction from "../../api/admin";
import { Toast } from "vant";

export default {
  name: "login",
  data() {
    return {
      activeNameFlag: true,
      code: "",
      mobile: "",
      username: "",
      password: "",
      clickButtonFlag: true,
      activeName: "1",
      loginFlag: true,
      circleFlag: true,
      timeNum: ""
    };
  },
  methods: {
    clickActiveName() {
      if (this.activeName == "1") {
        this.activeNameFlag = true;
      } else {
        this.activeNameFlag = false;
      }
    },
    async clickButton() {
      if (this.mobile !== "") {
        let params = {};
        params.mobile = this.mobile;
        params.type = "20";
        const res = await UserAction.getCode({
          ...params
        });
        if (res.error == 0) {
          Toast("验证码已发送，请注意查收");
          this.clickButtonFlag = false;
        } else {
          Toast.fail(res.msg);
        }
      } else {
        this.$toast("请填写电话号码");
      }
    },
    timeOut() {
      let num = 60;
      let timer = setInterval(() => {
        num--;
        this.timeNum = num;
        if (num == 0) {
          this.clickButtonFlag = true;
        }
      }, 1000);
    },
    forgetPassword() {
      this.$router.push({ name: "forget" });
    },
    clickBtn() {
      this.loginFlag = false;
    },
    clickBtnLogin() {
      this.loginFlag = true;
    },
    clickCircle() {
      this.circleFlag = !this.circleFlag;
    },
    clickRegister() {
      this.$router.push({
        name: "register",
        params: {
          isAuth: "0"
        }
      });
    },
    async clickPerformTure() {
      if (this.circleFlag == false) {
        if (this.activeName === "1") {
          let params = {};
          params.username = this.username;
          params.password = this.password;
          if (this.username == "" || this.password == "") {
            // Notify( "请填写账号和密码");
            this.$dialog({ message: "请填写账号或者密码" });
          } else {
            const res = await UserAction.login({
              ...params
            });
            if (res.error == 0) {
              sessionStorage.setItem("JWT_TOKEN", res.data.token);
              if (res.data.is_auth == 0) {
                Toast("请先实名认证");
                this.$router.push({
                  name: "register",
                  params: {
                    isAuth: "1"
                  }
                });
              } else {
                sessionStorage.setItem("JWT_TOKEN", res.data.token);
                Toast.success("登陆成功", 1000);
                this.$router.push({
                  name: "reserve"
                });
              }
            } else {
              Toast.fail(res.msg, 2000);
            }
          }
        } else {
          let params_a = {};
          params_a.mobile = this.mobile;
          params_a.code = this.code;
          console.log(params_a);
          if (this.mobile == "" || this.code == "") {
            // Notify( "请填写账号和密码");
            this.$dialog({ message: "请填写电话或者验证码" });
          } else {
            const res = await UserAction.loginCode({
              ...params_a
            });
            if (res.error == 0) {
              if (res.data.is_auth == 0) {
                Toast("请先实名认证");
                this.$router.push({
                  name: "register",
                  params: {
                    isAuth: "1"
                  }
                });
              } else {
                sessionStorage.setItem("JWT_TOKEN", res.data.token);
                Toast.success("登陆成功", 1000);
                this.$router.push({
                  name: "reserve"
                });
              }
            } else {
              Toast.fail(res.msg, 2000);
            }
          }
        }
      } else {
        this.$toast("请授权读取你的身份信息");
      }
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
  overflow: hidden;
  .login-home {
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: rgba(255, 255, 255, 1);
    .login-home-icon {
      display: inline-block;
      width: 0.8rem;
      padding-bottom: 10px;
      .login-home-icon-img {
        margin-top: 10px;
      }
    }
    .login-home-div {
      float: right;
      display: inline-block;
      width: 4.5333rem;
      .login-home-zhong {
        float: left;
        text-align: center;
        font-size: 0.4rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(3, 3, 3, 1);
        line-height: 60px;
      }
      .login-home-right {
        float: right;
        margin-right: 10px;
        font-size: 22px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(74, 74, 74, 1);
        line-height: 60px;
      }
    }
  }
  .login-img {
    position: absolute;
    top: 23%;
    left: 0;
    right: 0;
    .login-img-src {
      width: 80%;
      margin: 0 auto;
    }
    .login-home-div {
      width: 100%;
      margin-top: 0.8rem;

      .login-img-tab {
        // margin-bottom: 0.5333rem;
        font-size: 0.4rem;
        background-color: rgba(239, 240, 242, 0);

        .van-tabs__nav {
          background-color: rgba(239, 240, 242, 0) !important;
        }
        .login-img-div {
          margin-top: 0.5333rem;
          .van-tab {
            background-color: rgba(239, 240, 242, 1);
          }
          .van-cell {
            font-size: 0.2667rem;
            background: rgba(239, 240, 242, 1);
          }
        }
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
        border: 1px solid rgba(68, 92, 115, 1);
        border-radius: 50%;
        background-color: rgba(68, 92, 115, 1);
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
