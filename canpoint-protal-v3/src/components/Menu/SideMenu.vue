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
      <div class="u-fx-f1">
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
.current-system {
  height: 50px;
  padding-left: 22px;
  font-size: 16px;
  line-height: 50px;
  border-bottom: 1px #f5f5f5 solid;
}
</style>
