/**
 * @description 注册全局组件
 */
import {
  Alert,
  Skeleton,
  Pagination,
  InputNumber,
  Popconfirm,
  Tooltip,
  Row,
  Tree,
  Col,
  Icon,
  Tag,
  Select,
  Table,
  Checkbox,
  Radio,
  DatePicker,
  TimePicker,
  Tabs,
  Button,
  Layout,
  Modal,
  Dropdown,
  Form,
  Input,
  Menu,
  LocaleProvider,
  Popover,
  message,
  upload,
  Cascader,
  Drawer,
  Calendar,
  TreeSelect,
  Timeline,
  Collapse,
  Switch,
  Divider,
  Card,
  Empty,
  Carousel,
  Progress
} from 'ant-design-vue'
const ComList = [
  Carousel,
  Empty,
  Card,
  Divider,
  Alert,
  Skeleton,
  InputNumber,
  Pagination,
  Popconfirm,
  Tooltip,
  Select,
  Checkbox,
  Radio,
  Table,
  Row,
  Col,
  Tree,
  Icon,
  Tag,
  Tabs,
  Button,
  Layout,
  Dropdown,
  DatePicker,
  TimePicker,
  Modal,
  Form,
  Input,
  Menu,
  LocaleProvider,
  Popover,
  message,
  upload,
  Cascader,
  Drawer,
  Calendar,
  TreeSelect,
  Timeline,
  Collapse,
  Switch,
  Progress
]
const install = (Vue) => {
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
