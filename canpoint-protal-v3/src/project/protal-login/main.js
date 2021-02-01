import Vue from 'vue'
import App from './App.vue'
import '@a/css/u-base.less'
import AntdPlugin from './js/antd-plugin'
Vue.use(AntdPlugin)
new Vue({
  render: h => h(App)
}).$mount('#app')
