<template>
  <div class="header-top">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      title="修改密码"
      v-model="formStatus"
      :form-data="formData"
    ></submit-form>
    <a-row type="flex" justify="space-between">
      <a-col style="font-size: 18px">
        <a-icon
          v-if="isEntryApp"
          style="vertical-align: -0.15em; cursor: pointer; padding-right: 15px"
          :type="slideTag ? 'menu-unfold' : 'menu-fold'"
          @click="toggle"
        />
        <a-dropdown>
          <span class="select-box">
            <span>{{ currentName }}</span>
            <a-icon
              v-if="this.schoolList.length > 1"
              type="caret-down"
              style="float: right; margin-top: 6px"
            />
          </span>
          <a-menu
            v-if="this.schoolList.length > 1"
            slot="overlay"
            style="background-color: #31384b; min-width: 200px"
          >
            <a-menu-item
              @click="switchSchool(index, true)"
              v-for="(list, index) in schoolList"
              :key="list.id"
              style="color: #999"
              >{{ list.schoolName }}</a-menu-item
            >
          </a-menu>
        </a-dropdown>
      </a-col>
      <a-col>
        <a-dropdown>
          <div class="qui-fx-ac user-block">
            <span>{{ userName }}</span>
            <div class="user-icon">
              <img :src="userPic" alt />
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
import eventBus from '@u/eventBus'
import { mapState, mapMutations } from 'vuex'
import SubmitForm from '@c/SubmitForm'
import userIcon from '@a/img/user-icon.png'
import $ajax from '@u/ajax-serve'
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
    UserMenu,
    SubmitForm
  },
  computed: {
    ...mapState('home', ['isEntryApp', 'slideTag', 'appIndex'])
  },
  data() {
    const loginInfo = JSON.parse(window.sessionStorage.getItem('loginType') || JSON.stringify({}))
    return {
      formStatus: false,
      formData,
      schoolList: [
        {
          schoolName: '平安智慧校园云平台',
          schoolCode: ''
        }
      ],
      userName: loginInfo.userName || '管理员',
      userPic: loginInfo.photoUrl || userIcon,
      currentName: window.sessionStorage.getItem('currentName') || '平安智慧校园云平台'
    }
  },
  mounted() {},
  methods: {
    ...mapMutations('home', ['updateState']),
    // 绑定学校
    bindSchool(data) {
      this.schoolList = data
      this.switchSchool(0)
    },
    // 切换学校
    switchSchool(index, tag = false) {
      if (this.isEntryApp && !tag) {
        return
      }
      if (this.isEntryApp) {
        this.goConsole()
      }
      const { id } = JSON.parse(window.sessionStorage.getItem('loginType'))
      const userType = JSON.parse(window.sessionStorage.getItem('loginType')).userTypes[index]
        .userType
      window.sessionStorage.setItem('currentName', this.schoolList[index].schoolName)
      this.currentName = window.sessionStorage.getItem('currentName')
      window.sessionStorage.setItem('loginInfo', JSON.stringify(this.schoolList[index]))
      eventBus.$emit('login')
      this.$emit('changeMenu', this.schoolList[index].schoolCode, userType, id)
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
      $ajax
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
    goConsole() {
      this.updateState({
        key: 'slideTag',
        data: true
      })
      this.updateState({
        key: 'isEntryApp',
        data: false
      })
      this.updateState({
        key: 'appIndex',
        data: -1
      })
    },
    toggle() {
      const tag = !this.slideTag
      this.updateState({
        key: 'slideTag',
        data: tag
      })
    },
    loginOut() {
      const { userCode, schoolCode } = JSON.parse(
        window.sessionStorage.getItem('loginInfo') || JSON.stringify({})
      )
      $ajax
        .postQuery({
          url: `${hostEnv.protal_api_11002}/userinfo/user/login/loginout`,
          params: {
            schoolCode,
            userCode
          }
        })
        .then(res => {
          this.$message.success('注销成功')
          window.sessionStorage.clear()
          window.localStorage.clear()
          this.$tools.goNext(() => {
            if (process.env.NODE_ENV === 'production') {
              window.location.href = '/login'
            } else {
              window.location.href = './protal-login.html'
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
  font-size: 16px;
  padding: 0 15px 0 15px;
  display: inline-block;
  height: 28px;
  line-height: 28px;
  border-radius: 20px;
  background-color: #31384b;
  span {
    padding-right: 10px;
  }
}
.user-block {
  height: 30px;
  margin-top: 10px;
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
