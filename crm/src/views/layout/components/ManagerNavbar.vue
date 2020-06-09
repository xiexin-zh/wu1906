<template>
  <div class="navbar">
    <img class="logo"
    :src="logo"
          />
    <div class="nav-title">
      系統設置
    </div>
    <div @click="enterHome"
         class="back-home">返回首頁</div>
    <div @click="enterLogin"
         class="go-out">退出系統</div>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      logo:require('../../../assets/img/set_logo.png')
    }
  },
  props: {
    navIndex: {
      type: Number,
      default: 0
    }
  },
  components: {},
  computed: {
    ...mapGetters(['logo'])
  },
  mounted() {},
  methods: {
    enterHome() {
      this.$router.replace({
        name: 'workbench'
      })
    },
    enterLogin() {
      this.$confirm('退出登錄？', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var loading = Loading.service({
            target: document.getElementById('#app')
          })
          this.$store
            .dispatch('LogOut')
            .then(() => {
              loading.close()
              this.$router.push('/login')
            })
            .catch(() => {
              loading.close()
            })
        })
        .catch(() => {})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  background: #1D1D27;

  height: 63px;
  min-height: 63px;
  display: flex;
  align-items: center;
  padding: 0 90px 0 30px;
  /* background-color: white; */
  .logo {
    width: 150px;
    height: 40px;
    display: block;
    flex-shrink: 0;
    margin-right: 60px;
  }
  .nav-title {
    flex: 1;
    font-size: 16px;
    color: #ffffff;
  }
}

.back-home {
  width: 94px;
  height: 36px;
  line-height: 36px;
  background-color: #005DF7;
  border-radius: 3px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
}

.go-out {
  width: 94px;
  height: 36px;
  line-height: 36px;
  background-color: #c2c2c2;
  border-radius: 3px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
</style>

