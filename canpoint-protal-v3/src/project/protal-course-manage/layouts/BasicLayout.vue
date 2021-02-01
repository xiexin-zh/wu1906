<template>
  <a-layout class="u-fx">
    <div v-if="isDev" :class="['slide-left', { 'slide-left-close': slideTag }]">
      <side-menu
        mode="inline"
        :menus="menus"
        :theme="navTheme"
        :slide-tag="slideTag"
        :collapsed="collapsed"
      ></side-menu>
    </div>
    <div class="u-fx-f1 u-fx u-fx-ver">
      <header-top @toggle="toggle" :slide-tag="slideTag"></header-top>
      <div class="u-fx-f1 u-fx-ver content-bg">
        <route-navigator></route-navigator>
        <div class="u-fx-f1">
          <route-view />
        </div>
      </div>
    </div>
  </a-layout>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin'

import RouteView from './RouteView'
import SideMenu from '@/components/Menu/SideMenu'
import HeaderTop from '@/components/GlobalHeader/HeaderTop'
import RouteNavigator from '@c/RouteNavigator'
import asyncRouterMap from '../config/router.config.js'
export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    SideMenu,
    HeaderTop,
    RouteNavigator
  },
  data() {
    return {
      isDev: process.env.NODE_ENV !== 'production',
      routeAddress: [],
      slideTag: false,
      menus: asyncRouterMap
    }
  },
  created() {
    this.menus = this.menus
      .find(item => item.path === '/')
      .children.filter(item => {
        return !item.meta.isHide
      })
    this.menus.forEach(item => {
      if (item.children) {
        item.children.forEach((it, index) => {
          if (it.meta.isHide) {
            item.children.splice(index, 1)
          }
        })
      }
    })
    this.collapsed = !this.sidebarOpened
  },
  mounted() {},
  methods: {
    toggle() {
      this.slideTag = !this.slideTag
    }
  }
}
</script>

<style lang="less">
@import url('../../../components/global.less');

/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */
.content-bg {
  margin: 10px 20px 20px;
}
.slide-left {
  transition: width 0.3s ease;
  width: 200px;
  overflow: hidden;
}
.slide-left-close {
  width: 50px;
}
.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
