<template>
  <div class="home">
    <div class="header">
      <div class="header-left">预约系统</div>
      <div class="header-right">
        <!-- <el-popover placement="bottom" trigger="click" v-model="visible">
          <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
        
        </el-popover>-->
        <el-dropdown @command="loginOutFN">
          <span class="el-dropdown-link">
            <el-avatar slot="reference" class="avatar" icon="el-icon-user-solid"></el-avatar>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-switch-button">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="mainBox">
      <div class="navTab">
        <NavMenu />
      </div>
      <div class="container">
        <Main />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavMenu from "@/components/NavMenu.vue";
import Main from "@/components/Main.vue";
import { loginOut } from "../api/admin";
export default {
  name: "Home",
  components: {
    NavMenu,
    Main

    // HelloWorld
  },
  methods: {
    loginOutFN() {
      loginOut().then(res => {
        this.$message.success("退出成功");
        if (res.error == 0) {
          localStorage.setItem("JWT_TOKEN", "");
          this.$router.replace({
            path: "/login",
            query: { redirect: this.$router.currentRoute.fullPath }
          });
        }
      });
    }
  },
  data() {
    return {
      visible: false
    };
  },
  mounted() {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    if (!jwtToken) {
      this.$router.replace({
        path: "/login"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header {
  height: 72px;
  background-color: #fff;
  display: flex;
}
.header-left {
  width: 200px;
  height: 100%;
  background-color: rgb(54, 71, 89);
  color: #fff;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .avatar {
    margin-right: 20px;
  }
}
.mainBox {
  background-color: #edf0f1;
  display: flex;
  flex: 1;
}
.navTab {
  width: 200px;
  // overflow-x: hidden;
  // overflow-y: auto;
}
.container {
  flex: 1;
}
</style>
