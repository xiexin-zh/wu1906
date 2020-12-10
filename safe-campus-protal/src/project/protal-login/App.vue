<template>
  <div class="protal-login" :style="{ ...styles }">
    <div class="protal-logo" style="cursor: pointer" @click="goSite">
      <img :src="logoUrl" alt />
    </div>
    <div class="dialog-show">
      <div class="dialog-info">
        <div class="font1">
          <span>铸/造/平/安/校/园</span> <span style="padding-left: 20px">创/新/智/慧/教/育</span>
        </div>
        <div class="font2">扫描二维码，了解更多详情~</div>
      </div>
      <div class="protal-dialog">
        <div class="title">{{ title }}</div>
        <div class="protal-box">
          <a-tabs v-model="autoKey">
            <a-tab-pane tab="密码登录" key="1">
              <div class="padd">
                <div class="tip-error">
                  <img v-if="tipLogin" :src="tipError" alt />
                  {{ tipLogin }}
                </div>
                <div class="input-text" style="margin-top: 28px">
                  <a-input @change="tipLogin = ''" placeholder="请输入账号" v-model="userName">
                    <img slot="addonBefore" src="./img/user.png" alt />
                  </a-input>
                </div>
                <div class="input-text">
                  <a-input
                    type="password"
                    @change="tipLogin = ''"
                    placeholder="请输入密码"
                    v-model="userPass"
                  >
                    <img slot="addonBefore" src="./img/pwd.png" alt />
                  </a-input>
                </div>
                <a-button
                  class="login-btn"
                  type="primary"
                  @click="accountLogin"
                  :loading="loadingOne"
                >
                  {{ loginText }}
                </a-button>
                <a-row style="margin-top: 30px">
                  <a-col :span="12" style="text-align: left">
                    <a-checkbox :checked="isCheck" @change="onChange">记住账号</a-checkbox>
                  </a-col>
                  <a-col :span="12" style="text-align: right"></a-col>
                </a-row>
              </div>
            </a-tab-pane>
            <a-tab-pane tab="验证码登录" key="2">
              <div class="padd">
                <div class="tip-error">
                  <img v-if="tipMsg" :src="tipError" alt />
                  {{ tipMsg }}
                </div>
                <div class="input-text" style="margin-top: 28px">
                  <a-input @change="tipMsg = ''" placeholder="请输入手机号" v-model="phoneNum">
                    <img
                      slot="addonBefore"
                      src="./img/phone.png"
                      style="width: 16px; height: 16px"
                      alt
                    />
                  </a-input>
                </div>
                <div class="input-text">
                  <a-row>
                    <a-col :span="16">
                      <a-input @change="tipMsg = ''" placeholder="请输入验证码" v-model="phoneCode">
                        <img slot="addonBefore" src="./img/pwd.png" alt />
                      </a-input>
                    </a-col>
                    <a-col :span="8">
                      <a-button
                        class="yzm-btn"
                        :disabled="yzmTag"
                        :loading="yzmLoad"
                        @click="getYzm"
                        >{{ yzmText }}</a-button
                      >
                    </a-col>
                  </a-row>
                </div>
                <a-button
                  class="login-btn"
                  type="primary"
                  @click="msgLogin"
                  :loading="loadingTwo"
                  >{{ loginText }}</a-button
                >
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>

    <div class="footer" v-if="isFooter">
      Copyright © 2018—2019 武汉全品教育科技有限公司版权所有
      <a href="http://www.beian.miit.gov.cn/" target="_blank">京ICP备15050178号-2</a>
    </div>
  </div>
