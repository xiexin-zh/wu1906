<template>
  <div class="header header-com u-fx u-fx-jsb u-fx-ac">
    <div class="header-menu hidden-md-and-up u-fx-ac-jc" @click="xsShow = true">
      <img src="../assets/img/menu-icon.png" alt />
    </div>
    <img class="logo" src="../assets/img/logo.png" alt />
    <ul v-if="xsShow" class="xs-menu hidden-sm-and-up u-fx u-fx-ver">
      <li
        v-for="(menu, index) in menuList"
        :key="index"
        :class="{ act: $store.state.home.current === index }"
        @click="goMenu(menu.path, index)"
      >
        {{ menu.title }}
      </li>
      <li class="u-fx-f1" style="opacity: 0.1" @click="xsShow = false"></li>
    </ul>
    <ul class="lg-ul hidden-xs-only hidden-sm-only">
      <li
        v-for="(menu, index) in menuList"
        :key="index"
        :class="{ act: $store.state.home.current === index }"
        @click="goMenu(menu.path, index)"
      >
        {{ menu.title }}
      </li>
      <li @click="goHtml">
        <img class="go-admin" src="../assets/img/go-admin.png" alt />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      xsShow: false,
      menuList: [
        {
          path: '/',
          title: '首页',
        },
        {
          path: '/production',
          title: '产品中心',
        },
        {
          path: '/video',
          title: '视频专区',
        },
        {
          path: '/solution',
          title: '解决方案',
        },
        {
          path: '/case',
          title: '客户案例',
        },
        {
          path: '/model',
          title: '合伙人模式',
        },
        {
          path: '/news',
          title: '最新资讯',
        },
        {
          path: '/down',
          title: '资料下载',
        },
        {
          path: '/about',
          title: '关于我们',
        },
      ],
    }
  },
  methods: {
    goMenu(path, index) {
      this.$store.commit('home/SET_Data', index)
      this.xsShow = false
      this.$router.push(path)
    },
    goHtml() {
      window.open('http://canpointlive.com/login/')
    },
  },
}
</script>

<style scoped lang="scss">
.header {
  position: absolute;
  z-index: 99;
  top: 0;
  .xs-menu {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    li {
      padding-left: 20px;
      color: #fff;
      line-height: 40px;
      border-bottom: 1px #333 solid;
      background-color: #000;
    }
  }
  .go-admin {
    width: 130px;
    height: 32px;
    display: block;
  }
  .header-menu {
    width: 35px;
    height: 30px;
    position: absolute;
    z-index: 100;
    top: 12px;
    right: 15px;
    background-color: #000;
    border-radius: 4px;
    img {
      width: 22px;
      height: 20px;
      display: block;
    }
  }
  .lg-ul {
    li {
      cursor: pointer;
      font-size: 16px;
      float: left;
      color: #fff;
      margin-left: 40px;
      line-height: 32px;
      transition: all 0.3s ease;
      &:hover {
        color: #f5f5f5;
        transform: scale(1.1);
      }
    }
  }
  .act {
    color: #fef291 !important;
  }
}
</style>
