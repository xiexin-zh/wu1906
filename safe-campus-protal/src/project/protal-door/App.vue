<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
import { mapState, mapActions } from 'vuex'

export default {
  mixins: [AppDeviceEnquire],
  computed: {
    ...mapState('home', ['userInfo'])
  },
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
