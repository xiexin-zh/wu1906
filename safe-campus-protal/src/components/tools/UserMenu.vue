<template>
  <div class="user-wrapper">
    <a-modal
      title="修改密码"
      v-model="passTag"
      @ok="modifyPass"
    >
      <a-form :form="form">
        <a-form-item
          label="原始密码"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input
            v-decorator="[
              'oldPass',
              {rules: [{ required: true, message: '请输入原始密码' }]}
            ]"
            placeholder="请输入原始密码"
          />
        </a-form-item>
        <a-form-item
          label="新密码"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input
            v-decorator="[
              'newPass',
              {rules: [{ required: true, message: '请输入新密码' }]}
            ]"
            placeholder="请输入新密码"
          />
        </a-form-item>
        <a-form-item
          label="确认密码"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input
            v-decorator="[
              'confirmPass',
              {rules: [{ required: true, message: '请再次输入新密码' }]}
            ]"
            placeholder="请再次输入新密码"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <div class="content-box">
      <a-dropdown>
        <div class="action ant-dropdown-link user-dropdown-menu">
          <div class="user-name" style="float: left">{{ userInfo.userName }}</div>
          <div style="float: left" class="person-img">
            <img :src="userInfo.photoSrc" alt="">
          </div>
        </div>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="1">
            <a href="javascript:;">
              <a-icon type="home" />
              <span>个人中心</span>
            </a>
          </a-menu-item>
          <a-menu-item key="2">
            <a href="javascript:;" @click="passTag = true">
              <a-icon type="unlock" />
              <span>修改密码</span>
            </a>
          </a-menu-item>
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="poweroff" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserMenu',
  components: {
  },
  computed: {
    ...mapState('home', [
      'userInfo'
    ])
  },
  data () {
    return {
      passTag: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    modifyPass (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
        }
      })
    },
    handleLogout () {
      const _self = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          _self.$router.replace('/')
        },
        onCancel () {
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .user-name {
    color: @des-color;
  }
  .person-img {
    width: 32px;
    height: 32px;
    margin-top: 9px;
    border-radius: 100%;
    background-color:#ccc;
    margin-left: 10px;
    img {
      display: block;
      border-radius: 100%;
      width: 32px;
      height: 32px;
    }
  }

</style>
