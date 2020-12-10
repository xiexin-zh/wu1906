<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view v-if="isRouterAlive" />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'

export default {
  mixins: [AppDeviceEnquire],
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      locale: zhCN,
      isRouterAlive: true
    }
  },
  mounted() {},
  methods: {
    reload() {
      this.isRouterAlive = false //先关闭，
      this.$nextTick(function() {
        this.isRouterAlive = true //再打开
      })
    }
  }
}
</script>
<style>
#nprogress .bar {
  height: 3px;
}
#app {
  height: 100%;
}
[v-cloak] {
  display: none !important;
}
</style>
