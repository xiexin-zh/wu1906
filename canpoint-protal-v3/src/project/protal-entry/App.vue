<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import $http from '@u/libs/ajax-serve'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
export default {
  mixins: [AppDeviceEnquire],
  data() {
    return {
      locale: zhCN
    }
  },
  mounted() {},
  methods: {}
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
