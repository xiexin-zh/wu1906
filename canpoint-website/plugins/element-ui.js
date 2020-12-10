import Vue from 'vue'
// eslint-disable-next-line prettier/prettier
import { Row, Col, Container, Header, Aside, Main, Menu, MenuItem, Button, Form, FormItem, Input, Dialog } from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

// eslint-disable-next-line prettier/prettier
const components = [Row, Col, Container, Header, Aside, Main, Menu, MenuItem, Button, Form, FormItem, Input, Dialog]

const Element = {
  install(Vue) {
    components.forEach((component) => {
      Vue.component(component.name, component)
    })
  },
}

Vue.use(Element, {
  locale,
})
