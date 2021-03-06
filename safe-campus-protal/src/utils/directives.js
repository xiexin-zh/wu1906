/**
 * @des 注册全局指令
 */

import Vue from 'vue'

const directives = {
  // 示例
  setBg: {
    inserted (el, binding) {
      el.style.backgroundColor = binding.value
    }
  }
}

for (const key in directives) {
  Vue.directive(key, directives[key])
}
