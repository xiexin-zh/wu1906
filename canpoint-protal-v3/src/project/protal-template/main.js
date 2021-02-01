// ie polyfill
import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import $http from '@u/libs/ajax-serve'
import $tools from '@u/libs/tools'
import '@u/filter'
import '@/ucan-ui'
import '@a/css/u-base.less'
import '@a/css/u-common.less'
import '@a/css/u-flex.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import AntdPlugin from '@a/js/antd-plugin'

import bootstrap from './store/bootstrap'
import '@/core/use'
Vue.use(AntdPlugin)
Vue.config.productionTip = false
Vue.prototype.$http = $http
Vue.prototype.$tools = $tools

new Vue({
  router,
  store,
  created() {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})
