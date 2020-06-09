<template>
  <div class="navMenu">
    <el-menu
      default-active="1"
      class="el-menu-vertical"
      @open="handleOpen"
      @close="handleClose"
      background-color="#364759"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
    >
      <el-menu-item index="/home/userlist">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>注册用户列表</span>
        </template>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-service"></i>
          <span>电话预约</span>
        </template>
        <el-menu-item index="/home/phoneAppointment/noticeSet">预约须知设置</el-menu-item>
        <el-menu-item index="/home/phoneAppointment/memberInfo">预约人员信息</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-platform"></i>
          <span>网上预约</span>
        </template>
        <el-menu-item index="/home/noticeSet">预约须知设置</el-menu-item>

        <el-menu-item index="/home/memberSet">预约人员信息</el-menu-item>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>代为祭祀</span>
        </template>
        <el-menu-item index="/home/sacrificeNoticeSet">预约须知设置</el-menu-item>
        <el-menu-item index="/home/sacrificeMemberSet">预约人员信息</el-menu-item>
      </el-submenu>

      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-mobile-phone"></i>
          <span>网上祭祀</span>
        </template>
        <el-menu-item index="/home/onlineSacrificeNoticeSet">预约须知设置</el-menu-item>
        <el-menu-item index="/home/onlineSacrificeMember">预约人员信息</el-menu-item>
      </el-submenu>

      <el-menu-item index="/home/timeSet">
        <template slot="title">
          <i class="el-icon-time"></i>
          <span>预约时间设置</span>
        </template>
      </el-menu-item>

      <el-menu-item index="/home/cemeteryAdmin">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>公墓管理</span>
        </template>
      </el-menu-item>

      <el-menu-item index="/home/followMember">
        <template slot="title">
          <i class="el-icon-postcard"></i>
          <span>人员追踪</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/home/statisticAnalysis">
        <template slot="title">
          <i class="el-icon-s-marketing
"></i>
          <span>数据统计</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/home/memberManage">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span>用户管理</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1"
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  components: {}
};
</script>

<style lang="less">
.navMenu {
  height: 100%;

  .el-menu {
    width: 200px;
  }
}
.title {
  // width: 94px;
  height: 33px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 33px;
  text-align: center;
  margin-top: 18px;
}

.el-menu {
  width: 199px;
  height: 100%;
  // background: rgba(54, 71, 89, 1);
  .el-submenu > .el-submenu__title,
  .el-menu-item {
    height: 60px;
    line-height: 60px;
    // text-align: center;
  }
}
.el-menu-item.is-active {
  background-color: #247bb4 !important;
}
</style>
