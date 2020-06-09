/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './filters'
import './plugins'
import ElementUI, { Message } from 'element-ui'

Vue.config.productionTip = false

// 设置message提示只显示一个
// 为了实现Class的私有属性
const showMessage = Symbol('showMessage')

class DonMessage {
  success (options:any, single = true) {
    this[showMessage]('success', options, single)
  }
  warning (options:any, single = true) {
    this[showMessage]('warning', options, single)
  }
  info (options:any, single = true) {
    this[showMessage]('info', options, single)
  }
  error (options:any, single = true) {
    this[showMessage]('error', options, single)
  }

  [showMessage] (type:any, options:any, single:any,) {
    if (single) {
      // 判断是否已存在Message
      if (document.getElementsByClassName('el-message').length === 0) {
        Message[type](options)
      }
    } else {
      Message[type](options)
    }
  }
}

Vue.use(ElementUI)
// 命名根据需要，DonMessage只是在文章中使用
Vue.prototype.$message = new DonMessage()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