</template>
<script>
import logo from './img/logo.png'
import logoCommon from './img/logo-hushan.png'
import $ajax from '@u/ajax-serve'
import tipError from './img/tip.png'
import hostEnv from '@config/host-env'
export default {
  name: 'App',
  components: {},
  data() {
    const imgUrl = process.env.VUE_APP_URL === 'prod' ? 'login-big.png' : 'login-big.png'
    return {
      styles: {
        background: 'url(' + require('./img/' + imgUrl) + ') no-repeat center center',
        backgroundSize: '100% 100%'
      },
      logoUrl: process.env.VUE_APP_URL === 'prod' ? logo : logoCommon,
      isFooter: false,
      title: '平安智慧校园云平台',
      tipError,
      tipLogin: '',
      tipMsg: '',
      userName: '',
      userPass: '',
      phoneNum: '',
      phoneCode: '',
      loginText: '登录',
      loadingOne: false,
      loadingTwo: false,
      autoKey: '1',
      yzmTag: false,
      yzmLoad: false,
      yzmText: '获取验证码',
      isCheck: false
    }
  },
  created() {
    document.onkeydown = () => {
      const key = window.event.keyCode
      if (key === 13) {
        if (this.autoKey === '1') {
          this.accountLogin()
        } else {
          this.msgLogin()
        }
      }
    }
  },
  mounted() {
    this.ConfigEnv = process.env.NODE_ENV
    if (process.env.VUE_APP_URL === 'prod') {
      this.isFooter = true
      this.title = '全品平安校园云平台'
    }
    const rememberInfo = window.localStorage.getItem('isRemember')
    if (rememberInfo) {
      this.userName = JSON.parse(rememberInfo).userName
      this.isCheck = true
    } else {
      this.isCheck = false
    }
  },
  methods: {
    goSite() {
      window.open('http://canpointlive.com')
    },
    changePass(event) {
      this.tipLogin = ''
    },
    getYzm() {
      if (this.phoneNum === '' || !/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.phoneNum)) {
        this.tipMsg = '请输入正确手机号'
        return
      }
      this.yzmTag = true
      this.yzmLoad = true
      this.yzmText = '发送中...'
      $ajax
        .get(
          {
            url: `${hostEnv.protal_api_11002}/userinfo/user/login/mobile`,
            params: {
              mobile: this.phoneNum
            }
          },
          false
        )
        .then(res => {
          this.yzmLoad = false
          this.$message.success('验证码发送成功')
          let total = 90
          this.yzmText = `已发送 (${total}s)`
          this.timer = setInterval(() => {
            if (total <= 1) {
              this.yzmTag = false
              clearInterval(this.timer)
              this.yzmText = '获取验证码'
              return
            }
            this.yzmText = `已发送 (${total--}s)`
          }, 1000)
        })
        .catch(res => {
          this.yzmLoad = false
          this.yzmTag = false
          this.yzmText = '获取验证码'
        })
    },
    msgLogin() {
      if (this.phoneNum === '' || !/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.phoneNum)) {
        this.tipMsg = '请输入正确手机号'
        return
      }
      if (this.phoneCode === '') {
        this.tipMsg = '请输入验证码'
        return
      }
      this.loadingTwo = true
      this.loginText = '登录中...'
      try {
        $ajax
          .postQuery(
            {
              url: `${hostEnv.protal_api_11002}/userinfo/user/login/mobile`,
              params: {
                mobile: this.phoneNum.trim(),
                captchaCode: this.phoneCode.trim()
              }
            },
            false
          )
          .then(res => {
            this.loadingTwo = false
            this.loginText = '登录成功'
            window.sessionStorage.removeItem('protal-entry')
            window.sessionStorage.setItem('loginType', JSON.stringify(res.data))
            setTimeout(() => {
              if (this.ConfigEnv === 'development') {
                window.location.href = './protal-entry.html'
              } else {
                window.location.href = '/home'
              }
            }, 300)
          })
          .catch(res => {
            this.loadingTwo = false
            this.loginText = '登录'
          })
      } catch (err) {
        this.loadingTwo = false
        this.loginText = '登录'
      }
    },
    accountLogin() {
      if (this.userName === '') {
        this.tipLogin = '请输入账号'
        return
      }
      if (this.userPass === '') {
        this.tipLogin = '请输入密码'
        return
      }
      this.loginText = '登录中...'
      this.loadingOne = true
      try {
        $ajax
          .postQuery(
            {
              url: `${hostEnv.protal_api_11002}/userinfo/user/login/password`,
              params: {
                userName: this.userName.trim(),
                password: this.userPass.trim()
              }
            },
            false
          )
          .then(res => {
            this.loadingOne = false
            this.loginText = '登录成功'
            if (this.isCheck) {
              window.localStorage.setItem('isRemember', JSON.stringify({ userName: this.userName }))
            } else {
              window.localStorage.removeItem('isRemember')
            }
            window.sessionStorage.removeItem('protal-entry')
            window.sessionStorage.setItem('loginType', JSON.stringify(res.data))
            setTimeout(() => {
              if (this.ConfigEnv === 'development') {
                window.location.href = './protal-entry.html'
              } else {
                window.location.href = '/home'
              }
            }, 300)
          })
          .catch(e => {
            this.loadingOne = false
            this.loginText = '登录'
          })
      } catch (err) {
        this.loadingOne = false
        this.loginText = '登录'
      }
    },
    onChange(event) {
      this.isCheck = event.target.checked
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes move {
  0% {
    right: -30%;
  }
  100% {
    right: 8%;
  }
}
@keyframes big {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.dialog-show {
  z-index: 999;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -365px;
  margin-left: -700px;
  width: 1400px;
  height: 730px;
  background: url(./img/login-center.png) no-repeat;
  background-size: contain;
}
.dialog-info {
  letter-spacing: 3px;
  padding-top: 120px;
  width: 790px;
  text-align: center;
  color: #fff;
  .font1 {
    font-size: 24px;
  }
  .font2 {
    padding-top: 20px;
    font-size: 16px;
  }
}
.protal-login {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  z-index: 99;
  .protal-logo {
    animation: big 1s linear;
    transform: scale(1);
    position: absolute;
    left: 80px;
    top: 50px;
    width: 138px;
    height: 37px;
    z-index: 88;
    img {
      width: 138px;
      height: 37px;
      display: block;
    }
  }
  /deep/ .ant-tabs-nav-container {
    font-size: 16px !important;
  }
  /deep/ .ant-input {
    height: 38px !important;
  }
  .protal-dialog {
    animation: move 1s ease;
    right: 8%;
    position: absolute;
    z-index: 99;
    top: 25%;
    width: 400px;
    height: 460px;
    text-align: center;
    .title {
      height: 50px;
      color: @u-type-primary;
      font-size: 32px;
      font-weight: 600;
      letter-spacing: 6px;
    }
    .padd {
      margin: 0px 30px;
    }
    .input-text {
      padding: 3px;
      margin-top: 25px;
      border-radius: 4px;
    }
    .protal-box {
      border-radius: 10px;
      margin-top: 30px;
      height: 380px;
      background-color: #fff;
    }
  }
  .tip-error {
    color: #ac2c1d;
    position: absolute;
    margin-top: -30px;
    margin-left: 10px;
    img {
      margin-top: -4px;
      margin-right: 2px;
      width: 24px;
      height: 24px;
    }
  }
  .login-btn {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);
    background: linear-gradient(270deg, #4d4cac, #4d4cac);
    height: 45px;
    border-radius: 20px;
    line-height: 45px;
    width: 100%;
    margin-top: 40px;
  }
  .yzm-btn {
    background-color: #4d4cac;
    color: #fff;
    height: 36px;
  }
}
.footer {
  position: fixed;
  height: 40px;
  line-height: 40px;
  z-index: 99;
  bottom: 0px;
  width: 100%;
  left: 0px;
  font-size: 12px;
  color: #999;
  text-align: center;
  a {
    color: #666;
    padding-left: 10px;
  }
}
</style>
