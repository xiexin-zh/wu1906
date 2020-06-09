// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'
import store from './store/index.js'
import './utils/flexible'
import 'vant/lib/index.css'
import './assets/common.css'
import service from './utils/https'

Vue.prototype.axios=service
Vue.use(Vant)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
