/**
 * @description 全局引入并注册ucan-charts组件
 */
import Vue from 'vue'
const requireCom = require.context('./components', true, /\.vue$/)
requireCom.keys().forEach(key => {
  const _component = requireCom(key)
  Vue.component(key.split('/')[1], _component.default || _component)
})
