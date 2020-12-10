/**
 * @description 注册全局组件
 */
import {
  Row,
  Col,
  Checkbox,
  Tabs,
  Button,
  Modal,
  Input,
  message
} from 'ant-design-vue'
const ComList = [
  Row,
  Col,
  Checkbox,
  Tabs,
  Button,
  Modal,
  Input,
  message
]
const install = (Vue) => {
  ComList.forEach(item => {
    Vue.use(item)
  })
  Vue.prototype.$message = message
}

export default {
  install
}
