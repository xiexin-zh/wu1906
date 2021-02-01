<template>
  <a-layout-sider
    :class="[
      'sider',
      isDesktop() ? null : 'shadow',
      theme,
      fixSiderbar ? 'ant-fixed-sidemenu' : null
    ]"
    width="200px"
    :trigger="null"
  >
    <logo :slide-tag="slideTag" />
    <div class="u-fx slide-height">
      <div class="system-list">
        <ul
          :class="['slide-ul', { 'anim-ul-show': animType }]"
          @mouseover="toggleSlide(1)"
          @mouseout="toggleSlide(0)"
        >
          <li
            v-for="(app, index) in appList"
            :key="index"
            :class="['u-fx-ac', { 'active-bg': appIndex === index }]"
          >
            <div :class="['app-img u-fx-ac']">
              <img :src="app.logoUrl" alt />
            </div>
            <span @click="clickApp(app, index)">
              {{
              app.appName
              }}
            </span>
          </li>
        </ul>
      </div>
      <div class="u-fx-f1 u-fx-ver">
        <div class="current-system">{{ currentAppName }}</div>
        <div class="u-fx-f1" style="overflow: auto">
          <a-menu
            v-if="menuList.length > 0"
            mode="inline"
            :selectedKeys="menuIndex"
            @click="onClick"
            style="width: 150px"
          >
            <template v-for="menu in menuList">
              <a-menu-item
                v-if="!menu.children || menu.children.length === 0"
                :key="menu.id"
              >{{ menu.menuName }}</a-menu-item>
              <a-sub-menu v-else :key="menu.id" :title="menu.menuName">
                <a-menu-item
                  v-for="subItem in menu.children"
                  :key="subItem.id"
                >{{ subItem.menuName.split('#')[0] }}</a-menu-item>
              </a-sub-menu>
            </template>
          </a-menu>
        </div>
      </div>
    </div>
  </a-layout-sider>
</template>

<script>
import Logo from '@/components/tools/Logo'
import { mixin, mixinDevice } from '@/utils/mixin'
import { mapState, mapMutations } from 'vuex'
import { entryApp } from '../../layouts/app-menu'

export default {
  name: 'SideMenu',
  components: { Logo },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'light'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapState('home', ['isEntryApp', 'slideTag', 'appIndex', 'appList', 'currentAppName', 'menuList', 'menuIndex'])
  },
  data() {
    return {
      defaultOpenKeys: [],
      animType: 0
    }
  },
  mounted() {},
  methods: {
    ...mapMutations('home', ['setState']),
    /**
     * @description 点击左侧模块列表
     * @param { object } appInfo 模块信息
     * @param { number } index 模块索引
     * @param { function } callback 获取菜单项后的回调函数，返回初始的菜单url
     */
    clickApp(appInfo, index) {
      entryApp(appInfo, index, this, (url, key) => {
        this.$emit('goSystem', url, key)
      })
    },
    /**
     * @description 点击左侧菜单列表
     * @param { object } item 点击当前菜单项信息
     */
    onClick(item) {
      let url = null
      const { key, keyPath } = item
      // 获取当前菜单的url地址
      if (keyPath.length > 1) {
        url = this.menuList.find(item => item.id === keyPath[1]).children.find(item => item.id === keyPath[0]).menuUrl
      } else {
        url = this.menuList.find(item => item.id === keyPath[0]).menuUrl
      }
      this.$emit('goSystem', url, key)
    },
    toggleSlide(type) {
      this.animType = type
    }
  }
}
</script>
<style lang="less" scoped>
.slide-height {
  height: calc(100% - 50px);
  background-color: #fff;
  overflow: hidden;
  border-right: 1px #f5f5f5 solid;
}
.system-list {
  width: 50px;
  position: relative;
  .slide-ul {
    top: 50px;
    left: 0;
    transition: all 0.3s ease;
    position: fixed;
    z-index: 99;
    width: 50px;
    height: calc(100% - 50px);
    color: @head-fff;
    background: @head-color;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .app-img {
    width: 50px;
    height: 50px;
    img {
      margin-left: 14px;
      width: 24px;
      height: 24px;
      display: block;
    }
  }
  .active-bg {
    background-color: @u-type-primary;
  }
  .anim-ul-show {
    width: 200px;
    color: @u-content-color;
  }
  li {
    width: 200px;
    height: 50px;
    line-height: 50px;
    &:hover {
      background-color: @active-bg;
      color: #fff;
    }
    i {
      font-size: 16px;
      padding-left: 12px;
    }
    span {
      cursor: pointer;
      color: #fff;
      padding-left: 15px;
    }
  }
}
.current-system {
  height: 50px;
  padding-left: 22px;
  font-size: 16px;
  line-height: 50px;
  border-bottom: 1px #f5f5f5 solid;
}
</style>
