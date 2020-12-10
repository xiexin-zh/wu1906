<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null]"
    width="240px"
    :trigger="null"
  >
    <logo :slide-tag="slideTag" />
    <div class="qui-fx slide-height">
      <div class="qui-fx-f1">
        <!-- <div class="current-system">
          控制中心
        </div> -->
        <s-menu
          :collapsed="collapsed"
          :menu="menus"
          :theme="theme"
          :mode="mode"
          @select="onSelect"
          style="padding: 0px 0px;"
        ></s-menu>
      </div>
    </div>
  </a-layout-sider>
</template>

<script>
import Logo from '@/components/tools/Logo'
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'SideMenu',
  components: { Logo, SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    slideTag: {
      type: Boolean,
      required: false,
      default: false
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      animType: 0
    }
  },
  methods: {
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
  overflow: hidden;
}
.system-list {
  width: 50px;
  border-right: 1px #dfe1e6 solid;
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
    background: @slide-color;
    overflow: hidden;
  }
  .anim-ul-show {
    width: 240px;
    color: @des-color;
    background-color: @slide-color;
  }
  li {
    width: 240px;
    height: 50px;
    cursor: pointer;
    line-height: 50px;
    padding-left: 5px;
    &:hover {
      background-color: @main-color;
    }
    i {
      font-size: 16px;
      padding-left: 12px;
    }
    span {
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
