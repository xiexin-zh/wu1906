<template>
  <a-layout-sider
    :class="[
      'sider',
      isDesktop() ? null : 'shadow',
      theme,
      fixSiderbar ? 'ant-fixed-sidemenu' : null
    ]"
    width="240px"
    :trigger="null"
  >
    <logo :slide-tag="slideTag" />
    <div class="qui-fx slide-height">
      <div class="system-list">
        <ul
          :class="['slide-ul', { 'anim-ul-show': animType }]"
          @mouseover="toggleSlide(1)"
          @mouseout="toggleSlide(0)"
        >
          <li
            v-for="(module, index) in menuList"
            :key="index"
            :class="['qui-fx-ac', { 'active-bg': appIndex === index }]"
          >
            <div :class="['app-img u-fx-ac']">
              <img :src="module.icon" alt />
            </div>
            <span @click="changeModule(index)">{{
              module.name.substring(0, 10).split('#')[0]
            }}</span>
          </li>
        </ul>
      </div>
      <div class="qui-fx-f1 qui-fx-ver">
        <div class="current-system">{{ systemName.split('#')[0] }}</div>
        <div class="qui-fx-f1" style="overflow: auto">
          <a-menu
            v-if="appList.length > 0"
            mode="inline"
            :defaultOpenKeys="defaultOpenKeys"
            :selectedKeys="menuIndex"
            @click="onClick"
            style="width: 190px"
          >
            <template v-for="menu in appList">
              <a-menu-item v-if="!menu.children || menu.children.length === 0" :key="menu.id">
                {{ menu.name }}
              </a-menu-item>
              <a-sub-menu v-else :key="menu.id" :title="menu.name">
                <a-menu-item v-for="subItem in menu.children" :key="subItem.id">
                  {{ subItem.name.split('-')[0] }}
                </a-menu-item>
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
    ...mapState('home', ['isEntryApp', 'slideTag', 'appIndex', 'menuList', 'menuIndex']),
    systemName() {
      return this.menuList[this.appIndex] ? this.menuList[this.appIndex].name : ''
    }
  },
  data() {
    return {
      defaultOpenKeys: [],
      appList: [],
      animType: 0
    }
  },
  mounted() {
    /**
     * 刷新当前界面加载
     */
    if (this.menuIndex.length > 0 && this.isEntryApp) {
      this.defaultOpenKeys = this.menuIndex.length > 1 ? [this.menuIndex[1]] : []
      this.appList = this.menuList[this.appIndex] ? this.menuList[this.appIndex].children : []
      this.goPath(this.menuIndex)
    }
  },
  methods: {
    ...mapMutations('home', ['updateState']),
    /**
     * @description 点击左侧模块列表
     */
    changeModule(index) {
      const currentMenu = this.menuList[index]
      /**
       * @des 校端看板
       */
      if (currentMenu.url && currentMenu.url.indexOf('school-view') > -1) {
        window.open(
          currentMenu.url +
            '&schoolCode=' +
            JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolCode +
            '&schoolName=' +
            JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolName
        )
        return
      }
      if (currentMenu.url && currentMenu.url.indexOf('http') > -1) {
        window.open(
          currentMenu.url + '?id=' + JSON.parse(window.sessionStorage.getItem('loginInfo')).id
        )
        return
      }
      this.appList = []
      const item = this.menuList[index].children[0]
      this.animType = 0
      /**
       * 获取初始化模块菜单url路径
       */
      let path, keyArr
      if (item.children && item.children.length > 0) {
        path = item.children[0].url
        keyArr = [item.children[0].id, item.id]
        this.defaultOpenKeys = [item.id]
      } else {
        path = item.url
        keyArr = [item.id]
      }
      this.appList = this.menuList[index] ? this.menuList[index].children : []
      /**
       * 存储当前点击的模块和菜单索引
       */
      this.updateState({
        key: 'appIndex',
        data: index
      })
      this.updateState({
        key: 'menuIndex',
        data: keyArr
      })
      /**
       * 设置进入应用和菜单展开状态值
       */
      if (this.slideTag) {
        this.updateState({
          key: 'isEntryApp',
          data: true
        })
        this.updateState({
          key: 'slideTag',
          data: false
        })
      }
      setTimeout(() => {
        this.$emit('goSrc', path)
      }, 300)
    },
    /**
     * @description 点击左侧菜单列表
     */
    onClick(item) {
      const { keyPath } = item
      this.goPath(keyPath)
    },
    goPath(keyPath) {
      let path
      /**
       * 获取点击菜单url路径
       */
      if (keyPath.length > 1) {
        path = this.menuList[this.appIndex].children
          .find(item => item.id === keyPath[1])
          .children.find(item => item.id === keyPath[0]).url
      } else {
        path = this.menuList[this.appIndex].children.find(item => item.id === keyPath[0]).url
      }
      // 跳转连接
      if (path.indexOf('http') > -1) {
        window.open(path)
        return
      }
      if (path.indexOf('school-view') > -1) {
        window.open(
          path +
            '&schoolCode=' +
            JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolCode +
            '&schoolName=' +
            JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolName
        )
        return
      }
      /**
       * @description 存储当前点击的菜单索引
       */
      this.updateState({
        key: 'menuIndex',
        data: keyPath
      })
      this.$emit('goSrc', path)
    },
    toggleSlide(type) {
      this.animType = type
    },
    onSelect(obj) {
      this.$emit('menuSelect', obj)
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
    width: 240px;
    color: @des-color;
  }
  li {
    width: 240px;
    height: 50px;
    line-height: 50px;
    &:hover {
      background-color: @u-type-primary;
    }
    i {
      font-size: 16px;
      padding-left: 12px;
    }
    span {
      cursor: pointer;
      padding-left: 30px;
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
