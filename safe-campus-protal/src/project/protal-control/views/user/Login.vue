<template>
  <div class="login">
    <div class="login-dialog">
      <a-row class="logo">全品管理后台系统</a-row>
      <a-row>
        <input type="text" v-model="loginForm.userName" placeholder="账号" />
      </a-row>
      <a-row>
        <input type="password" v-model="loginForm.passWord" placeholder="密码" />
      </a-row>
      <div class="login-btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      loginForm: {
        userName: '',
        passWord: ''
      }
    }
  },
  created () {
  },
  methods: {
    login () {
      if (this.loginForm.userName === '' || this.loginForm.passWord === '') {
        return
      }
      this.$router.push('/deviceView')
    }
  }
}
</script>

<style lang="less" scoped>
  .login {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color:#3498DB;
    .login-dialog {
      display: flex;
      flex-direction:column;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -300px;
      margin-top: -350px;
      width: 600px;
      padding: 20px 0;
      height: 380px;
      background-color:#fff;
      border-radius: 6px;
      .logo {
        font-size: 34px;
      }
      input {
        color:#333;
        text-indent: 10px;
        background-color: #ECF0F1;
        border: 2px solid transparent;
        border-radius: 3px;
        font-size: 16px;
        font-weight: 200;
        padding: 10px 0;
        width: 380px;
        transition: border .5s;
      }
      input:focus {
        border: 2px solid #3498DB;
        box-shadow: none;
      }
      .login-btn {
        cursor: pointer;
        width: 380px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        color:#fff;
        border-radius: 3px;
        background-color:#3498DB;
      }
    }
  }
</style>
