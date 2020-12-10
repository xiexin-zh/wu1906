import Vue from 'vue'
import App from './App.vue'
import router from './router'
import $ajax from '@u/ajax-serve'
import './rem.js'
import '@a/css/common.less'
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

Vue.prototype.$ajax = $ajax
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
