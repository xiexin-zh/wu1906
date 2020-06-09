<template>
  <div class="wrapper">
    <!-- <div class="left">
      <div class="left-pic" />
    </div> -->
    <div class="right">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title">卓越智視CRM系統</div>
        <el-form-item prop="username">
          <el-input
            ref="name"
            v-model="loginForm.username"
            autofocus="autofocus"
            name="username"
            type="text"
            auto-complete="on"
            placeholder="請輸入用戶名"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            name="password"
            auto-complete="on"
            placeholder="請輸入密碼"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            @click.native.prevent="handleLogin"
            class="submit-btn"
            >登錄</el-button
          >
        </el-form-item>
      </el-form>
      <div class="copyright">
        <a>v1.0</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Lockr from "lockr";
import { Loading } from "element-ui";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("請輸入賬號"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密碼不能小於5位"));
      } else {
        callback();
      }
    };
    return {
      // logo:require('../../assets/img/set_logo.png'),
      loginForm: {
        username: "18888888888",
        password: "123456"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      redirect: undefined,
      remember: false
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  computed: {
    // ...mapGetters(['logo', 'name'])
  },
  mounted() {},
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(res => {
              this.loading = false;
              // this.$router.push('/workbench/index');
              this.$router.push("/crm/workbench");
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    getUrlKey(name) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            location.href
          ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },
    doLogin() {
      this.loading = true;
      this.$store
        .dispatch("Login", this.loginForm)
        .then(res => {
          this.loading = false;
          this.$router.push("/crm/workbench");
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
$dark_gray: #ccc;
$light_gray: #333;
$login_theme: #00aaee;

/deep/ input {
  border: 0 none;
  background-color: white;
  -webkit-appearance: none;
  &:-webkit-autofill {
    background-image: none;
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: $light_gray !important;
  }
}
/deep/ .el-input__inner {
  height: 40px;
  padding: 0 12px;
  color: #fff;
  font-size: 16px;
  background-color: rgba(218, 226, 237, 0.5);
}
/deep/ .el-form-item__error {
  left: 12px;
}

.wrapper {
  position: relative;
  width: 100%;
  min-width: 1300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("../../assets/img/login/timg-5.jpg") no-repeat center;

  .left {
    width: 68%;
    .left-pic {
      width: 100%;
      height: 100%;
      // background: url("../../assets/img/login/timg-3.jpg") no-repeat center;
      background-size: cover;
      /* background: #000000; */
    }
  }
  .right {
    position: relative;
    width: 32%;
    // background-color: #fff;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-bottom: 20%;
    .el-form {
      width: 60%;
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0 auto 50px;
        text-align: center;
        padding: 10px 0;
        background-color: rgba(218, 226, 237, 0.5);
        border-radius: 3px;
      }
      .submit-btn {
        width: 100%;
        line-height: 1;
        font-size: 24px;
        color: #36485e;
        font-weight: bold;
        border-radius: 3px;
        background-color: rgba(218, 226, 237, 0.5);
        display: block;
      }
      .el-button {
        border: 0 none;
      }
      .action-control {
        color: #999;
        /deep/ .el-checkbox {
          .el-checkbox__label {
            color: #999;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: $login_theme;
            border-color: $login_theme;
          }
        }

        .forget {
          cursor: pointer;
          float: right;
        }
      }
    }

    .register {
      width: 70%;
      padding-top: 30px;
      color: $light_gray;
      border-top: 1px solid #e6e6e6;
      text-align: center;
      margin-top: 28px;
      .register-btn {
        color: $login_theme;
        cursor: pointer;
      }
    }

    .copyright {
      width: 92%;
      position: absolute;
      bottom: 2%;
      color: #d0d0d0;
      font-size: 12px;
      text-align: center;
      line-height: 1.5;
    }
  }

  /* .logo {
    position: absolute;
    left: 60px;
    top: 50px;
    width: 180px;
    height: 48px;
    z-index: 200;
  } */
}
</style>
