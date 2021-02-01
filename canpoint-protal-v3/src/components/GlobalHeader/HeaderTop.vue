<template>
  <div class="header-top">
    <a-row type="flex" justify="space-between" align="middle">
      <a-col style="font-size: 18px" class="u-fx-ac">
        <div>
          <a-icon
            v-if="isEntryApp"
            style="vertical-align: -0.15em; cursor: pointer; padding-right: 15px"
            :type="slideTag ? 'menu-unfold' : 'menu-fold'"
            @click="toggle"
          />
          <a-dropdown>
            <span class="select-box">
              <span>{{ loginInfo.schoolName }}</span>
              <a-icon v-if="isShow" type="caret-down" style="float: right; margin-top: 8px" />
            </span>
            <a-menu
              v-if="isShow"
              slot="overlay"
              style="background-color: #31384b; min-width: 200px"
            >
              <a-menu-item
                @click="switchSchool(list, true)"
                v-for="list in schoolList"
                :key="list.id"
                style="color: #999"
              >{{ list.schoolName }}</a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <div v-if="isEntryApp" class="console-box" @click="goConsole">控制台</div>
      </a-col>
      <a-col>
        <a-dropdown>
          <div class="u-fx-ac user-block">
            <span>{{ userInfo.userName }}</span>
            <div class="user-icon">
              <img :src="userInfo.photoUrl || userIcon" alt />
            </div>
          </div>
          <a-menu slot="overlay" style="background-color: #31384b; min-width: 120px">
            <a-menu-item @click="goConsole" key="1" style="color: #999">控制台</a-menu-item>
            <a-menu-item key="2" style="color: #999" @click="changePass">修改密码</a-menu-item>
            <a-menu-item @click="loginOut" key="3" style="color: #999">注销</a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import userIcon from '@a/img/user-icon.png'
import $http from '@u/libs/ajax-serve'
import hostEnv from '@config/host-env'
import UserMenu from '../tools/UserMenu'
const formData = [
  {
    value: 'oldPassword',
    initValue: '',
    type: 'input',
    label: '旧密码',
    placeholder: '请输入旧密码'
  },
  {
    value: 'newPassword',
    initValue: '',
    type: 'input',
    password: true,
    label: '新密码',
    placeholder: '请输入新密码'
  },
  {
    value: 'confirmPassword',
    initValue: '',
    password: true,
    type: 'input',
    label: '确认新密码',
    placeholder: '请再次输入新密码'
  }
]
export default {
  name: 'HeaderTop',
  components: {
    UserMenu
  },
  computed: {
    ...mapState('home', ['isEntryApp', 'slideTag', 'appIndex', 'loginInfo', 'schoolCode', 'userInfo', 'schoolList'])
  },
  data() {
    return {
      userIcon,
      formStatus: false,
      formData,
      isShow: (this.schoolList || []).length > 0
    }
  },
  mounted() {},
  methods: {
    ...mapMutations('home', ['setState']),
    /**
     * 多学校切换
     * @param { object } info 当前学校信息
     */
    switchSchool(info) {
      if (this.isEntryApp) {
        this.$message.warning('请先返回到控制台在进行学校切换')
        return
      }
      this.$emit('change', info)
    },
    changePass() {
      this.formStatus = true
    },
    submitForm({ oldPassword, newPassword, confirmPassword }) {
      if (newPassword !== confirmPassword) {
        this.$message.warning('两次输入的新密码不一致')
        this.$refs.form.error()
        return
      }
      const loginType = JSON.stringify({ id: '' })
      $http
        .postQuery({
          url: `${hostEnv.protal_api_11002}/userinfo/user/login/update/password`,
          params: {
            oldPassword,
            newPassword,
            userId: JSON.parse(window.sessionStorage.getItem('loginType') || loginType).id
          }
        })
        .then(res => {
          this.$refs.form.reset()
          this.$message.success('修改成功')
        })
        .catch(e => {
          this.$refs.form.error()
        })
    },
    /**
     * 返回到控制台
     * 从当前存储的菜单数据进行清空
     */
    goConsole() {
      this.setState({
        slideTag: true,
        isEntryApp: false,
        appIndex: -1,
        menuList: [],
        menuIndex: []
      })
    },
    toggle() {
      const tag = !this.slideTag
      this.setState({
        key: 'slideTag',
        data: tag
      })
    },
    loginOut() {
      this.$message.loading('注销中...', 0)
      setTimeout(() => {
        this.$message.success('注销成功')
        window.sessionStorage.clear()
        this.$tools.goNext(() => {
          if (process.env.NODE_ENV === 'production') {
            window.location.href = '/login-v3'
          } else {
            window.location.href = '/protal-login.html'
          }
        })
      }, 300)
    },
    loginOut1() {
      $http
        .postQuery({
          url: `${hostEnv.protal_api_11002}/userinfo/user/login/loginout`,
          params: {}
        })
        .then(res => {
          this.$message.success('注销成功')
          window.sessionStorage.clear()
          window.localStorage.clear()
          this.$tools.goNext(() => {
            if (process.env.NODE_ENV === 'production') {
              window.location.href = '/login'
            } else {
              window.location.href = '/protal-login.html'
            }
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.header-top {
  height: @head-h;
  padding: 0 10px;
  line-height: @head-h;
  color: @head-fff;
  width: 100%;
  background-color: @head-color;
}
.select-box {
  font-size: 14px;
  padding: 0 15px 0 15px;
  display: inline-block;
  height: 28px;
  line-height: 28px;
  border-radius: 20px;
  background-color: @active-bg;
  span {
    padding-right: 10px;
  }
}
.console-box {
  margin-top: 4px;
  margin-left: 20px;
  width: 80px;
  text-indent: 34px;
  background: url(../../assets/img/contorl-icon.png) no-repeat 10px 4px;
  background-color: @active-bg;
  background-size: 18px 18px;
  border-radius: @u-border-radius;
  height: 26px;
  line-height: 26px;
  font-size: 12px;
  cursor: pointer;
}
.user-block {
  height: 30px;
  margin-top: 6px;
}
.user-icon {
  width: 30px;
  height: 30px;
  margin: 0 10px;
  background-color: #ccc;
  overflow: hidden;
  border-radius: 100%;
  img {
    width: 30px;
    height: 30px;
    display: block;
  }
}
</style>
