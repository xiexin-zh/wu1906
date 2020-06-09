<template>
  <div class="login-div">
    <img :src="require('../../assets/login/bg.png')" alt />
    <div class="login-home">
      <div class="login-home-icon" @click="clickLogin">
        <van-icon name="arrow-left" class="login-home-icon-img" size="0.8rem" />
      </div>
      <div class="login-home-div">
        <span class="login-home-zhong">忘记密码</span>
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
      <div class="login-img-div" v-else-if="!loginFlag">
        <p class="replacement">重置登录密码</p>
        <van-cell-group>
          <van-field v-model="password" placeholder="6-20个字符，由字母或字母和数字组合" />
        </van-cell-group>
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
import { Toast } from "vant";
export default {
  name: "forget",
  data() {
    return {
      timeNum: "",
      clickButtonFlag: true,
      mobile: "",
      code: "",
      password: "",
      loginFlag: true,
      circleFlag: true
    };
  },
  methods: {
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
    async clickButton() {
      if (this.mobile == "") {
        this.$toast("请填写正确的电话码号");
      } else {
        let params = {};
        params.mobile = this.mobile;
        params.type = "30";
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
    clickPerform() {
      if (this.mobile == "" || this.code == "") {
        this.$toast("请填写正确的电话码号和验证码");
      } else {
        this.loginFlag = false;
      }
    },
    clickCircle() {
      this.circleFlag = !this.circleFlag;
    },
    async clickPerformTure() {
      if (this.password == "") {
        this.$toast("请填写正确的密码");
      } else {
        let params = {};
        params.mobile = this.mobile;
        params.code = this.code;
        params.password = this.password;

        const res = await AdminAction.editPwd({
          ...params
        });

        if (res.error == 0) {
          this.$toast.success(res.msg);
          this.$router.push({
            name: "login"
          });
        } else {
          this.$toast.fail(res.msg);
        }
      }
    },
    clickLogin() {
      this.$router.push({ name: "login" });
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
      margin-top: 1.3333rem;
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