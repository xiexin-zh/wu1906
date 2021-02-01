// ie polyfill
import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import $ajax from '@u/libs/ajax-serve'
import Tools from '@u/libs/tools'
import '@u/filter'
import '@u//directives'
import '@a/css/u-base.less'
import '@a/css/u-flex.css'
import '@a/css/u-common.less'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import AntdPlugin from './assets/js/antd-plugin'
import bootstrap from './store/bootstrap'
import '@/core/use'
Vue.use(AntdPlugin)
Vue.config.productionTip = false
Vue.prototype.$ajax = $ajax
Vue.prototype.$tools = Tools
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
