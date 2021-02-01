/**
 * @description 注册全局组件
 */
import {
  Alert,
  Pagination,
  Checkbox,
  Radio,
  Row,
  Col,
  Icon,
  Button,
  Layout,
  Dropdown,
  Modal,
  Form,
  Input,
  Menu,
  LocaleProvider,
  ConfigProvider,
  message,
  Empty
} from 'ant-design-vue'
const ComList = [
  Alert,
  Pagination,
  Checkbox,
  Radio,
  Row,
  Col,
  Icon,
  Button,
  Layout,
  Dropdown,
  Modal,
  Form,
  Input,
  Menu,
  LocaleProvider,
  ConfigProvider,
  message,
  Empty
]
const install = Vue => {
  ComList.forEach(item => {
    Vue.use(item)
  })
  Vue.prototype.$message = message
  Vue.prototype.$Modal = Modal
  Vue.prototype.$confirm = Modal.confirm
}

export default {
  install
}
