<template>
  <div class="navMenu">
    <el-menu
      default-active="/home/overall"
      class="el-menu-vertical"
      background-color="#364759"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="iconfont groupIcon icon-gongneng"></i>
          <span class="groupTitle">功能測試報告</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/home/overall">
            <template slot="title">
              <span class="navicon iconfont icon-home"></span>
              <span :class="routeName == 'overall' ? 'navTitle navTitleColor' : 'navTitle'">總攬</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/home/follow">
            <template slot="title">
              <span class="navicon iconfont icon-analysis"></span>
              <span :class="routeName == 'follow' ? 'navTitle navTitleColor' : 'navTitle'">流量監控</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/home/cover">
            <template slot="title">
              <span class="navicon iconfont icon-fugai"></span>
              <span :class="routeName == 'cover' ? 'navTitle navTitleColor' : 'navTitle'">測試覆蓋詳情</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/home/result">
            <template slot="title">
              <span class="navicon iconfont icon-jiancejieguochaxun"></span>
              <span :class="routeName == 'result' ? 'navTitle navTitleColor' : 'navTitle'">測試結果詳情</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/home/buglist">
            <template slot="title">
              <span class="navicon iconfont icon-xiangqing"></span>
              <span :class="routeName == 'buglist' ? 'navTitle navTitleColor' : 'navTitle'">Bug 詳情</span>
            </template>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="iconfont groupIcon icon-api"></i>
          <span class="groupTitle">API 測試報告</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/home/apioverall">
            <template slot="title">
              <span class="navicon iconfont icon-home"></span>
              <span :class="routeName == 'apioverall' ? 'navTitle navTitleColor' : 'navTitle'">API 測試總攬</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/home/apiresult">
            <template slot="title">
              <span class="navicon iconfont icon-jiancejieguochaxun"></span>
              <span
                :class="routeName == 'apiresult' ? 'navTitle navTitleColor' : 'navTitle'"
              >API 測試結果詳情</span>
            </template>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: ["routeName"]
};
</script>

<style lang="scss">
.navMenu {
  // height: 100%;

  .el-submenu__icon-arrow {
    color: #fff;
  }

  .el-submenu__title{
    display: flex;
    align-items: center;
  }

  .groupIcon{
    margin-right: 10px;
    color: rgb(216, 214, 214);
    display: flex;
    align-items: center;
  }

  .groupTitle {
    font-size: 18px;
    font-weight: 500;
  }

  .navicon {
    margin-left: 10px;
    margin-right: 10px;
    color: rgb(211, 204, 204);
    font-weight: 700;
    font-size: 16px;
  }

  .navTitle {
    font-size: 14px;
    font-weight: 500;
    color: rgb(240, 236, 236);
  }
  .navTitleColor {
    color: rgb(255, 208, 75);
  }

  .el-menu {
    width: 200px;

    .el-submenu__title{
      padding-left: 10px !important;
    }

    .el-menu-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 10px !important;
    }
  }
}
</style>